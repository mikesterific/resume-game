import Phaser from 'phaser'
import gameEventBridge from '../GameEventBridge'
import { createPlayer, updatePlayerVelocity, preloadPlayerAssets, findNearestObject } from '../systems/PlayerSystem'
import { spaceStationConfigs, getStationConfig, stationColorPalette } from '@/assets/images/space-stations/station-data'
import { getColorTint } from '@/assets/images/space-stations/sprite-map-config'

// Types for scene state
interface SceneState {
  player: Phaser.GameObjects.Sprite | null
  spaceStations: Phaser.GameObjects.Group | null
  portals: Phaser.GameObjects.Group | null
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null
  interactionPrompt: Phaser.GameObjects.Text | null
  nearestStation: Phaser.GameObjects.GameObject | null
  nearestPortal: Phaser.GameObjects.GameObject | null
  isDocking: boolean
  isDocked: boolean
  dockedStation: Phaser.GameObjects.GameObject | null
  isModalOpen: boolean
  enemies: Phaser.GameObjects.Group | null
  lasers: Phaser.GameObjects.Group | null
  laserTimer: Phaser.Time.TimerEvent | null
}

interface SpaceStationData {
  id: string
  skillId: string
  name: string
  emoji: string
  x: number
  y: number
  category: string
  description?: string
  stationType: 'A' | 'B' | 'C' | 'D' | 'E'
  colorVariant: string
  sector: 'development' | 'infrastructure' | 'innovation'
}

interface PortalData {
  id: string
  name: string
  targetScene: string
}

// Pure functions for scene logic - Space themed data
const createSpaceStationsData = (): SpaceStationData[] => [
  // DEVELOPMENT SECTOR (Western Quadrant)
  { 
    id: 'frontend-station', 
    skillId: 'frontend',
    name: 'Frontend Development\nStation', 
    emoji: '👨‍💻', 
    x: 1650, 
    y: 250, 
    category: 'frontend',
    stationType: 'A',
    colorVariant: 'blue',
    sector: 'development',
    description: 'Deep mastery of Vue.js, React, Angular. CSS3, HTML5, TailwindCSS wizard. Performance optimization expert.'
  },
  { 
    id: 'testing-station', 
    skillId: 'testing',
    name: 'Testing Systems\nPlatform', 
    emoji: '🧪', 
    x: 320, 
    y: 780, 
    category: 'testing',
    stationType: 'A',
    colorVariant: 'green',
    sector: 'development',
    description: 'Cypress ninja, Jest, Mocha, Chai master. Writes resilient full-coverage tests.'
  },
  { 
    id: 'architecture-station', 
    skillId: 'architecture',
    name: 'Architecture\nHub', 
    emoji: '📦', 
    x: 1420, 
    y: 880, 
    category: 'architecture',
    stationType: 'B',
    colorVariant: 'orange',
    sector: 'development',
    description: 'Vuex wizard, Supabase integration. Large-scale app architecture at EA, Dell, RentPath.'
  },
  
  // INFRASTRUCTURE SECTOR (Eastern Quadrant)
  { 
    id: 'tooling-station', 
    skillId: 'tooling',
    name: 'Tooling\nPlatform', 
    emoji: '⚙️', 
    x: 220, 
    y: 380, 
    category: 'tooling',
    stationType: 'C',
    colorVariant: 'purple',
    sector: 'infrastructure',
    description: 'Vite, Webpack, TypeScript expert. Custom component libraries and mono repos.'
  },
  { 
    id: 'devops-station', 
    skillId: 'devops',
    name: 'DevOps\nCommand', 
    emoji: '📡', 
    x: 1000, 
    y: 820, 
    category: 'devops',
    stationType: 'E',
    colorVariant: 'red',
    sector: 'infrastructure',
    description: 'Git mastery, CIDR, VLANs, merge automation. Network knowledge from dev perspective.'
  },
  { 
    id: 'security-station', 
    skillId: 'security',
    name: 'Security\nFortress', 
    emoji: '🔒', 
    x: 850, 
    y: 520, 
    category: 'security',
    stationType: 'B',
    colorVariant: 'gray',
    sector: 'infrastructure',
    description: 'Linux Foundation certified (LFD121). Security and accessibility by design, not bolted on.'
  },
  
  // INNOVATION HUB (Northern Command Center)
  { 
    id: 'ai-station', 
    skillId: 'ai',
    name: 'AI Research\nStation', 
    emoji: '🧠', 
    x: 580, 
    y: 320, 
    category: 'ai',
    stationType: 'D',
    colorVariant: 'cyan',
    sector: 'innovation',
    description: 'Custom RAG systems with similarity search. LLM integration in production workflows.'
  },
  { 
    id: 'leadership-station', 
    skillId: 'leadership',
    name: 'Leadership\nCenter', 
    emoji: '🎤', 
    x: 1120, 
    y: 300, 
    category: 'leadership',
    stationType: 'C',
    colorVariant: 'gold',
    sector: 'innovation',
    description: 'Google Tech Talk speaker. Published "Pro HTML5 Performance" by Apress. UI badass.'
  }
]

