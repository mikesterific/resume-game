<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content hud-modal">
      <button class="close-button" @click="$emit('close')">&times;</button>

      <div class="hud-container">
        <!-- Radar -->
        <RadarScreen :blips="radarBlips" />

        <!-- Telemetry -->
        <div class="telemetry">
                  <div class="telemetry-box">
          <span class="label">VECTOR</span>
          <span class="value">{{ (radarTelemetry.vector ?? 0).toFixed(1) }} m/s</span>
        </div>
        <div class="telemetry-box">
          <span class="label">STATION HEALTH</span>
          <span class="value">{{ radarTelemetry.stationHealth }}%</span>
        </div>
        </div>

        <!-- Station/Skill Info -->
        <div class="station-card">
          <div class="card-header">
            <div class="icon">{{ skill?.icon }}</div>
            <h2>{{ skill?.name }}</h2>
          </div>

          <button class="category-btn" v-if="skill?.category">
            {{ formatCategory(skill?.category) }}
          </button>

          <p v-if="skill?.description" class="description">
            {{ skill?.description }}
          </p>

          <div class="proficiency">
            <span>Proficiency Level</span>
            <span class="level">{{ getLevelText(skill?.level) }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${(skill?.level || 0) * 20}%` }"></div>
          </div>

          <div class="tags" v-if="getTechnologiesForSkill(skill).length">
            <span v-for="tag in getTechnologiesForSkill(skill)" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="projects" v-if="getRelatedProjects(skill?.category).length">
            <div
              v-for="project in getRelatedProjects(skill?.category)"
              :key="project.id"
              class="project"
              @click="openProject(project.id)"
            >
              <strong>{{ project.title }}</strong>
              <span>{{ formatProjectType(project.type) }}</span>
            </div>
          </div>

          <button class="dock-btn" @click="$emit('close')">
            BACK TO GAME
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { SkillData, ProjectData, EnemyRadarData, RadarBlip } from '@/types/game'
import gameEventBridge from '@/game/GameEventBridge'
import { portfolioData } from '@/data/portfolio'
import RadarScreen from '@/components/portfolio/RadarScreen.vue'

// Category to project mapping for related projects lookup
const CATEGORY_PROJECT_MAP: Record<string, string[]> = {
  frontend: ['portfolio-quest', 'dell-xps-poc', 'dell-xps-landing', 'dell-home-poc', 'dell-home-live', 'ea-support-site'],
  testing: ['portfolio-quest'],
  architecture: ['dell-home-live', 'ea-support-site', 'portfolio-quest'],
  tooling: ['portfolio-quest'],
  ai: [],
  security: [],
  leadership: ['dell-home-live', 'ea-support-site'],
}

export default defineComponent({
  name: 'SkillModal',
  props: {
    skill: { type: Object as () => SkillData | null, default: null },
  },
  emits: ['close'],
  components: { RadarScreen },
  data() {
    return {
      radarTelemetry: {
        vector: 0.2,
        stationHealth: 92,
      },
      enemyData: null as EnemyRadarData | null,
      combatEnabled: false, // Track combat/enemy setting
      radarStation: null as { id: string; x: number; y: number; name: string } | null // Station that opened this modal
    }
  },
  computed: {
    radarBlips(): RadarBlip[] {
      console.log('🎯 RADAR DEBUG: Computing radarBlips...')
      console.log('🎯 RADAR DEBUG: combatEnabled:', this.combatEnabled)
      console.log('🎯 RADAR DEBUG: enemyData:', this.enemyData)
      console.log('🎯 RADAR DEBUG: radarStation:', this.radarStation)
      
      // If combat/enemies are disabled, show no blips
      if (!this.combatEnabled) {
        console.log('🎯 RADAR DEBUG: Combat disabled, returning empty array')
        return []
      }

      // Always show blips when a station modal is open, regardless of combat setting
      if (this.radarStation) {
        console.log('🎯 RADAR DEBUG: Station modal is open, ensuring blips are shown')
        
        // Use real enemy data if available, transform to station-centered coordinates
        if (this.enemyData && this.enemyData.enemies.length > 0) {
          console.log('🎯 RADAR DEBUG: Processing real enemy data with station centering')
          
          const transformedBlips = this.enemyData.enemies.map(enemy => {
            // Convert radar coordinates back to world coordinates using original center
            const radarRadius = 130 // UI_CONFIG.radar.radius
            const gameWorldRadius = 450 // UI_CONFIG.radar.gameWorldRadius
            const originalCenter = this.enemyData!.playerPosition
            
            console.log(`🎯 RADAR DEBUG: Enemy ${enemy.id} original radar coords: (${enemy.x}, ${enemy.y})`)
            console.log('🎯 RADAR DEBUG: Original center (player/docked station):', originalCenter)
            
            // Radar -> World coordinate conversion
            const worldX = originalCenter.x + (enemy.x / radarRadius) * gameWorldRadius
            const worldY = originalCenter.y + (enemy.y / radarRadius) * gameWorldRadius
            
            console.log(`🎯 RADAR DEBUG: Enemy ${enemy.id} world coords: (${worldX}, ${worldY})`)
            console.log('🎯 RADAR DEBUG: Modal station position:', this.radarStation)
            
            // World -> New radar coordinates using modal station as center
            const relativeX = worldX - this.radarStation!.x
            const relativeY = worldY - this.radarStation!.y
            const newRadarX = (relativeX / gameWorldRadius) * radarRadius
            const newRadarY = (relativeY / gameWorldRadius) * radarRadius
            
            console.log(`🎯 RADAR DEBUG: Enemy ${enemy.id} relative to station: (${relativeX}, ${relativeY})`)
            console.log(`🎯 RADAR DEBUG: Enemy ${enemy.id} new radar coords: (${newRadarX}, ${newRadarY})`)
            
            // Clamp to radar bounds
            const clampedBlip = {
              x: Math.max(-radarRadius, Math.min(radarRadius, newRadarX)),
              y: Math.max(-radarRadius, Math.min(radarRadius, newRadarY)),
              key: enemy.id
            }
            
            console.log(`🎯 RADAR DEBUG: Enemy ${enemy.id} final clamped coords: (${clampedBlip.x}, ${clampedBlip.y})`)
            return clampedBlip
          })
          
          console.log('🎯 RADAR DEBUG: Returning transformed blips:', transformedBlips)
          return transformedBlips
        }
        
        // Station modal is open but no real enemies - show fallback test data for demonstration
        console.log('🎯 RADAR DEBUG: Station modal open but no real enemies, using fallback test data')
        return [
          { x: -45, y: 30, key: 'test-enemy-1' },
          { x: 60, y: -80, key: 'test-enemy-2' },
          { x: -20, y: 70, key: 'test-enemy-3' }
        ]
      }
      
      // No station modal open - respect combat setting
      console.log('🎯 RADAR DEBUG: No station modal open, returning empty array')
      return []
    }
  },
  watch: {
    skill: {
      handler(newSkill) {
        console.log('🎯 RADAR DEBUG: Skill prop changed:', newSkill)
        if (newSkill) {
          // Give a moment for any events to fire, then set fallback if needed
          setTimeout(() => {
            this.setFallbackRadarStation()
          }, 50)
        }
      },
      immediate: true
    }
  },
  mounted() {
    console.log('🎯 RADAR DEBUG: SkillModal mounted, setting up event listeners')
    
    // Listen for enemy position updates
    gameEventBridge.onGameEvent('game:enemy-positions-updated', this.handleEnemyUpdate)
    
    // Listen for combat setting changes
    gameEventBridge.onGameEvent('ui:setting-changed', this.handleSettingChange)
    
    // Listen for skill selection to capture which station opened the modal
    gameEventBridge.onGameEvent('game:skill-selected', this.handleSkillSelected)
    
    // Initialize combat setting from localStorage
    this.initializeCombatSetting()
    
    console.log('🎯 RADAR DEBUG: Event listeners set up, radarStation:', this.radarStation)
    
    // Set fallback radar station after a brief delay to allow events to fire
    setTimeout(() => {
      this.setFallbackRadarStation()
    }, 100)
  },
  unmounted() {
    // Clean up event listeners to prevent memory leaks
    gameEventBridge.offGameEvent('game:enemy-positions-updated', this.handleEnemyUpdate)
    gameEventBridge.offGameEvent('ui:setting-changed', this.handleSettingChange)
    gameEventBridge.offGameEvent('game:skill-selected', this.handleSkillSelected)
  },
  methods: {
    initializeCombatSetting() {
      // Read combat setting from localStorage, matching GameUIScene logic
      const stored = localStorage.getItem('portfolioQuest_combatEnabled')
      this.combatEnabled = stored ? JSON.parse(stored) : false
      console.log('🎯 RADAR DEBUG: Combat setting initialized:', this.combatEnabled)
    },

    // Fallback method to set radar station if not set via event
    setFallbackRadarStation() {
      if (!this.radarStation && this.skill) {
        console.log('🎯 RADAR DEBUG: No radarStation set, creating fallback based on skill:', this.skill)
        // Create a fallback station position (this won't be accurate but will show blips)
        this.radarStation = {
          id: `${this.skill.id}-station`,
          x: 800, // Default position
          y: 400, // Default position  
          name: `${this.skill.name} Station`
        }
        console.log('🎯 RADAR DEBUG: Fallback radarStation set:', this.radarStation)
      }
    },

    handleEnemyUpdate(data: EnemyRadarData) {
      // Update enemy data which will trigger radarBlips computed property
      this.enemyData = data
    },

    handleSettingChange(data: { key: string; value: any }) {
      // Update combat setting when it changes
      if (data.key === 'combatEnabled') {
        this.combatEnabled = data.value
      }
    },

    handleSkillSelected(data: { skillId: string; stationData: { id: string; x: number; y: number; name: string } }) {
      // Capture which station opened this modal for radar centering
      console.log('🎯 RADAR DEBUG: SkillModal received skill-selected event:', data)
      this.radarStation = data.stationData
      console.log('🎯 RADAR DEBUG: radarStation set to:', this.radarStation)
    },

    getRelatedProjects(category?: string): ProjectData[] {
      if (!category) return []
      const projectIds = CATEGORY_PROJECT_MAP[category] || []
      return portfolioData.projects.filter((p) => projectIds.includes(p.id))
    },

    getTechnologiesForSkill(skill?: SkillData | null): string[] {
      if (!skill) return []
      const relatedProjects = this.getRelatedProjects(skill.category)
      const technologies = relatedProjects.flatMap(p => p.technologies)
      return Array.from(new Set(technologies)).slice(0, 10) // Dedupe and limit to 10
    },

    formatCategory(category?: string): string {
      if (!category) return ''
      const categoryMap: Record<string, string> = {
        frontend: 'Front-End Development',
        testing: 'Testing & Quality Assurance',
        architecture: 'Architecture & State Management',
        tooling: 'Build Tools & Development',
        ai: 'AI & Machine Learning',
        security: 'Security & Accessibility',
        leadership: 'Thought Leadership',
      }
      return categoryMap[category] || category
    },

    getLevelText(level?: number): string {
      if (!level) return 'Beginner'
      const levelMap: Record<number, string> = {
        1: 'Beginner',
        2: 'Novice',
        3: 'Intermediate',
        4: 'Advanced',
        5: 'Expert',
      }
      return levelMap[level] || 'Beginner'
    },

    formatProjectType(type: string): string {
      const typeMap: Record<string, string> = {
        web: 'Web App',
        mobile: 'Mobile App',
        game: 'Game',
        library: 'Library',
      }
      return typeMap[type] || type
    },

    openProject(projectId: string): void {
      gameEventBridge.emitGameEvent('game:project-selected', { projectId })
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}


.modal-content.hud-modal {
  position: relative;
  background: radial-gradient(circle at center, #0a0f1c, #000);
  border: 1px solid rgba(0, 255, 255, 0.25);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  max-width: 980px;
  width: 95%;
  max-height: 85vh;
  overflow: hidden;
  padding: 24px;
  animation: slideIn 0.3s ease-out;
  color: #9efcff;
  font-family: 'Orbitron', sans-serif;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9efcff;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  position: absolute;
  top: 8px;
  right: 8px;
}

.close-button:hover {
  background: rgba(0, 255, 255, 0.1);
  color: #ff6b6b;
}

/* HUD container (from Screen.vue) */
.hud-container {
  display: flex;
  gap: 2rem;
  padding: 0.5rem;
  color: #9efcff;
}

/* Radar */
.radar {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 255, 0.3);
  flex: 0 0 auto;
}

.radar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(0, 255, 255, 0.18),
    rgba(0, 255, 255, 0.0) 35%
  );
  animation: radar-rotate 3s linear infinite;
}

.circle {
  position: absolute;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
}

.circle1 { width: 100%; height: 100%; top: 0; left: 0; }
.circle2 { width: 75%; height: 75%; top: 12.5%; left: 12.5%; }
.circle3 { width: 50%; height: 50%; top: 25%; left: 25%; }
.circle4 { width: 25%; height: 25%; top: 37.5%; left: 37.5%; }

.crosshair {
  position: absolute;
  background: rgba(0, 255, 255, 0.3);
}

.crosshair.vertical { width: 1px; height: 100%; left: 50%; top: 0; }
.crosshair.horizontal { width: 100%; height: 1px; top: 50%; left: 0; }

.blip {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.8), 0 0 12px rgba(0, 255, 255, 0.4);
  animation: blipPulse 1.6s ease-in-out infinite;
}

/* Telemetry */
.telemetry {
  position: absolute;
  left: 24px;
  top: 290px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.telemetry-box {
  border: 1px solid rgba(0, 255, 255, 0.3);
  padding: 0.5rem 0.75rem;
  background: rgba(0, 20, 40, 0.6);
}

.label {
  display: block;
  font-size: 0.7rem;
  opacity: 0.8;
}

.value {
  font-size: 1.1rem;
}

/* Station (Skill) card */
.station-card {
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  padding: 1rem;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header .icon {
  font-size: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.category-btn {
  background: #ffb347;
  border: none;
  color: #000;
  padding: 0.3rem 0.6rem;
  font-weight: bold;
  cursor: default;
  align-self: flex-start;
}

.description {
  margin: 0;
  color: #bdefff;
  line-height: 1.5;
}

.proficiency {
  display: flex;
  justify-content: space-between;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.1);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(to right, #00d4ff, #00ff99);
  height: 100%;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  border: 1px solid rgba(0, 255, 255, 0.3);
  padding: 0.2rem 0.4rem;
}

.projects {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project {
  background: rgba(0, 255, 255, 0.05);
  padding: 0.4rem 0.5rem;
  border: 1px solid rgba(0, 255, 255, 0.2);
  cursor: pointer;
}

.project:hover {
  background: rgba(0, 255, 255, 0.1);
}

.dock-btn {
  background: linear-gradient(to right, #00d4ff, #00ff99);
  border: none;
  padding: 0.6rem;
  font-weight: bold;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes radar-rotate {
  to { transform: rotate(360deg); }
}

@keyframes blipPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
}

@media (max-width: 768px) {
  .hud-container {
    flex-direction: column;
    align-items: center;
  }

  .telemetry {
    position: static;
    width: 100%;
    flex-direction: row;
  }

  .station-card {
    width: 100%;
  }
}
</style>