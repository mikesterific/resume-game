<template>
  <div ref="museumContainer" class="space-museum-container">
    <canvas ref="museumCanvas" class="museum-canvas"></canvas>
    
    <!-- UI Overlay -->
    <div class="museum-ui-overlay">
      <!-- Crosshair -->
      <div class="crosshair">
        <div class="crosshair-dot"></div>
      </div>
      
      <!-- Interaction Prompt -->
      <div v-if="interactionPrompt" class="interaction-prompt">
        {{ interactionPrompt }}
      </div>
      
      <!-- Instructions -->
      <div class="instructions">
        <p>WASD: Move | Mouse: Look Around | Click: Interact with Portfolio Pieces</p>
        <p>ESC: Exit Museum</p>
      </div>
      
      <!-- Loading Screen -->
      <div v-if="isLoading" class="loading-screen">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Loading Space Museum...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { portfolioData } from '@/data/portfolio'
import type { ProjectData } from '@/types/game'

interface MuseumState {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  controls: PointerLockControls | null
  clock: THREE.Clock | null
  raycaster: THREE.Raycaster | null
  mouse: THREE.Vector2 | null
  portfolioFrames: Array<{
    mesh: THREE.Mesh
    projectData: ProjectData
  }>
  moveForward: boolean
  moveBackward: boolean
  moveLeft: boolean
  moveRight: boolean
  velocity: THREE.Vector3
}

