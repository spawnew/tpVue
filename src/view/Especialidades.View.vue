<template>
  <div class="especialidades-container">
    <div class="section-header">
      <h2 class="section-title">Nuestras Especialidades</h2>
      <p class="section-subtitle">
        Contamos con un equipo médico de excelencia dispuesto a cuidar de tu salud en cada etapa de tu vida.
      </p>
    </div>

    <div class="search-box-container">
      <input 
        type="text" 
        v-model="busqueda" 
        placeholder="🔍 Buscar especialidad médica..." 
        class="search-input"
      />
    </div>

    <div v-if="especialidadesFiltradas.length > 0" class="especialidades-grid">
      <div 
        v-for="esp in especialidadesFiltradas" 
        :key="esp.id" 
        class="especialidad-card"
      >
        <div class="card-icon">{{ esp.icono }}</div>
        <h3 class="card-esp-title">{{ esp.nombre }}</h3>
        <p class="card-esp-text">{{ esp.descripcion }}</p>
        
        <div class="staff-container">
          <span class="staff-title">Profesionales:</span>
          <ul class="staff-list">
            <li v-for="(medico, index) in esp.medicos" :key="index">
              👨‍⚕️ {{ medico }}
            </li>
          </ul>
        </div>

        <router-link to="/turnos" class="btn-reservar-esp">Agendar Cita</router-link>
      </div>
    </div>

    <div v-else class="no-results">
      <p>No se encontraron especialidades que coincidan con "{{ busqueda }}".</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppEspecialidades',
  data() {
    return {
      busqueda: '',
     
      especialidades: [
        {
          id: 1,
          nombre: 'Cardiología',
          descripcion: 'Prevención, diagnóstico y tratamiento de enfermedades del corazón y del sistema circulatorio.',
          icono: '❤️',
          medicos: ['Dr. Alejandro Gómez', 'Dra. Marina Silva']
        },
        {
          id: 2,
          nombre: 'Pediatría',
          descripcion: 'Atención integral de la salud de los bebés, niños y adolescentes hasta su desarrollo completo.',
          icono: '👶',
          medicos: ['Dra. Laura Benítez', 'Dr. Carlos Rossi']
        },
        {
          id: 3,
          nombre: 'Traumatología',
          descripcion: 'Especialistas en el tratamiento de lesiones del aparato locomotor (huesos, músculos y articulaciones).',
          icono: '🦴',
          medicos: ['Dr. Esteban Peralta', 'Dra. Sofía Díaz']
        },
        {
          id: 4,
          nombre: 'Ginecología y Obstetricia',
          descripcion: 'Cuidado de la salud reproductiva de la mujer y acompañamiento médico continuo durante el embarazo.',
          icono: '🤰',
          medicos: ['Dra. Patricia Méndez', 'Dra. Elena Vega']
        },
        {
          id: 5,
          nombre: 'Dermatología',
          descripcion: 'Diagnóstico y cuidado de patologías de la piel, pelo, uñas y prevención del daño solar.',
          icono: '✨',
          medicos: ['Dr. Hugo Cáceres']
        },
        {
          id: 6,
          nombre: 'Neurología',
          descripcion: 'Tratamiento especializado de los trastornos del cerebro y del sistema nervioso central.',
          icono: '🧠',
          medicos: ['Dra. Valeria Fuentes', 'Dr. Jorge Castro']
        }
      ]
    }
  },
  computed: {
  
    especialidadesFiltradas() {
      return this.especialidades.filter(esp => 
        esp.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        esp.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())
      )
    }
  }
}
</script>

<style scoped>
.especialidades-container {
  padding: 1rem 0;
}


.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 2.2rem;
  color: #004085;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.section-subtitle {
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.5;
}


.search-box-container {
  max-width: 500px;
  margin: 0 auto 3rem auto;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #0dcaf0;
  box-shadow: 0 0 8px rgba(13, 202, 240, 0.15);
}

.especialidades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}


.especialidad-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-top: 4px solid #0dcaf0;
  display: flex;
  flex-direction: column;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-esp-title {
  font-size: 1.4rem;
  color: #1a1d20;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.card-esp-text {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1; 
}


.staff-container {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.staff-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #495057;
  display: block;
  margin-bottom: 0.5rem;
}

.staff-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.staff-list li {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.3rem;
}

.staff-list li:last-child {
  margin-bottom: 0;
}


.btn-reservar-esp {
  display: block;
  text-align: center;
  background-color: #1a1d20;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 0.7rem;
  border-radius: 6px;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-reservar-esp:hover {
  background-color: #0dcaf0;
  color: #111;
}

.btn-reservar-esp:active {
  transform: scale(0.98);
}


.no-results {
  text-align: center;
  padding: 3rem;
  background-color: #ffffff;
  border-radius: 8px;
  color: #777;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
</style>