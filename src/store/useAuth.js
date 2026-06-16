import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from "../service/supabaseClient"

export const useAuthStore = defineStore("auth", () => {
   
    const user = ref(null)
    const loading = ref(false)

    
    const isAuthenticated = computed(() => user.value !== null)
    
  
    const signIn = async ({ email, password }) => {
        loading.value = true
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            user.value = data.user
        } finally {
            loading.value = false
        }
    }

    const signUp = async ({ email, password }) => {
        loading.value = true
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            if (data.user && data.session) {
                user.value = data.user
            }
        } finally {
            loading.value = false
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
    }

    const initAuthListener = () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            user.value = session?.user ?? null
        })
        supabase.auth.onAuthStateChange((event, session) => {
            user.value = session?.user ?? null
        })
    }

    return { isAuthenticated, signIn, signUp, signOut, user, loading, initAuthListener }
}, {
    persist: {
        pick: ["user"]      
    }
})


export default useAuthStore