export default defineComponent({
  name: 'SpaceMuseum',
  props: {
    modalOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['project-selected', 'exit-museum'],
  setup(props, { emit }) {
    // Reactive refs
    const museumContainer = ref<HTMLDivElement>()
    const museumCanvas = ref<HTMLCanvasElement>()
    const isLoading = ref(true)
    const interactionPrompt = ref('')
    
    // Museum state
    const state: MuseumState = {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      clock: null,
      raycaster: null,
      mouse: null,
      portfolioFrames: [],
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      velocity: new THREE.Vector3()
    }

    // Initialize the 3D museum
    const initializeMuseum = async (): Promise<void> => {
      if (!museumCanvas.value || !museumContainer.value) return

      try {
        // Scene setup
        state.scene = new THREE.Scene()
        state.scene.fog = new THREE.Fog(0x000011, 50, 200)
        
        // Camera setup
        state.camera = new THREE.PerspectiveCamera(
          75,
          museumContainer.value.clientWidth / museumContainer.value.clientHeight,
          0.1,
          1000
        )
        state.camera.position.set(0, 1.8, 10) // Human height perspective
        
        // Renderer setup
        state.renderer = new THREE.WebGLRenderer({ 
          canvas: museumCanvas.value,
          antialias: true
        })
        state.renderer.setSize(
          museumContainer.value.clientWidth,
          museumContainer.value.clientHeight
        )
        state.renderer.setClearColor(0x000011)
        state.renderer.shadowMap.enabled = true
        state.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        
        // Controls setup
        state.controls = new PointerLockControls(state.camera, state.renderer.domElement)
        
        // Initialize other components
        state.clock = new THREE.Clock()
        state.raycaster = new THREE.Raycaster()
        state.mouse = new THREE.Vector2()
        
        // Build the museum environment
        await createMuseumEnvironment()
        await createPortfolioDisplays()
        setupLighting()
        setupEventListeners()
        
        // Start the render loop
        animate()
        
        isLoading.value = false
      } catch (error) {
        console.error('Failed to initialize Space Museum:', error)
        isLoading.value = false
      }
    }

    // Create the museum environment (walls, floor, ceiling)
    const createMuseumEnvironment = async (): Promise<void> => {
      if (!state.scene) return

      // Floor
      const floorGeometry = new THREE.PlaneGeometry(100, 100)
      const floorMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x2c3e50,
        transparent: true,
        opacity: 0.8
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      floor.receiveShadow = true
      state.scene.add(floor)

      // Ceiling
      const ceiling = new THREE.Mesh(floorGeometry, floorMaterial)
      ceiling.rotation.x = Math.PI / 2
      ceiling.position.y = 10
      state.scene.add(ceiling)

      // Walls
      const wallHeight = 10
      const wallWidth = 100
      const wallGeometry = new THREE.PlaneGeometry(wallWidth, wallHeight)
      const wallMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x34495e,
        transparent: true,
        opacity: 0.9
      })

      // North Wall
      const northWall = new THREE.Mesh(wallGeometry, wallMaterial)
      northWall.position.set(0, wallHeight / 2, -50)
      state.scene.add(northWall)

      // South Wall  
      const southWall = new THREE.Mesh(wallGeometry, wallMaterial)
      southWall.position.set(0, wallHeight / 2, 50)
      southWall.rotation.y = Math.PI
      state.scene.add(southWall)

      // East Wall
      const eastWall = new THREE.Mesh(wallGeometry, wallMaterial)
      eastWall.position.set(50, wallHeight / 2, 0)
      eastWall.rotation.y = -Math.PI / 2
      state.scene.add(eastWall)

      // West Wall
      const westWall = new THREE.Mesh(wallGeometry, wallMaterial)
      westWall.position.set(-50, wallHeight / 2, 0)
      westWall.rotation.y = Math.PI / 2
      state.scene.add(westWall)

      // Add some space-themed decorations
      createSpaceDecorations()
    }

    // Create space-themed decorations
    const createSpaceDecorations = (): void => {
      if (!state.scene) return

      // Add floating particles/stars
      const starGeometry = new THREE.BufferGeometry()
      const starCount = 200
      const positions = new Float32Array(starCount * 3)
      
      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200
        positions[i + 1] = Math.random() * 20
        positions[i + 2] = (Math.random() - 0.5) * 200
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const starMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
      })
      
      const stars = new THREE.Points(starGeometry, starMaterial)
      state.scene.add(stars)
    }

    // Create portfolio displays on the walls
    const createPortfolioDisplays = async (): Promise<void> => {
      if (!state.scene) return

      const projects = portfolioData.projects
      const wallPositions = [
        { wall: 'north', x: 0, z: -49, rotation: 0 },
        { wall: 'south', x: 0, z: 49, rotation: Math.PI },
        { wall: 'east', x: 49, z: 0, rotation: -Math.PI / 2 },
        { wall: 'west', x: -49, z: 0, rotation: Math.PI / 2 }
      ]

      let projectIndex = 0
      
      for (const wallPos of wallPositions) {
        const projectsPerWall = Math.ceil(projects.length / wallPositions.length)
        const wallProjects = projects.slice(projectIndex, projectIndex + projectsPerWall)
        
        wallProjects.forEach((project, index) => {
          createPortfolioFrame(project, wallPos, index, wallProjects.length)
        })
        
        projectIndex += projectsPerWall
      }
    }

    // Create individual portfolio frame
    const createPortfolioFrame = (
      project: ProjectData,
      wallPos: any,
      index: number,
      totalOnWall: number
    ): void => {
      if (!state.scene) return

      // Frame geometry
      const frameWidth = 8
      const frameHeight = 6
      const frameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight)
      
      // Create a canvas texture for the project info
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 384
      const ctx = canvas.getContext('2d')!
      
      // Draw project information on canvas
      ctx.fillStyle = '#2c3e50'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#ecf0f1'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(project.title, canvas.width / 2, 60)
      
      ctx.font = '18px Arial'
      ctx.fillStyle = '#bdc3c7'
      const words = project.description.split(' ')
      let line = ''
      let y = 120
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width
        
        if (testWidth > canvas.width - 40 && n > 0) {
          ctx.fillText(line, canvas.width / 2, y)
          line = words[n] + ' '
          y += 25
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, canvas.width / 2, y)
      
      // Technologies
      ctx.fillStyle = '#3498db'
      ctx.font = '16px Arial'
      ctx.fillText(project.technologies.join(' • '), canvas.width / 2, y + 60)
      
      const texture = new THREE.CanvasTexture(canvas)
      const frameMaterial = new THREE.MeshLambertMaterial({ map: texture })
      
      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial)
      
      // Position frame on wall
      const spacing = 20
      const startX = -(totalOnWall - 1) * spacing / 2
      const frameX = wallPos.x + Math.cos(wallPos.rotation) * 0.1
      const frameZ = wallPos.z + Math.sin(wallPos.rotation) * 0.1
      
      frameMesh.position.set(
        frameX + Math.cos(wallPos.rotation + Math.PI / 2) * (startX + index * spacing),
        4,
        frameZ + Math.sin(wallPos.rotation + Math.PI / 2) * (startX + index * spacing)
      )
      frameMesh.rotation.y = wallPos.rotation
      
      state.scene.add(frameMesh)
      state.portfolioFrames.push({
        mesh: frameMesh,
        projectData: project
      })
    }

    // Setup lighting
    const setupLighting = (): void => {
      if (!state.scene) return

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
      state.scene.add(ambientLight)

      // Directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      state.scene.add(directionalLight)

      // Point lights for atmosphere
      const pointLight1 = new THREE.PointLight(0x3498db, 0.5, 30)
      pointLight1.position.set(-20, 8, -20)
      state.scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0xe74c3c, 0.5, 30)
      pointLight2.position.set(20, 8, 20)
      state.scene.add(pointLight2)
    }

    // Setup event listeners
    const setupEventListeners = (): void => {
      if (!state.controls || !museumContainer.value) return

      // Pointer lock
      museumContainer.value.addEventListener('click', () => {
        state.controls?.lock()
      })

      state.controls.addEventListener('lock', () => {
        interactionPrompt.value = ''
      })

      // Keyboard controls
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('keyup', onKeyUp)
      
      // Mouse controls for interaction
      document.addEventListener('click', onMouseClick)
      document.addEventListener('mousemove', onMouseMove)
      
      // ESC to exit
      document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && state.controls?.isLocked) {
          exitMuseum()
        }
      })
    }

    // Keyboard event handlers
    const onKeyDown = (event: KeyboardEvent): void => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          state.moveForward = true
          break
        case 'ArrowLeft':
        case 'KeyA':
          state.moveLeft = true
          break
        case 'ArrowDown':
        case 'KeyS':
          state.moveBackward = true
          break
        case 'ArrowRight':
        case 'KeyD':
          state.moveRight = true
          break
      }
    }

    const onKeyUp = (event: KeyboardEvent): void => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          state.moveForward = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          state.moveLeft = false
          break
        case 'ArrowDown':
        case 'KeyS':
          state.moveBackward = false
          break
        case 'ArrowRight':
        case 'KeyD':
          state.moveRight = false
          break
      }
    }

    // Mouse event handlers
    const onMouseMove = (event: MouseEvent): void => {
      if (!state.mouse || !museumContainer.value) return
      
      state.mouse.x = (event.clientX / museumContainer.value.clientWidth) * 2 - 1
      state.mouse.y = -(event.clientY / museumContainer.value.clientHeight) * 2 + 1
    }

    const onMouseClick = (): void => {
      // Don't handle clicks if modal is open
      if (props.modalOpen) return
      
      if (!state.raycaster || !state.camera || !state.mouse) return
      
      state.raycaster.setFromCamera(state.mouse, state.camera)
      const intersects = state.raycaster.intersectObjects(
        state.portfolioFrames.map(frame => frame.mesh)
      )
      
      if (intersects.length > 0) {
        const clickedFrame = state.portfolioFrames.find(
          frame => frame.mesh === intersects[0].object
        )
        
        if (clickedFrame) {
          handleProjectInteraction(clickedFrame.projectData.id)
        }
      }
    }

    // Handle project interaction - emit event instead of using game bridge
    const handleProjectInteraction = (projectId: string): void => {
      // Release pointer lock when opening a modal
      if (state.controls && state.controls.isLocked) {
        document.exitPointerLock()
      }
      emit('project-selected', { projectId })
    }

    // Exit museum - emit event instead of using game bridge
    const exitMuseum = (): void => {
      emit('exit-museum')
    }

    // Animation loop
    const animate = (): void => {
      if (!state.scene || !state.camera || !state.renderer || !state.controls || !state.clock) return

      requestAnimationFrame(animate)

      const delta = state.clock.getDelta()

      // Handle movement
      state.velocity.x -= state.velocity.x * 10.0 * delta
      state.velocity.z -= state.velocity.z * 10.0 * delta

      const speed = 20.0
      if (state.moveForward) state.velocity.z -= speed * delta
      if (state.moveBackward) state.velocity.z += speed * delta
      if (state.moveLeft) state.velocity.x -= speed * delta
      if (state.moveRight) state.velocity.x += speed * delta

      state.controls.moveRight(-state.velocity.x * delta)
      state.controls.moveForward(-state.velocity.z * delta)

      // Check for nearby portfolio frames
      checkPortfolioProximity()

      state.renderer.render(state.scene, state.camera)
    }

    // Check proximity to portfolio frames
    const checkPortfolioProximity = (): void => {
      if (!state.camera) return
      
      const playerPosition = state.camera.position
      let nearestFrame: { mesh: THREE.Mesh; projectData: ProjectData } | null = null
      let minDistance = Infinity
      
      state.portfolioFrames.forEach(frame => {
        const distance = playerPosition.distanceTo(frame.mesh.position)
        if (distance < 15 && distance < minDistance) {
          minDistance = distance
          nearestFrame = frame
        }
      })
      
      if (nearestFrame && nearestFrame.projectData) {
        interactionPrompt.value = `Click to explore: ${nearestFrame.projectData.title}`
      } else {
        interactionPrompt.value = ''
      }
    }

    // Handle window resize
    const handleResize = (): void => {
      if (!state.camera || !state.renderer || !museumContainer.value) return
      
      state.camera.aspect = museumContainer.value.clientWidth / museumContainer.value.clientHeight
      state.camera.updateProjectionMatrix()
      state.renderer.setSize(
        museumContainer.value.clientWidth,
        museumContainer.value.clientHeight
      )
    }

    // Cleanup
    const cleanup = (): void => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('click', onMouseClick)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (state.renderer) {
        state.renderer.dispose()
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      initializeMuseum()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      cleanup()
    })

    return {
      museumContainer,
      museumCanvas,
      isLoading,
      interactionPrompt
    }
  }
})
</script>

<style scoped>
.space-museum-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.museum-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.museum-ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.crosshair-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.8;
}

.interaction-prompt {
  position: absolute;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(52, 73, 94, 0.9);
  color: #ecf0f1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #3498db;
  animation: pulse 2s infinite;
}

.instructions {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #bdc3c7;
  font-size: 14px;
  line-height: 1.4;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 17, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  color: #ecf0f1;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #34495e;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}
</style>
