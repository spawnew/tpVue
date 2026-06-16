<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../service/supabaseClient'
import useAuthStore from '../store/useAuth'

const authStore = useAuthStore()

const turnos = ref([])

const mostrarModal = ref(false)
const turnoSeleccionado = ref(null)

function abrirModal(id){
  turnoSeleccionado.value = id
  mostrarModal.value = true
}

async function cargarTurnos() {
  const { data, error } = await supabase
    .from('turnos')
    .select('*')
    .eq('paciente_id', authStore.user.id)
    .order('fecha')

  if (!error) {
    turnos.value = data
  }
}

async function cancelarTurno(id) {

  const confirmar = confirm(
    '¿Estás seguro que deseas cancelar el turno?'
  )

  if (!confirmar) return

  const { error } = await supabase
    .from('turnos')
    .update({
      estado: 'cancelado'
    })
    .eq('id', id)

  if (!error) {
    cargarTurnos()
  }
}

async function confirmarCancelacion(){

  const { error } = await supabase
    .from('turnos')
    .update({
      estado: 'cancelado'
    })
    .eq('id', turnoSeleccionado.value)

  if (!error){
    mostrarModal.value = false
    cargarTurnos()
  }
}

onMounted(() => {
  cargarTurnos()
})
</script>

<template>
  <div class="container">
    <h1>Mis turnos</h1>
    
    <div
    v-for="turno in turnos"
    :key="turno.id"
    class="tarjeta-turno"
    :class="{ cancelado: turno.estado === 'cancelado' }"
    >
      <p><strong>Fecha:</strong> {{ turno.fecha }}</p>
      <p><strong>Hora:</strong> {{ turno.hora }}</p>
    <p v-if="turno.estado === 'pendiente'" class="estado-pendiente">
    PENDIENTE
    </p>

    <p v-else class="estado-cancelado">
    CANCELADO
    </p>

<button
  v-if="turno.estado !== 'cancelado'"
  class="btn-cancelar"
  @click="abrirModal(turno.id)"
>
  Cancelar turno
</button>
    </div>
  </div>

  <div
  v-if="mostrarModal"
  class="overlay"
>

  <div class="modal">

    <h2>Cancelar turno</h2>

    <p>
      ¿Estás seguro que deseas cancelar este turno?
    </p>

    <div class="botones-modal">

      <button
        class="btn-volver"
        @click="mostrarModal = false"
      >
        Volver
      </button>

      <button
        class="btn-confirmar"
        @click="confirmarCancelacion"
      >
        Sí, cancelar
      </button>

    </div>

  </div>

</div>
</template>

<style scoped>
.container{
  text-align:center;
}

.tarjeta-turno{
  width:300px;
  margin:20px auto;
  padding:20px;
  border-radius:12px;
  box-shadow:0 2px 10px rgba(0,0,0,.15);
}
.btn-cancelar{
  margin-top: 15px;
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: .2s;
}

.btn-cancelar:hover{
  background-color: #dc2626;
}
.cancelado{
  background-color: #ffe5e5;
  border: 2px solid #ef4444;
  opacity: .8;
}
.estado-pendiente{
  color: #16a34a;
  font-size: 22px;
  font-weight: bold;
}

.estado-cancelado{
  color: #dc2626;
  font-size: 22px;
  font-weight: bold;
}
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);

  display:flex;
  justify-content:center;
  align-items:center;
}

.modal{
  background:white;
  padding:35px;
  border-radius:15px;
  width:350px;
  text-align:center;
}

.botones-modal{
  display:flex;
  justify-content:center;
  gap:15px;
  margin-top:25px;
}

.btn-volver{
  padding:10px 20px;
  border:none;
  border-radius:10px;
  cursor:pointer;
}

.btn-confirmar{
  background:#ef4444;
  color:white;
  border:none;
  padding:10px 20px;
  border-radius:10px;
  cursor:pointer;
}
</style>