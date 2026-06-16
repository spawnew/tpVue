<script setup>
import useAuthStore from '../store/useAuth'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted  } from 'vue'
import { supabase } from '../service/supabaseClient'

const authStore = useAuthStore()
const router = useRouter()
const nombreCompleto = ref('')

onMounted(async () => {

  const { data: medico } = await supabase
    .from('medicos')
    .select('*')
    .eq('user_id', authStore.user.id)

  esMedico.value = medico && medico.length > 0

  const tabla = esMedico.value ? 'medicos' : 'pacientes'

  const { data } = await supabase
    .from(tabla)
    .select('nombre, apellido')
    .eq('user_id', authStore.user.id)
    .single()

  if (data?.nombre) {
    nombreCompleto.value = `${data.nombre} ${data.apellido}`
  }
})

const esMedico = ref(false)
</script>

<template>
  <div class="usuario-page">
    <div class="bienvenida">
      <h1>Bienvenido/a</h1>
     <p class="email">{{ nombreCompleto || authStore.user?.email }}</p>
      <span class="badge-rol">{{ esMedico ? '👨‍⚕️ Médico' : '🧑 Paciente' }}</span>
    </div>

    <div v-if="esMedico" class="seccion-panel">
      <h2>Panel médico</h2>
      <div class="botones">
        <RouterLink to="/medico" class="btn-menu btn-primario">📅 Ver turnos</RouterLink>
        <RouterLink to="/perfil" class="btn-menu btn-secundario">👤 Mis datos</RouterLink>
      </div>
    </div>

    <div v-else class="seccion-panel">
      <h2>Mis turnos</h2>
      <div class="botones">
        <RouterLink to="/turnos" class="btn-menu btn-primario">➕ Solicitar turno</RouterLink>
        <RouterLink to="/mis-turnos" class="btn-menu btn-secundario">📋 Ver mis turnos</RouterLink>
        <RouterLink to="/perfil" class="btn-menu btn-secundario">👤 Mis datos</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usuario-page {
  max-width: 600px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Inter', -apple-system, sans-serif;
}

.bienvenida {
  text-align: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.3rem;
}

.email {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.badge-rol {
  display: inline-block;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.seccion-panel {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
}

.seccion-panel h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.botones {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.btn-menu {
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.btn-primario {
  background-color: #0ea5e9;
  color: white;
}

.btn-primario:hover {
  background-color: #0284c7;
  transform: translateY(-1px);
}

.btn-secundario {
  background-color: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn-secundario:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
}
</style>