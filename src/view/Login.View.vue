<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useAuthStore from '../store/useAuth'
import { supabase } from '../service/supabaseClient'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const error = ref('')

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}

async function handlesubmit() {
  error.value = ''

  try {
    if (isLogin.value) {

      await authStore.signIn({
        email: email.value,
        password: password.value
      })

      const isAdmin = authStore.user?.user_metadata?.role === 'admin'

      console.log(authStore.user.id)

      const { data: medico, error } = await supabase
        .from('medicos')
        .select('*')
        .eq('user_id', authStore.user.id)

      console.log('Medico:', medico)
      console.log('Error:', error)

      if (isAdmin) {
        router.push('/admin')
      }
      else if (medico && medico.length > 0) {
        router.push('/medico')
      }
      else {
        router.push('/usuario')
      }

    } else {

      await authStore.signUp({
        email: email.value,
        password: password.value
      })

      router.push('/usuario')
    }

  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <h1>{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h1>

      <form @submit.prevent="handlesubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="authStore.loading" class="login-btn">
          {{ authStore.loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <p class="register-link">
        <a href="#" @click.prevent="toggleMode">
          {{ isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión' }}
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; 
  padding: 2rem;
  background-color: #f8fafc; 
  font-family: 'Inter', -apple-system, sans-serif;
}
.login-container {
  background: #ffffff; 
  border: 1px solid #e2e8f0; 
  border-radius: 16px; 
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.05); 
  box-sizing: border-box;
}
h1 {
  text-align: left; 
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  position: relative;
  padding-left: 15px;
}
h1::before {
  content: "";
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 4px;
  background-color: #0ea5e9; 
  border-radius: 2px;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  text-align: left;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1; 
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8fafc;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.form-group input:focus {
  outline: none;
  border-color: #0ea5e9;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
}
.login-btn {
  width: 100%;
  padding: 0.85rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.15);
}
.login-btn:hover:not(:disabled) {
  background: #0284c7;
  box-shadow: 0 4px 12px -1px rgba(14, 165, 233, 0.25);
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error-message {
  background: #fef2f2; 
  color: #dc2626;
  border: 1px solid #fee2e2;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.register-link {
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 1rem;
}
.register-link a {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}
.register-link a:hover {
  color: #0284c7;
  text-decoration: underline;
}
</style>