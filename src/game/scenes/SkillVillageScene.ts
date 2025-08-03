import Phaser from 'phaser'
import gameEventBridge from '../GameEventBridge'

/**
 * Skill Village Scene - Interactive area showcasing technical skills
 * NPCs represent different skill categories and technologies
 */
export class SkillVillageScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private skillNPCs: Phaser.GameObjects.Group | null = null
  private portals: Phaser.GameObjects.Group | null = null
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private interactionPrompt!: Phaser.GameObjects.Text
  private nearestNPC: Phaser.GameObjects.GameObject | null = null
  private nearestPortal: Phaser.GameObjects.GameObject | null = null

  constructor() {
    super({ key: 'SkillVillageScene' })
  }

  create(): void {
    console.log('[SkillVillageScene] Creating Skill Village')
    
    this.setupWorld()
    this.createPlayer()
    this.createSkillNPCs()
    this.setupControls()
    this.setupUI()
    
    // Test global click detection
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log('[SkillVillageScene] Global click detected at:', pointer.x, pointer.y)
    })
    
    // Test mouse movement
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      console.log('[SkillVillageScene] Mouse move detected at:', pointer.x, pointer.y)
    })
    
    // Test if the game canvas has focus
    console.log('[SkillVillageScene] Game canvas element:', this.game.canvas)
    console.log('[SkillVillageScene] Input enabled:', this.input.enabled)
    
    // Start this scene as the initial scene
    this.scene.setActive(true)
  }

  private setupWorld(): void {
    const { width, height } = this.scale

    // Create a simple village background
    this.add.rectangle(width / 2, height / 2, width, height, 0x3498db, 0.3)
    
    // Add some village elements
    this.add.text(width / 2, 60, '🏘️ Skill Village', {
      fontSize: '32px',
      color: '#2c3e50',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.add.text(width / 2, 120, 'Walk around and interact with NPCs to explore my skills!', {
      fontSize: '18px',
      color: '#34495e'
    }).setOrigin(0.5)

    // Add some decorative elements
    this.add.text(100, 200, '🏠', { fontSize: '40px' })
    this.add.text(width - 100, 200, '🏠', { fontSize: '40px' })
    this.add.text(200, height - 200, '🌳', { fontSize: '40px' })
    this.add.text(width - 200, height - 200, '🌳', { fontSize: '40px' })
  }

  private createPlayer(): void {
    const { width, height } = this.scale
    
    // Simple colored rectangle as player placeholder
    this.player = this.add.rectangle(width / 2, height / 2, 32, 32, 0xe74c3c)
    this.physics.add.existing(this.player)
    
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    playerBody.setCollideWorldBounds(true)
    playerBody.setDrag(500) // Add some drag for smoother movement
  }

  private createSkillNPCs(): void {
    this.skillNPCs = this.add.group()

    const skills = [
      { id: 'frontend', name: 'Frontend Dev', emoji: '💻', x: 300, y: 300, category: 'frontend' },
      { id: 'backend', name: 'Backend Dev', emoji: '⚙️', x: 600, y: 300, category: 'backend' },
      { id: 'mobile', name: 'Mobile Dev', emoji: '📱', x: 900, y: 300, category: 'mobile' },
      { id: 'devops', name: 'DevOps', emoji: '🚀', x: 450, y: 500, category: 'devops' },
      { id: 'design', name: 'UI/UX Design', emoji: '🎨', x: 750, y: 500, category: 'design' }
    ]

    skills.forEach(skill => {
      const npc = this.add.container(skill.x, skill.y)
      
      // NPC visual representation
      const npcBody = this.add.rectangle(0, 0, 48, 48, 0x9b59b6, 0.8)
      const npcEmoji = this.add.text(0, -8, skill.emoji, { 
        fontSize: '24px' 
      }).setOrigin(0.5)
      const npcLabel = this.add.text(0, 35, skill.name, { 
        fontSize: '12px', 
        color: '#2c3e50',
        align: 'center'
      }).setOrigin(0.5)

      npc.add([npcBody, npcEmoji, npcLabel])
      
      // Add physics
      this.physics.add.existing(npc, true) // true = static body
      
      // Store skill data on the NPC
      npc.setData('skillData', skill)
      npc.setData('isNPC', true)
      
      // Add interactive behavior
      npc.setSize(48, 48)
      npc.setInteractive()
      npc.on('pointerdown', () => this.interactWithSkill(skill.id))
      
      this.skillNPCs!.add(npc)
    })
  }

  private setupControls(): void {
    this.cursors = this.input.keyboard!.createCursorKeys()
    
    // WASD controls
    const wasd = this.input.keyboard!.addKeys('W,S,A,D') as any
    
    // Space for interaction
    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.nearestPortal) {
        const portalData = this.nearestPortal.getData('portalData')
        if (portalData) {
          console.log('[SkillVillageScene] Portal activated via SPACE:', portalData.name)
          this.goToScene(portalData.targetScene)
        }
      } else if (this.nearestNPC) {
        const skillData = this.nearestNPC.getData('skillData')
        if (skillData) {
          this.interactWithSkill(skillData.id)
        }
      }
    })
  }

  private setupUI(): void {
    // Interaction prompt
    this.interactionPrompt = this.add.text(
      this.scale.width / 2, 
      this.scale.height - 80, 
      '', 
      {
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#2c3e50aa',
        padding: { x: 10, y: 5 }
      }
    ).setOrigin(0.5).setVisible(false)

    // Navigation hints
    this.add.text(20, this.scale.height - 60, 'WASD/Arrows: Move | SPACE: Interact', {
      fontSize: '14px',
      color: '#7f8c8d'
    })

    // Portal to other areas
    this.createPortals()
  }

  private createPortals(): void {
    this.portals = this.add.group()
    const { width, height } = this.scale
    console.log('[SkillVillageScene] Creating portals...')

    // Portal to Project Forest
    const forestPortal = this.add.container(50, height / 2)
    forestPortal.add([
      this.add.rectangle(0, 0, 60, 80, 0x27ae60, 0.7),
      this.add.text(0, -10, '🌲', { fontSize: '24px' }).setOrigin(0.5),
      this.add.text(0, 15, 'Project\nForest', { fontSize: '10px', align: 'center', color: '#ffffff' }).setOrigin(0.5)
    ])
    
    // Add physics for proximity detection
    this.physics.add.existing(forestPortal, true)
    
    // Store portal data
    forestPortal.setData('portalData', { 
      id: 'forest', 
      name: 'Project Forest', 
      targetScene: 'ProjectForestScene' 
    })
    forestPortal.setData('isPortal', true)
    
    // Keep click interaction as backup
    forestPortal.setSize(60, 80)
    forestPortal.setInteractive()
    forestPortal.on('pointerdown', () => {
      console.log('[SkillVillageScene] Forest portal clicked!')
      this.goToScene('ProjectForestScene')
    })
    
    this.portals!.add(forestPortal)
    console.log('[SkillVillageScene] Forest portal created at:', 50, height / 2)

    // Portal to Resume Tower
    const towerPortal = this.add.container(width - 50, height / 2)
    towerPortal.add([
      this.add.rectangle(0, 0, 60, 80, 0x8e44ad, 0.7),
      this.add.text(0, -10, '🏰', { fontSize: '24px' }).setOrigin(0.5),
      this.add.text(0, 15, 'Résumé\nTower', { fontSize: '10px', align: 'center', color: '#ffffff' }).setOrigin(0.5)
    ])
    
    // Add physics for proximity detection
    this.physics.add.existing(towerPortal, true)
    
    // Store portal data
    towerPortal.setData('portalData', { 
      id: 'tower', 
      name: 'Résumé Tower', 
      targetScene: 'ResumeTowerScene' 
    })
    towerPortal.setData('isPortal', true)
    
    // Keep click interaction as backup
    towerPortal.setSize(60, 80)
    towerPortal.setInteractive()
    towerPortal.on('pointerdown', () => {
      console.log('[SkillVillageScene] Tower portal clicked!')
      this.goToScene('ResumeTowerScene')
    })
    
    this.portals!.add(towerPortal)
    console.log('[SkillVillageScene] Tower portal created at:', width - 50, height / 2)
  }

  private interactWithSkill(skillId: string): void {
    console.log(`[SkillVillageScene] Interacting with skill: ${skillId}`)
    gameEventBridge.emitGameEvent('game:skill-selected', { skillId })
  }

  private goToScene(sceneName: string): void {
    console.log(`[SkillVillageScene] Transitioning to: ${sceneName}`)
    console.log(`[SkillVillageScene] Calling scene.start with: ${sceneName}`)
    gameEventBridge.emitGameEvent('game:scene-starting', { sceneName })
    this.scene.start(sceneName)
    console.log(`[SkillVillageScene] Scene transition call completed`)
  }

  update(): void {
    this.handlePlayerMovement()
    this.checkPortalProximity()
    this.checkNPCProximity()
  }

  private handlePlayerMovement(): void {
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    const speed = 200

    // Reset velocity
    playerBody.setVelocity(0)

    // Check input and move
    if (this.cursors.left.isDown || this.input.keyboard!.addKey('A').isDown) {
      playerBody.setVelocityX(-speed)
    } else if (this.cursors.right.isDown || this.input.keyboard!.addKey('D').isDown) {
      playerBody.setVelocityX(speed)
    }

    if (this.cursors.up.isDown || this.input.keyboard!.addKey('W').isDown) {
      playerBody.setVelocityY(-speed)
    } else if (this.cursors.down.isDown || this.input.keyboard!.addKey('S').isDown) {
      playerBody.setVelocityY(speed)
    }
  }

  private checkPortalProximity(): void {
    if (!this.portals) return

    let nearestPortal: Phaser.GameObjects.GameObject | null = null
    let nearestDistance = Infinity

    this.portals.children.entries.forEach(portal => {
      const portalSprite = portal as Phaser.GameObjects.Sprite
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        portalSprite.x, portalSprite.y
      )

      if (distance < 100 && distance < nearestDistance) {
        nearestDistance = distance
        nearestPortal = portalSprite
      }
    })

    if (nearestPortal !== this.nearestPortal) {
      this.nearestPortal = nearestPortal
      
      if (this.nearestPortal) {
        const portalSprite = this.nearestPortal as Phaser.GameObjects.Sprite
        const portalData = portalSprite.getData('portalData')
        this.interactionPrompt.setText(`Press SPACE to travel to ${portalData.name}`)
        this.interactionPrompt.setVisible(true)
        console.log('[SkillVillageScene] Near portal:', portalData.name)
      } else if (!this.nearestNPC) {
        this.interactionPrompt.setVisible(false)
      }
    }
  }

  private checkNPCProximity(): void {
    if (!this.skillNPCs || this.nearestPortal) return // Portal takes priority

    let nearestNPC: Phaser.GameObjects.GameObject | null = null
    let nearestDistance = Infinity

    this.skillNPCs.children.entries.forEach(npc => {
      const npcSprite = npc as Phaser.GameObjects.Sprite
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npcSprite.x, npcSprite.y
      )

      if (distance < 80 && distance < nearestDistance) {
        nearestDistance = distance
        nearestNPC = npcSprite
      }
    })

    if (nearestNPC !== this.nearestNPC) {
      this.nearestNPC = nearestNPC
      
      if (this.nearestNPC && !this.nearestPortal) {
        const npcSprite = this.nearestNPC as Phaser.GameObjects.Sprite
        const skillData = npcSprite.getData('skillData')
        this.interactionPrompt.setText(`Press SPACE to learn about ${skillData.name}`)
        this.interactionPrompt.setVisible(true)
      } else if (!this.nearestPortal) {
        this.interactionPrompt.setVisible(false)
      }
    }
  }
}