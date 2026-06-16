<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../service/supabaseClient'
import useAuthStore from '../store/useAuth'

const authStore = useAuthStore()
const turnosHoy = ref([])
const todosTurnos = ref([])
const busquedaPaciente = ref('')
const tabActiva = ref('hoy')
const cargando = ref(false)
const mensajeAccion = ref('')
const mostrarModal = ref(false)
const turnoSeleccionado = ref(null)
const observaciones = ref('')
const diagnostico = ref('')
const guardandoHC = ref(false)

const hoy = new Date().toISOString().split('T')[0]

async function cargarTurnos() {

  cargando.value = true

  const { data: medico } = await supabase
    .from('medicos')
    .select('id')
    .eq('user_id', authStore.user.id)
    .single()

  const medicoId = medico.id

  const { data: hoyData } = await supabase
    .from('turnos')
    .select('*')
    .eq('medico_id', medicoId)
    .eq('fecha', hoy)
    .neq('estado', 'cancelado')
    .order('hora')

  turnosHoy.value = await enriquecerConPaciente(hoyData || [])

  const { data: todosData } = await supabase
    .from('turnos')
    .select('*')
    .eq('medico_id', medicoId)
    .gte('fecha', hoy)
    .order('fecha')
    .order('hora')

  todosTurnos.value = await enriquecerConPaciente(todosData || [])

  cargando.value = false
}

async function enriquecerConPaciente(turnos) {
  const ids = [...new Set(turnos.map(t => t.paciente_id))]
  const { data: pacientesData } = await supabase
    .from('pacientes')
    .select('user_id, nombre, apellido, dni')
    .in('user_id', ids)
    console.log('Pacientes encontrados:', pacientesData)

  const mapa = {}
  if (pacientesData) {
    pacientesData.forEach(p => { mapa[p.user_id] = p })
  }

  return turnos.map(t => ({
    ...t,
    pacientes: mapa[t.paciente_id] || null
  }))
}
const turnosFiltrados = computed(() => {
  const lista = tabActiva.value === 'hoy' ? turnosHoy.value : todosTurnos.value
  if (!busquedaPaciente.value.trim()) return lista
  const q = busquedaPaciente.value.toLowerCase()
  return lista.filter(t => {
    const nombre = (t.pacientes?.nombre || '').toLowerCase()
    const apellido = (t.pacientes?.apellido || '').toLowerCase()
    const dni = (t.pacientes?.dni || '').toLowerCase()
    return nombre.includes(q) || apellido.includes(q) || dni.includes(q)
  })
})

