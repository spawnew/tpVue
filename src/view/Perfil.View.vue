<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../service/supabaseClient'
import useAuthStore from '../store/useAuth'

const authStore = useAuthStore()

const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const dni = ref('')
const fechaNacimiento = ref('')
const matricula = ref('')
const especialidad = ref('')
const mensaje = ref('')
const tipoMensaje = ref('exito')
const cargando = ref(false)

const role = authStore.user?.user_metadata?.role || 'paciente'
const esMedico = role === 'medico'

const especialidades = ['Cardiología','Pediatría','Traumatología','Ginecología y Obstetricia','Dermatología','Neurología','Clínica Médica','Psiquiatría']

async function cargarPerfil() {
  const tabla = esMedico ? 'medicos' : 'pacientes'
  const { data } = await supabase.from(tabla).select('*').eq('user_id', authStore.user.id).single()
  if (data) {
    nombre.value = data.nombre || ''
    apellido.value = data.apellido || ''
    telefono.value = data.telefono || ''
    dni.value = data.dni || ''
    fechaNacimiento.value = data.fecha_nacimiento || ''
    if (esMedico) {
      matricula.value = data.matricula || ''
      especialidad.value = data.especialidad || ''
    }
  }
}

async function guardarPerfil() {
  cargando.value = true
  mensaje.value = ''
  const tabla = esMedico ? 'medicos' : 'pacientes'
  const payload = {
    user_id: authStore.user.id,
    nombre: nombre.value,
    apellido: apellido.value,
    telefono: telefono.value,
    dni: dni.value,
    fecha_nacimiento: fechaNacimiento.value
  }
  if (esMedico) {
    payload.matricula = matricula.value
    payload.especialidad = especialidad.value
  }
  const { error } = await supabase.from(tabla).upsert(payload, { onConflict: 'user_id' })
  if (error) {
    mensaje.value = 'Error al guardar: ' + error.message
    tipoMensaje.value = 'error'
  } else {
    mensaje.value = '¡Datos guardados correctamente!'
    tipoMensaje.value = 'exito'
  }
  cargando.value = false
  setTimeout(() => { mensaje.value = '' }, 3000)
}

onMounted(() => { cargarPerfil() })
</script>

<template>
  <div class="perfil-page">
    <div class="perfil-container">
      <h1>Mis datos personales</h1>
      <p class="subtitulo">{{ esMedico ? 'Perfil de médico' : 'Perfil de paciente' }}</p>

      <div class="seccion">
        <h2>Información personal</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="nombre" type="text" placeholder="Tu nombre" />
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input v-model="apellido" type="text" placeholder="Tu apellido" />
          </div>
          <div class="form-group">
            <label>DNI</label>
            <input v-model="dni" type="text" placeholder="Ej: 35123456" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="telefono" type="tel" placeholder="Ej: 11 1234-5678" />
          </div>
          <div class="form-group">
            <label>Fecha de nacimiento</label>
            <input v-model="fechaNacimiento" type="date" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input :value="authStore.user?.email" type="email" disabled class="input-disabled" />
          </div>
        </div>
      </div>

      <div v-if="esMedico" class="seccion">
        <h2>Datos profesionales</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Matrícula</label>
            <input v-model="matricula" type="text" placeholder="Ej: MN 123456" />
          </div>
          <div class="form-group">
            <label>Especialidad</label>
            <select v-model="especialidad">
              <option disabled value="">Elegí una especialidad</option>
              <option v-for="esp in especialidades" :key="esp" :value="esp">{{ esp }}</option>
            </select>
          </div>
        </div>
      </div>

      <button class="btn-guardar" @click="guardarPerfil" :disabled="cargando">
        {{ cargando ? 'Guardando...' : 'Guardar datos' }}
      </button>
      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">{{ mensaje }}</div>
    </div>
  </div>
</template>

<style scoped>
.perfil-page {
  min-height: 80vh;
  background-color: #f8fafc;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, sans-serif;
}

.perfil-container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
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
  margin-bottom: 2rem;
  padding-left: 15px;
}

.seccion {
  margin-bottom: 2rem;
}

.seccion h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.7rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: #f8fafc;
  color: #334155;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #0ea5e9;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f1f5f9 !important;
}

.btn-guardar {
  width: 100%;
  padding: 0.85rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-guardar:hover:not(:disabled) {
  background: #0284c7;
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensaje {
  margin-top: 1rem;
  padding: 0.9rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
}

.mensaje.exito {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.mensaje.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

@media (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>