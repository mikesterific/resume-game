aaaw<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script>

<template>
  <div class="home-container">
    <header class="hero-section">
      <h1 class="hero-title">Portfolio Quest</h1>
      <p class="hero-subtitle">Choose Your Adventure</p>
    </header>

    <div class="experience-options">
      <div class="experience-card game-card">
        <div class="card-icon">🚀</div>
        <h2>Space Adventure Game</h2>
        <p>Pilot your spaceship through an interactive portfolio experience with Phaser.js</p>
        <router-link to="/game" class="experience-button game-button">
          Launch Game
        </router-link>
      </div>

      <div class="experience-card museum-card">
        <div class="card-icon">🏛️</div>
        <h2>3D Space Museum</h2>
        <p>Walk through a first-person 3D museum showcasing portfolio projects on the walls</p>
        <router-link to="/museum" class="experience-button museum-button">
          Enter Museum
        </router-link>
      </div>
    </div>

    <footer class="home-footer">
      <p>Built with Vue 3, Three.js, and Phaser.js</p>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #3498db, #e74c3c, #f39c12);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
  text-shadow: 0 0 30px rgba(52, 152, 219, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #bdc3c7;
  margin-bottom: 0;
}

.experience-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
}

.experience-card {
  background: rgba(52, 73, 94, 0.3);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.experience-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.experience-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.experience-card:hover::before {
  opacity: 1;
}

.game-card {
  border-color: #3498db;
}

.game-card:hover {
  border-color: #5dade2;
  box-shadow: 0 20px 40px rgba(52, 152, 219, 0.3);
}

.museum-card {
  border-color: #e74c3c;
}

.museum-card:hover {
  border-color: #ec7063;
  box-shadow: 0 20px 40px rgba(231, 76, 60, 0.3);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.experience-card h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ecf0f1;
}

.experience-card p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.experience-button {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.game-button {
  background: linear-gradient(45deg, #3498db, #5dade2);
  color: white;
}

.game-button:hover {
  background: linear-gradient(45deg, #2980b9, #3498db);
  transform: scale(1.05);
}

.museum-button {
  background: linear-gradient(45deg, #e74c3c, #ec7063);
  color: white;
}

.museum-button:hover {
  background: linear-gradient(45deg, #c0392b, #e74c3c);
  transform: scale(1.05);
}

.home-footer {
  margin-top: 4rem;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .experience-options {
    grid-template-columns: 1fr;
  }
  
  .experience-card {
    padding: 1.5rem;
  }
}
</style>
