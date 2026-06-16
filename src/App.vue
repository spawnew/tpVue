<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/Navbar.vue'
import Footer from './components/Footer/Footer.vue';
</script>

<template>
  <div id="app" class="app-container">
    <NavBar />

    <main class="main-content">
      <RouterView />
    </main>
    
    <Footer />
  </div>
</template>

<style>
/* Reset básico para que no queden márgenes raros en los bordes de la pantalla */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* Contenedor elástico vertical que ocupa el 100% de la pantalla */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Fuerza al contenido del medio a expandirse y empujar al footer abajo */
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>