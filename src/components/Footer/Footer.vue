<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        
        <div class="footer-col">
          <h3 class="footer-logo">MediTurnos</h3>
          <p class="footer-text">
            Brindamos atención médica integral de excelencia con tecnología de vanguardia y un sólido compromiso humano.
          </p>
        </div>

        

        <div class="footer-col">
          <h4 class="footer-title">Horarios</h4>
          <p class="footer-text"><strong>Guardia Médica:</strong> 24 Horas.</p>
          <p class="footer-text">
            <strong>Consultorios Externos:</strong><br>
            Lun a Vie: 08:00 a 20:00 hs.<br>
            Sábados: 08:00 a 13:00 hs.
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-title">Contacto</h4>
          <p class="footer-text">📍 Av. Yatay 240, Almagro, CABA</p>
          <p class="footer-text">📞 +54 (11) 4981-5555</p>
          <p class="footer-text">✉️ contacto@mediturnos.com.ar</p>
        </div>

      </div>

      
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      anioActual: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  background-color: #1a1d20;
  color: #dee2e6;
  padding: 3rem 1rem 1.5rem 1rem;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}


.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
}

.footer-logo {
  color: #0dcaf0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.footer-title {
  color: #0dcaf0;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-text {
  font-size: 0.9rem;
  color: #adb5bd;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 0.6rem;
}

.footer-link {
  color: #dee2e6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #0dcaf0;
}

.footer-divider {
  border: 0;
  border-top: 1px solid #343a40;
  margin: 2rem 0;
}


.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6c757d;
}

@media (max-width: 576px) {
  .footer-bottom {
    text-align: center;
    flex-direction: column;
  }
}
</style>