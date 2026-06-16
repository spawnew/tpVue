import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/Home.View.vue'
import TurnosProgramadosView from '../view/TurnosProgramados.View.vue'
import useAuthStore from '../store/useAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/especialidades',
    name: 'Especialidades',
    component: () => import('../view/Especialidades.View.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../view/Login.View.vue') 
  },
  
  {
    path: '/usuario',
    name: 'Usuario',
    component: () => import('../view/Usuario.View.vue'),
    meta: { requiresAuth: true } 
  },
    {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../view/Perfil.View.vue'), 
    meta: { requiresAuth: true } 
  },

 {
    path: '/medico',
    name: 'Medico',
    component: () => import('../view/Medico.View.vue'), 
    meta: { requiresAuth: true, requiresMedico: true }  
  },

  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../view/Admin.View.vue'),
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../view/NotFound.View.vue')
  },
{
  path: '/turnos',
  name: 'Turnos',
  component: () => import('../view/Turnos.View.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/mis-turnos',
  component: TurnosProgramadosView
},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuth = authStore.isAuthenticated
  const isAdmin = authStore.user?.user_metadata?.role === 'admin'

 
  if (to.meta.requiresAuth && !isAuth) {
    next('/login')
  } 
  
  else if (to.meta.requiresAdmin && !isAdmin) {
    next('/usuario') 
  } 
  else {
    next() 
  }
})

export default router