function formatearFecha(fecha) {
  if (!fecha) return ''
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

function nombrePaciente(turno) {
  if (turno.pacientes?.nombre && turno.pacientes?.apellido) 
    return `${turno.pacientes.nombre} ${turno.pacientes.apellido}`
  return 'Paciente sin nombre'
}
function abrirHistoriaClinica(turno) {
  turnoSeleccionado.value = turno
  observaciones.value = ''
  diagnostico.value = ''
  mostrarModal.value = true
}

async function guardarHistoriaClinica() {
  if (!observaciones.value.trim() && !diagnostico.value.trim()) { alert('Ingresá al menos observaciones o diagnóstico.'); return }
  guardandoHC.value = true
  const { error: hcError } = await supabase.from('historias_clinicas').insert([{
    paciente_id: turnoSeleccionado.value.paciente_id,
    medico_id: authStore.user.id,
    turno_id: turnoSeleccionado.value.id,
    observaciones: observaciones.value,
    diagnostico: diagnostico.value,
    fecha: hoy
  }])
  if (!hcError) {
    await supabase.from('turnos').update({ estado: 'realizado' }).eq('id', turnoSeleccionado.value.id)
    mostrarModal.value = false
    mensajeAccion.value = 'Historia clínica guardada y turno marcado como realizado.'
    setTimeout(() => { mensajeAccion.value = '' }, 4000)
    cargarTurnos()
  } else {
    alert('Error al guardar: ' + hcError.message)
  }
  guardandoHC.value = false
}

async function marcarRealizado(turno) {
  const ok = confirm(`¿Marcar el turno de ${nombrePaciente(turno)} como realizado?`)
  if (!ok) return
  await supabase.from('turnos').update({ estado: 'realizado' }).eq('id', turno.id)
  mensajeAccion.value = 'Turno marcado como realizado.'
  setTimeout(() => { mensajeAccion.value = '' }, 3000)
  cargarTurnos()
}

function badgeEstado(estado) {
  const mapa = { pendiente: 'badge-pendiente', realizado: 'badge-realizado', cancelado: 'badge-cancelado' }
  return mapa[estado] || 'badge-pendiente'
}

onMounted(() => { cargarTurnos() })
</script>

<template>
  <div class="medico-page">
    <div class="medico-header">
      <div>
        <h1>Panel del Médico</h1>
        <p class="subtitulo">Hola, {{ authStore.user?.email }}</p>
      </div>
      <div class="stats">
        <div class="stat-card">
          <span class="stat-num">{{ turnosHoy.length }}</span>
          <span class="stat-label">Turnos hoy</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ todosTurnos.length }}</span>
          <span class="stat-label">Próximos</span>
        </div>
      </div>
    </div>

    <div v-if="mensajeAccion" class="alerta-exito">✅ {{ mensajeAccion }}</div>

    <div class="tabs">
      <button :class="['tab', { activo: tabActiva === 'hoy' }]" @click="tabActiva = 'hoy'">📅 Turnos de hoy</button>
      <button :class="['tab', { activo: tabActiva === 'proximos' }]" @click="tabActiva = 'proximos'">🗓️ Próximos turnos</button>
    </div>

    <div class="buscador-wrapper">
      <input v-model="busquedaPaciente" type="text" placeholder="🔍 Buscar paciente por nombre, apellido o DNI..." class="buscador" />
    </div>

    <div v-if="cargando" class="cargando">Cargando turnos...</div>
    <div v-else-if="turnosFiltrados.length === 0" class="vacio"><p>No hay turnos para mostrar.</p></div>
    <div v-else class="tabla-wrapper">
      <table class="tabla-turnos">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>DNI</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="turno in turnosFiltrados" :key="turno.id">
            <td class="nombre-paciente">{{ nombrePaciente(turno) }}</td>
            <td>{{ turno.pacientes?.dni || '-' }}</td>
            <td>{{ formatearFecha(turno.fecha) }}</td>
            <td>{{ turno.hora }}</td>
            <td>{{ turno.especialidad }}</td>
            <td><span :class="['badge', badgeEstado(turno.estado)]">{{ turno.estado }}</span></td>
            <td class="acciones">
              <button v-if="turno.estado === 'pendiente'" class="btn-hc" @click="abrirHistoriaClinica(turno)">📋 Historia clínica</button>
              <button v-if="turno.estado === 'pendiente'" class="btn-realizado" @click="marcarRealizado(turno)">✓ Realizado</button>
              <span v-if="turno.estado !== 'pendiente'" class="sin-accion">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarModal" class="overlay" @click.self="mostrarModal = false">
      <div class="modal">
        <h2>📋 Historia Clínica</h2>
        <p class="modal-subtitulo">
          Paciente: <strong>{{ nombrePaciente(turnoSeleccionado) }}</strong><br />
          Fecha: {{ formatearFecha(turnoSeleccionado?.fecha) }} — {{ turnoSeleccionado?.hora }}<br />
          Especialidad: {{ turnoSeleccionado?.especialidad }}
        </p>
        <div class="form-group">
          <label>Observaciones</label>
          <textarea v-model="observaciones" rows="4" placeholder="Descripción de la consulta, síntomas observados..."></textarea>
        </div>
        <div class="form-group">
          <label>Diagnóstico</label>
          <textarea v-model="diagnostico" rows="3" placeholder="Diagnóstico y tratamiento indicado..."></textarea>
        </div>
        <div class="modal-botones">
          <button class="btn-cancelar-modal" @click="mostrarModal = false">Cancelar</button>
          <button class="btn-guardar-hc" @click="guardarHistoriaClinica" :disabled="guardandoHC">
            {{ guardandoHC ? 'Guardando...' : '💾 Guardar y cerrar turno' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.medico-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, sans-serif;
}

.medico-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.2rem;
  position: relative;
  padding-left: 15px;
}

h1::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 4px;
  background-color: #0ea5e9;
  border-radius: 2px;
}

.subtitulo {
  color: #64748b;
  font-size: 0.9rem;
  padding-left: 15px;
}

.stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.9rem 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-width: 90px;
}

.stat-num {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0ea5e9;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.alerta-exito {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.tab {
  padding: 0.6rem 1.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.activo {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
  font-weight: 600;
}

.buscador-wrapper {
  margin-bottom: 1.25rem;
}

.buscador {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #f8fafc;
  box-sizing: border-box;
  transition: all 0.2s;
}

.buscador:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.cargando,
.vacio {
  text-align: center;
  color: #64748b;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tabla-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tabla-turnos {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabla-turnos th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-turnos td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.tabla-turnos tr:last-child td {
  border-bottom: none;
}

.tabla-turnos tr:hover td {
  background: #f8fafc;
}

.nombre-paciente {
  font-weight: 600;
  color: #1e293b;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-pendiente {
  background: #fef9c3;
  color: #854d0e;
}

.badge-realizado {
  background: #d1fae5;
  color: #065f46;
}

.badge-cancelado {
  background: #fef2f2;
  color: #dc2626;
}

.acciones {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-hc {
  padding: 0.45rem 0.9rem;
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-hc:hover {
  background: #bae6fd;
}

.btn-realizado {
  padding: 0.45rem 0.9rem;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 7px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.btn-realizado:hover {
  background: #a7f3d0;
}

.sin-accion {
  color: #cbd5e1;
  font-size: 1.1rem;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.modal h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.modal-subtitulo {
  color: #64748b;
  font-size: 0.9rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  line-height: 1.7;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  background: #f8fafc;
  box-sizing: border-box;
  font-family: inherit;
  transition: 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #0ea5e9;
  background: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.modal-botones {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancelar-modal {
  padding: 0.7rem 1.4rem;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
  transition: 0.2s;
}

.btn-cancelar-modal:hover {
  background: #f1f5f9;
}

.btn-guardar-hc {
  padding: 0.7rem 1.4rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.2s;
}

.btn-guardar-hc:hover:not(:disabled) {
  background: #0284c7;
}

.btn-guardar-hc:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>