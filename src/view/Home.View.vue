<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">MediTurnos</h1>
          <p class="hero-subtitle">
            Reservá tu turno médico y accedé a tu historia clínica de forma 100% online en minutos.
          </p>
          <router-link to="/turnos" class="btn-primary">Solicitar Turno Online</router-link>
        </div>
      </div>
    </section>

    <section class="services-grid">
      <div class="service-card">
        <h3 class="card-title">Agendá Citas</h3>
        <p class="card-text">Elegí el día y horario que mejor se adapte a tus necesidades sin demoras ni filas.</p>
        <router-link to="/turnos" class="card-link">Solicitar turno →</router-link>
      </div>

      <div class="service-card">
        <h3 class="card-title">Profesionales Calificados</h3>
        <p class="card-text">Conocé nuestro staff médico de excelencia dedicado a cuidar de tu salud y la de tu familia.</p>
        <router-link to="/especialidades" class="card-link">Ver especialidades →</router-link>
      </div>

      <div class="service-card">
        <h3 class="card-title">Historia Clínica Digital</h3>
        <p class="card-text">Revisá tus recetas electrónicas, resultados de estudios y antecedentes desde cualquier dispositivo.</p>
        <router-link to="/usuario" class="card-link">Ingresar al portal →</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AppHome'
}
</script>

<style scoped>

.hero-section {
  background-image: url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&h=500&fit=crop');
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.hero-overlay {
  background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.5));
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 350px;
}

.hero-content {
  max-width: 700px;
  color: #ffffff;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}


.btn-primary {
  display: inline-block;
  background-color: #0dcaf0;
  color: #111;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: transform 0.2s, background-color 0.2s;
}

.btn-primary:hover {
  background-color: #0baccc;
  transform: translateY(-2px);
}


.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}


.service-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 4px solid #0dcaf0;
}

.card-title {
  font-size: 1.3rem;
  color: #004085;
  margin-bottom: 1rem;
}

.card-text {
  color: #0c0c0c;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.card-link {
  color: #0accc4;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  align-self: flex-start;
}

.card-link:hover {
  text-decoration: underline;
}
</style>