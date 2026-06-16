<script setup>
import { ref } from 'vue'
import { supabase } from '../service/supabaseClient'
import useAuthStore from '../store/useAuth'
import { computed } from 'vue'
const authStore = useAuthStore()

const fecha = ref('')
const hora = ref('')
const especialidadSeleccionada = ref('')
const mensaje = ref('')
const medicos = ref([])
const medicoSeleccionado = ref('')
const hoy = new Date().toISOString().split('T')[0]

const especialidades = [
  'Cardiología',
  'Pediatría',
  'Traumatología',
  'Ginecología y Obstetricia',
  'Dermatología',
  'Neurología'
]

const horariosDisponibles = computed(() => {
 
  if (!fecha.value) {
    return horarios
  }

  const hoy = new Date().toISOString().split('T')[0]

  if (fecha.value !== hoy) {
    return horarios
  }

  const horaActual = new Date().getHours()

  return horarios.filter(hora => {
    const horaTurno = parseInt(hora.split(':')[0])
    return horaTurno > horaActual
  })
})

const horarios = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
]

async function cargarMedicos() {

  console.log("Especialidad:", especialidadSeleccionada.value)

  const { data, error } = await supabase
    .from('medicos')
    .select('*')
    .eq('especialidad', especialidadSeleccionada.value)

  console.log("Data:", data)
  console.log("Error:", error)

  if (!error) {
    medicos.value = data
  }
}

async function solicitarTurno() {
  if (!fecha.value || !hora.value || !especialidadSeleccionada.value) {
    mensaje.value = 'Por favor, completa todos los campos.'
    setTimeout(() => { mensaje.value = '' }, 3000)
    return
  }

  const { data, error } = await supabase
    .from('turnos')
    .insert([
      {
        paciente_id: authStore.user.id,
        fecha: fecha.value,
        hora: hora.value,
        especialidad: especialidadSeleccionada.value, 
        medico_id: medicoSeleccionado.value,
        estado: 'pendiente'
      }
    ])

  if (error) {
    mensaje.value = 'Error al reservar el turno'
  } else {
    mensaje.value = 'Turno reservado correctamente'
    
    fecha.value = ''
    hora.value = ''
    especialidadSeleccionada.value = ''
  }

  setTimeout(() => {
    mensaje.value = ''
  }, 3000)
} 
</script>

<template>
  <div class="horario-container">
    <h1>Solicitar turno</h1>

    <h3>1. Seleccioná la Especialidad</h3>
<select
  v-model="especialidadSeleccionada"
  class="formulario-select"
  @change="cargarMedicos"
>
  <option disabled value="">Elegí una especialidad</option>

  <option
    v-for="esp in especialidades"
    :key="esp"
    :value="esp"
  >
    {{ esp }}
  </option>
</select>

<div v-if="medicos.length > 0">

  <h3>2. Seleccioná un médico</h3>

  <select
    v-model="medicoSeleccionado"
    class="formulario-select"
  >
    <option disabled value="">
      Elegí un médico
    </option>

    <option
      v-for="medico in medicos"
      :key="medico.id"
      :value="medico.id"
    >
      {{ medico.nombre }} {{ medico.apellido }}
    </option>
  </select>

</div>

<h3>3. Seleccioná una Fecha</h3>

<input
  type="date"
  v-model="fecha"
  :min="hoy"
  class="fecha-input"
/>

<h3>4. Seleccioná un Horario</h3>

<select
  v-model="hora"
  class="formulario-select"
>
  <option disabled value="">
    Elegí una hora
  </option>

<option
  v-for="h in horariosDisponibles"
  :key="h"
  :value="h"
>
  {{ h }}
</option>
</select>

    <button
      @click="solicitarTurno"
      class="btn-reservar"
    >
      Reservar turno
    </button>

    <div
      v-if="mensaje"
      class="mensaje"
    >
      {{ mensaje }}
    </div>
  </div>
</template>

<style scoped>
.mensaje {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #d1fae5;
  color: #065f46;
  padding: 20px 35px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  z-index: 1000;
}

.horario-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
}

h3 {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #495057;
}

.formulario-select {
  width: 250px;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: white;
  color: black;
}

.btn-reservar {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 15px;
}

.btn-reservar:hover {
  background-color: #1976d2;
  transform: scale(1.03);
}

.fecha-input {
  width: 250px;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
</style>