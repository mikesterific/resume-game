<script lang="ts">
import { defineComponent } from 'vue'
import TraditionalPortfolio from '../components/portfolio/TraditionalPortfolio.vue'

export default defineComponent({
  name: 'PortfolioView',
  components: {
    TraditionalPortfolio
  }
})
</script>

<template>
  <div class="portfolio-view">
    <header class="portfolio-header">
      <div class="header-content">
        <router-link to="/" class="back-button">← Back to Home</router-link>
        <h1 class="portfolio-title">Portfolio</h1>
        <p class="portfolio-subtitle">Projects, Experience & Accomplishments</p>
      </div>
    </header>
    
    <main class="portfolio-main">
      <TraditionalPortfolio />
    </main>
  </div>
</template>

<style scoped>
.portfolio-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0A1F 0%, #1A1A3A 100%);
  color: #E0E0E0;
}

.portfolio-header {
  background: rgba(42, 42, 74, 0.3);
  border-bottom: 2px solid #2A2A4A;
  padding: 2rem 0;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #00FFFF;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-button:hover {
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  transform: translateY(-50%) translateX(-5px);
}

.portfolio-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #00FFFF, #E0E0E0);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.portfolio-subtitle {
  font-family: 'Roboto', sans-serif;
  font-size: 1.125rem;
  text-align: center;
  color: #B0B0B0;
  margin: 0;
}

.portfolio-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .back-button {
    position: static;
    transform: none;
    display: block;
    margin-bottom: 1rem;
  }

  .portfolio-title {
    font-size: 2rem;
  }

  .portfolio-subtitle {
    font-size: 1rem;
  }

  .header-content {
    padding: 0 1rem;
  }

  .portfolio-main {
    padding: 1rem;
  }
}
</style>
