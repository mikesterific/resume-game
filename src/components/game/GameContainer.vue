<template>
  <div class="game-container">
    <!-- Phaser game mounts here -->
    <div class="game-stage">
      <div id="game-container" class="game-canvas"></div>
    </div>
    
    <!-- Vue UI Overlays -->
    <ProjectModal 
      v-if="activeModal === 'project'"
      :project="selectedProject"
      @close="closeModal"
    />
    
    <SkillModal 
      v-if="activeModal === 'skill'"
      :skill="selectedSkill"
      @close="closeModal"
    />
    
    <ResumeModal 
      v-if="activeModal === 'resume'"
      @close="closeModal"
    />
    
    <ContactModal 
      v-if="activeModal === 'contact'"
      @close="closeModal"
    />
    
    <TraditionalPortfolio 
      v-if="activeModal === 'traditional-portfolio'"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import gameConfig from '@/game/GameConfig'
import gameEventBridge from '@/game/GameEventBridge'
import { portfolioData } from '@/data/portfolio'
import type { ProjectData, SkillData } from '@/types/game'

// Components
import ProjectModal from '@/components/portfolio/ProjectModal.vue'
import SkillModal from '@/components/portfolio/SkillModal.vue'
import ResumeModal from '@/components/portfolio/ResumeModal.vue'
import ContactModal from '@/components/portfolio/ContactModal.vue'
import TraditionalPortfolio from '@/components/portfolio/TraditionalPortfolio.vue'

// Game instance
let game: Phaser.Game | null = null

// UI State
const activeModal = ref<string | null>(null)
const selectedProject = ref<ProjectData | null>(null)
const selectedSkill = ref<SkillData | null>(null)

onMounted(() => {
  initializeGame()
  setupEventListeners()
})

onUnmounted(() => {
  cleanupGame()
})

function initializeGame(): void {
          // Initializing Phaser game
  
  // Create Phaser game instance
  game = new Phaser.Game(gameConfig)
  
          // Game initialized successfully
}

function setupEventListeners(): void {
  // Listen for game events
  gameEventBridge.onGameEvent('game:ready', () => {
            // Game is ready
  })

  gameEventBridge.onGameEvent('game:scene-changed', (data) => {
            // Scene changed
  })

  gameEventBridge.onGameEvent('game:project-selected', (data) => {
    const project = portfolioData.projects.find(p => p.id === data.projectId)
    if (project) {
      selectedProject.value = project
      openModal('project')
    }
  })

  gameEventBridge.onGameEvent('game:skill-selected', (data) => {
    const skill = portfolioData.skills.find(s => s.id === data.skillId)
    if (skill) {
      selectedSkill.value = skill
      openModal('skill')
    }
  })

  gameEventBridge.onGameEvent('game:resume-opened', () => {
    openModal('resume')
  })

  gameEventBridge.onGameEvent('game:contact-opened', () => {
    openModal('contact')
  })

  // Listen for UI events that trigger modals
  gameEventBridge.onGameEvent('ui:modal-opened', (data) => {
    if (data.type === 'traditional-portfolio') {
      openModal('traditional-portfolio')
    }
  })

  // Listen for modal close requests from the game (via setting change workaround)
  gameEventBridge.onGameEvent('ui:setting-changed', (data) => {
    if (data.key === 'closeModal' && data.value === true) {
      closeModal()
    }
  })
}

function openModal(modalType: string): void {
  activeModal.value = modalType
  gameEventBridge.emitGameEvent('ui:modal-opened', { type: modalType })
}

function closeModal(): void {
  activeModal.value = null
  selectedProject.value = null
  selectedSkill.value = null
  gameEventBridge.emitGameEvent('ui:modal-closed', undefined)
}

function cleanupGame(): void {
  if (game) {
          // Cleaning up game instance
    game.destroy(true)
    game = null
  }
  
  // Remove all event listeners
  gameEventBridge.removeAllGameListeners()
}
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #2c3e50;
}

/* Ratio-preserving stage: left-aligned, vertically centered, 16:9 */
.game-stage {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(100vw, calc(100vh * 16 / 9));
  aspect-ratio: 16 / 9;
  /* Height will be computed from width via aspect-ratio */
}

.game-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Ensure Phaser canvas fills the ratio box */
.game-canvas > canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

/* Ensure modals appear above the game */
.game-container :deep(.modal) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}
</style>