const createPortalsData = (width: number, height: number): Array<PortalData & { x: number; y: number; color: number; emoji: string }> => [
  {
    id: 'forest',
    name: 'Project Forest',
    targetScene: 'ProjectForestScene',
    x: 50,
    y: height / 2,
    color: 0x27ae60,
    emoji: '🌲'
  },
  {
    id: 'tower',
    name: 'Résumé Tower',
    targetScene: 'ResumeTowerScene',
    x: width - 50,
    y: height / 2,
    color: 0x8e44ad,
    emoji: '🏰'
  }
]

// Factory functions for creating game objects

// Map skill IDs to specific starbase images
const getStarbaseImage = (skillId: string): string => {
  const starbaseMapping: Record<string, string> = {
    'frontend': 'starbase1',
    'testing': 'starbase2', 
    'architecture': 'starbase3',
    'tooling': 'starbase4',
    'devops': 'starbase5',
    'security': 'starbase6',
    'ai': 'starbase7',
    'leadership': 'starbase8'
  }
  
  return starbaseMapping[skillId] || 'starbase1' // Default fallback
}

const createSpaceStation = (scene: Phaser.Scene, station: SpaceStationData, onInteract: (stationId: string) => void): Phaser.GameObjects.Container => {
  const stationContainer = scene.add.container(station.x, station.y)
  
  let stationBody: Phaser.GameObjects.Image | Phaser.GameObjects.Shape
  
  // Get the appropriate starbase image for this station
  const starbaseKey = getStarbaseImage(station.skillId)
  
  console.log(`🔍 Creating station ${station.skillId} using ${starbaseKey}`)
  
  // Use individual starbase images
  if (scene.textures.exists(starbaseKey)) {
    console.log(`✅ Using ${starbaseKey} for ${station.skillId} station`)
    
    // Create sprite from individual starbase image
    stationBody = scene.add.image(0, 0, starbaseKey)
    stationBody.setDisplaySize(120, 120) // Scale to a good visible size
    
    // Apply color tint for category identification
    const colorTint = getColorTint(station.colorVariant)
    stationBody.setTint(colorTint)
    
    console.log(`✅ Created starbase station: ${station.skillId} using ${starbaseKey} with tint: ${colorTint.toString(16)}`)
  } else {
    // Fallback to geometric shape  
    console.warn(`Starbase image ${starbaseKey} not found for station ${station.skillId}, using fallback`)
    
    const stationColor = stationColorPalette[station.colorVariant as keyof typeof stationColorPalette]
    
    switch (station.stationType) {
      case 'A': // Compact research module
        stationBody = scene.add.rectangle(0, 0, 70, 50, Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
        break
      case 'B': // Industrial platform  
        stationBody = scene.add.rectangle(0, 0, 80, 40, Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
        break
      case 'C': // Large hub station
        stationBody = scene.add.circle(0, 0, 35, Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
        break
      case 'D': // Specialized research (hexagonal)
        stationBody = scene.add.polygon(0, 0, [
          [-25, 0], [-12, -22], [12, -22], [25, 0], [12, 22], [-12, 22]
        ], Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
        break
      case 'E': // Command station
        stationBody = scene.add.rectangle(0, 0, 75, 45, Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
        break
      default:
        stationBody = scene.add.rectangle(0, 0, 60, 50, Phaser.Display.Color.HexStringToColor(stationColor).color, 0.9)
    }
    
    if ('setStrokeStyle' in stationBody) {
      stationBody.setStrokeStyle(3, 0x34495E)
    }
  }
  
  // Station identifier removed - starbase images are detailed enough
  
  // Station label positioned below starbase - clean, no background
  const stationLabel = scene.add.text(0, 95, station.name, { 
    fontSize: '18px', 
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    fontStyle: 'bold',
    color: '#FFFFFF',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5)

  // Status indicator - gentle pulsing effect
  const statusIndicator = scene.add.circle(25, -25, 4, 0x00FF88, 0.8)
  scene.tweens.add({
    targets: statusIndicator,
    alpha: { from: 0.4, to: 1 },
    scale: { from: 0.8, to: 1.2 },
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  })

  // Docking indicators (subtle industrial details)
  const dockingPort1 = scene.add.rectangle(-30, 0, 6, 3, 0x95A5A6)
  const dockingPort2 = scene.add.rectangle(30, 0, 6, 3, 0x95A5A6)

  stationContainer.add([stationBody, stationLabel, statusIndicator, dockingPort1, dockingPort2])
  
  stationContainer.setData('stationData', station)
  stationContainer.setData('isStation', true)
  stationContainer.setSize(80, 80)
  stationContainer.setInteractive()
  stationContainer.on('pointerdown', () => onInteract(station.skillId))
  
  return stationContainer
}

const createPortal = (
  scene: Phaser.Scene, 
  portalData: PortalData & { x: number; y: number; color: number; emoji: string },
  onActivate: (sceneName: string) => void
): Phaser.GameObjects.Container => {
  const portal = scene.add.container(portalData.x, portalData.y)
  
  portal.add([
    scene.add.rectangle(0, 0, 60, 80, portalData.color, 0.7),
    scene.add.text(0, -10, portalData.emoji, { fontSize: '24px' }).setOrigin(0.5),
    scene.add.text(0, 15, portalData.name.replace(' ', '\n'), { 
      fontSize: '10px', 
      align: 'center', 
      color: '#ffffff' 
    }).setOrigin(0.5)
  ])
  
  scene.physics.add.existing(portal, true)
  portal.setData('portalData', { 
    id: portalData.id, 
    name: portalData.name, 
    targetScene: portalData.targetScene 
  })
  portal.setData('isPortal', true)
  portal.setSize(60, 80)
  portal.setInteractive()
  portal.on('pointerdown', () => {
    onActivate(portalData.targetScene)
  })
  
  return portal
}

const setupSpaceBackground = (scene: Phaser.Scene): void => {
  const { width, height } = scene.scale

  // Deep space background
  scene.add.rectangle(width / 2, height / 2, width, height, 0x0A0A1F, 1.0)
  
  // Add starfield
  for (let i = 0; i < 100; i++) {
    const x = Phaser.Math.Between(0, width)
    const y = Phaser.Math.Between(0, height)
    const starSize = Phaser.Math.Between(1, 3)
    const star = scene.add.circle(x, y, starSize, 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.9))
  }
  
  // Scene title with space theme
  scene.add.text(width / 2, 60, '🚀 Skills Command Center', {
    fontSize: '32px',
    color: '#ECF0F1',
    fontStyle: 'bold'
  }).setOrigin(0.5)

  scene.add.text(width / 2, 120, 'Navigate to different stations to explore technical expertise', {
    fontSize: '18px',
    color: '#BDC3C7'
  }).setOrigin(0.5)

  // Sector labels - enhanced antialiasing
  scene.add.text(200, 180, 'DEVELOPMENT SECTOR', {
    fontSize: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: '#3498DB',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5)

  scene.add.text(800, 180, 'INFRASTRUCTURE SECTOR', {
    fontSize: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: '#E74C3C',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5)

  scene.add.text(500, 120, 'INNOVATION HUB', {
    fontSize: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: '#F39C12',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 2
  }).setOrigin(0.5)
}

// Utility to generate a simple glowing laser texture if not already present
const ensureLaserTexture = (scene: Phaser.Scene): void => {
  if (scene.textures.exists('laser-beam')) return
  const g = scene.add.graphics({ x: 0, y: 0 })
  g.clear()
  g.fillStyle(0x00ffff, 1)
  g.fillRoundedRect(0, 0, 6, 28, 3)
  g.generateTexture('laser-beam', 6, 28)
  g.destroy()
}

/**
 * Skills Space Scene - Interactive space command center showcasing technical skills
 * Space stations represent different skill categories in organized sectors
 */
export class SkillSpaceScene extends Phaser.Scene {
  private state: SceneState = {
    player: null,
    spaceStations: null,
    portals: null,
    cursors: null,
    interactionPrompt: null,
    nearestStation: null,
    nearestPortal: null,
    isDocking: false,
    isDocked: false,
    dockedStation: null,
    isModalOpen: false,
    enemies: null,
    lasers: null,
    laserTimer: null
  }

  constructor() {
    super({ key: 'SkillSpaceScene' })
  }

  preload(): void {
    preloadPlayerAssets(this)
    
    // Load individual starbase images
    console.log('🔄 Preloading individual starbase images...')
    
    for (let i = 1; i <= 11; i++) {
      this.load.image(`starbase${i}`, `starbase${i}.png`)
    }

    // Load enemy ship asset
    this.load.image('enemy-ship', 'src/assets/images/enemy-ship.png')
    
    // Add load event listeners for debugging
    this.load.on('filecomplete', (key: string) => {
      if (key.startsWith('starbase')) {
        console.log(`✅ ${key} loaded successfully!`)
      }
      if (key === 'enemy-ship') {
        console.log('✅ enemy-ship loaded successfully!')
      }
    })
    
    this.load.on('loaderror', (file: any) => {
      console.error('❌ Failed to load:', file.key, file.src)
    })
    
    console.log('🔄 Starbase image loading setup complete')
  }

  create(): void {
    // Initialize scene using functional approach
    this.initializeScene()
    
    // Setup modal event listeners
    this.setupModalEventListeners()
    
    // Global click detection
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Click detection for debugging if needed
    })
    
    // Mouse movement tracking  
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Mouse movement tracking for debugging if needed
    })
    
    // Start this scene as the initial scene
    this.scene.setActive(true)
  }

  private initializeScene(): void {
    const { width, height } = this.scale
     
    // Setup space background
    setupSpaceBackground(this)
    
    // Create player - start on right side, vertically centered
    this.state.player = createPlayer(this, width - 150, height / 2)
    // Set player depth to appear above other objects
    this.state.player.setDepth(10)

    // Prepare laser assets/group
    ensureLaserTexture(this)
    this.state.lasers = this.add.group()

    // Create enemies group and a starter enemy
    this.state.enemies = this.add.group()
    const enemyOffset = 250
    const enemyX = Math.max(100, (this.state.player as Phaser.GameObjects.Sprite).x - enemyOffset)
    const enemyY = (this.state.player as Phaser.GameObjects.Sprite).y
    const enemy = this.add.sprite(enemyX, enemyY, 'enemy-ship')
    enemy.setDisplaySize(96, 96)
    this.physics.add.existing(enemy)
    enemy.setDepth(5)
    enemy.setRotation(Math.PI / 2) // face right, toward the hero who faces left
    enemy.setData('isEnemy', true)
    this.state.enemies.add(enemy)

    // Lasers are fired manually when SPACE is held
    
    // Create space stations
    this.state.spaceStations = this.add.group()
    const stations = createSpaceStationsData()
    stations.forEach(station => {
      const stationObject = createSpaceStation(this, station, this.handleStationInteraction)
      // Set stations to lower depth so player appears above them
      stationObject.setDepth(1)
      this.state.spaceStations!.add(stationObject)
    })
    
    // Setup controls
    this.setupControls()
    
    // Create UI elements
    this.setupUI()
    
    // Create portals
    this.state.portals = this.add.group()
    const portalsData = createPortalsData(width, height)
    portalsData.forEach(portalData => {
      const portal = createPortal(this, portalData, this.handleSceneTransition)
      this.state.portals!.add(portal)
    })
  }

  // Handler methods for interactions
  private dockWithStation = (station: Phaser.GameObjects.GameObject, skillId: string): void => {
    if (!this.state.player || this.state.isDocking) return
    
    this.state.isDocking = true
    
    // Get station position
    const stationX = (station as any).x
    const stationY = (station as any).y
    
    // Update interaction prompt
    if (this.state.interactionPrompt) {
      this.state.interactionPrompt.setText('Docking...')
    }
    
    // Animate ship to station center
    this.tweens.add({
      targets: this.state.player,
      x: stationX,
      y: stationY,
      duration: 800,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // Station docking animation
        this.tweens.add({
          targets: station,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          ease: 'Power2',
          onComplete: () => {
            // Complete docking sequence
            this.state.isDocking = false
            this.state.isDocked = true
            this.state.dockedStation = station
            
            if (this.state.interactionPrompt) {
              this.state.interactionPrompt.setText('Docked! Press SPACE to undock')
              this.state.interactionPrompt.setVisible(true)
            }
            
            // Emit skill selected event
            gameEventBridge.emitGameEvent('game:skill-selected', { skillId })
          }
        })
      }
    })
  }

  private undockFromStation = (): void => {
    if (!this.state.player || !this.state.isDocked) return
    
    this.state.isDocked = false
    this.state.dockedStation = null
    
    if (this.state.interactionPrompt) {
      this.state.interactionPrompt.setVisible(false)
    }
  }

  private handleStationInteraction = (skillId: string): void => {
    gameEventBridge.emitGameEvent('game:skill-selected', { skillId })
  }

  private handleSceneTransition = (sceneName: string): void => {
    gameEventBridge.emitGameEvent('game:scene-starting', { sceneName })
    this.scene.start(sceneName)
  }

  private setupControls(): void {
    this.state.cursors = this.input.keyboard!.createCursorKeys()

    const keyD = this.input.keyboard!.addKey('D')
    const keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // Laser hold-to-fire: SPACE down starts repeat; up stops
    keySpace.on('down', () => {
      if (this.state.laserTimer) {
        this.state.laserTimer.remove(false)
        this.state.laserTimer = null
      }
      this.fireLasersAtEnemy()
      this.state.laserTimer = this.time.addEvent({ delay: 140, loop: true, callback: () => this.fireLasersAtEnemy() })
    })

    keySpace.on('up', () => {
      if (this.state.laserTimer) {
        this.state.laserTimer.remove(false)
        this.state.laserTimer = null
      }
    })
    
    // D for docking/interaction
    keyD.on('down', () => {
      // Priority 1: Close modal and undock if modal is open
      if (this.state.isModalOpen) {
        gameEventBridge.emitGameEvent('ui:setting-changed', { key: 'closeModal', value: true })
        if (this.state.isDocked) {
          this.undockFromStation()
        }
        return
      }
      if (this.state.isDocking) return
      if (this.state.isDocked) {
        this.undockFromStation()
        return
      }
      if (this.state.nearestPortal) {
        const portalData = this.state.nearestPortal.getData('portalData')
        if (portalData) {
          this.handleSceneTransition(portalData.targetScene)
        }
      } else if (this.state.nearestStation) {
        const stationData = this.state.nearestStation.getData('stationData')
        if (stationData) {
          this.dockWithStation(this.state.nearestStation, stationData.skillId)
        }
      }
    })
  }

  private setupModalEventListeners(): void {
    // Listen for modal opened/closed events to track state
    gameEventBridge.onGameEvent('ui:modal-opened', () => {
      this.state.isModalOpen = true
    })

    gameEventBridge.onGameEvent('ui:modal-closed', () => {
      this.state.isModalOpen = false
    })
  }

  private setupUI(): void {
    // Interaction prompt with space theme
    this.state.interactionPrompt = this.add.text(
      this.scale.width / 2, 
      this.scale.height - 80, 
      '', 
      {
        fontSize: '18px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        fontStyle: 'bold',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
        backgroundColor: '#2C3E50ee',
        padding: { x: 12, y: 6 },
        resolution: 2
      }
    ).setOrigin(0.5).setVisible(false)

    // Navigation hints with space terminology
    this.add.text(20, this.scale.height - 60, 'WASD/Arrows: Navigate | SPACE: Dock with station / Close modal & undock', {
      fontSize: '16px',
      color: '#95A5A6'
    })
  }

  update(): void {
    if (!this.state.player || !this.state.cursors) return

    // Only allow movement if not docking or docked
    if (!this.state.isDocking && !this.state.isDocked) {
      // Handle player movement using functional approach
      updatePlayerVelocity(this.state.player, this.state.cursors, this.input.keyboard!)

      // Check for portal proximity
      this.updatePortalProximity()

      // Check for station proximity
      this.updateStationProximity()
    }

    // Cleanup lasers after lifetime
    if (this.state.lasers) {
      const now = this.time.now
      this.state.lasers.children.each((laserObj: Phaser.GameObjects.GameObject) => {
        const createdAt = laserObj.getData('createdAt') as number | undefined
        if (createdAt && now - createdAt > 2500) {
          laserObj.destroy()
        }
        return false as unknown as boolean | null
      }, this)
    }
  }

  private updatePortalProximity(): void {
    if (!this.state.portals || !this.state.player || !this.state.interactionPrompt) return

    const portals = this.state.portals.children.entries as Phaser.GameObjects.GameObject[]
    const nearestPortal = findNearestObject(this.state.player, portals, 100)

    if (nearestPortal !== this.state.nearestPortal) {
      this.state.nearestPortal = nearestPortal
      
      if (this.state.nearestPortal) {
        const portalData = this.state.nearestPortal.getData('portalData')
        this.state.interactionPrompt.setText(`Press SPACE to travel to ${portalData.name}`)
        this.state.interactionPrompt.setVisible(true)
      } else if (!this.state.nearestStation) {
        this.state.interactionPrompt.setVisible(false)
      }
    }
  }

  private updateStationProximity(): void {
    if (!this.state.spaceStations || !this.state.player || !this.state.interactionPrompt || this.state.nearestPortal) return

    const stations = this.state.spaceStations.children.entries as Phaser.GameObjects.GameObject[]
    const nearestStation = findNearestObject(this.state.player, stations, 80)

    if (nearestStation !== this.state.nearestStation) {
      this.state.nearestStation = nearestStation
      
      if (this.state.nearestStation && !this.state.nearestPortal) {
        const stationData = this.state.nearestStation.getData('stationData')
        this.state.interactionPrompt.setText(`Press SPACE to dock with ${stationData.name.replace('\n', ' ')}`)
        this.state.interactionPrompt.setVisible(true)
      } else if (!this.state.nearestPortal) {
        this.state.interactionPrompt.setVisible(false)
      }
    }
  }

  private fireLasersAtEnemy = (): void => {
    if (!this.state.player) return

    const player = this.state.player

    const wingOffsetsLocal = [
      new Phaser.Math.Vector2(-18, 18),
      new Phaser.Math.Vector2(18, 18)
    ]

    const rotation = player.rotation

    // Forward vector for a sprite that faces up by default
    const forward = new Phaser.Math.Vector2(Math.sin(rotation), -Math.cos(rotation)).normalize()

    wingOffsetsLocal.forEach(offset => {
      const rotated = offset.clone().rotate(rotation)
      const spawnX = player.x + rotated.x
      const spawnY = player.y + rotated.y

      const laser = this.add.sprite(spawnX, spawnY, 'laser-beam')
      laser.setBlendMode(Phaser.BlendModes.ADD)
      laser.setDepth(9)
      this.physics.add.existing(laser)
      laser.setData('createdAt', this.time.now)

      const body = laser.body as Phaser.Physics.Arcade.Body
      body.setAllowRotation(true)

      const speed = 800
      body.setVelocity(forward.x * speed, forward.y * speed)

      // Align laser orientation with player's facing
      laser.rotation = rotation

      this.state.lasers!.add(laser)
    })
  }
}