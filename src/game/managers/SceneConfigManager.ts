import Phaser from 'phaser'

interface PortalData {
  id: string
  name: string
  targetScene: string
}

export class SceneConfigManager {
  private scene: Phaser.Scene
  private portals: Phaser.GameObjects.Group | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Setup the space background with stars and scene title
   */
  setupSpaceBackground(): void {
    const { width, height } = this.scene.scale

    // Deep space background
    this.scene.add.rectangle(width / 2, height / 2, width, height, 0x0A0A1F, 1.0)
    
    // Add starfield
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)
      const starSize = Phaser.Math.Between(1, 3)
      const star = this.scene.add.circle(x, y, starSize, 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.9))
    }
    
    // Scene title with space theme
    this.scene.add.text(width / 2, 60, '🚀 Skills Command Center', {
      fontSize: '32px',
      color: '#ECF0F1',
      fontStyle: 'bold'
    }).setOrigin(0.5)

    this.scene.add.text(width / 2, 120, 'Navigate to different stations to explore technical expertise', {
      fontSize: '18px',
      color: '#BDC3C7'
    }).setOrigin(0.5)
  }

  /**
   * Create and setup portal objects for scene transitions
   */
  setupPortals(onActivate: (sceneName: string) => void): Phaser.GameObjects.Group {
    // Create the portals group now that scene is initialized
    this.portals = this.scene.add.group()
    
    const { width, height } = this.scene.scale
    const portalsData = this.createPortalsData(width, height)
    
    portalsData.forEach(portalData => {
      const portal = this.createPortal(portalData, onActivate)
      this.portals!.add(portal)
    })

    return this.portals
  }

  /**
   * Ensure laser texture exists for combat system
   */
  ensureLaserTexture(): void {
    if (this.scene.textures.exists('laser-beam')) return
    const g = this.scene.add.graphics({ x: 0, y: 0 })
    g.clear()
    g.fillStyle(0x00ffff, 1)
    g.fillRoundedRect(0, 0, 6, 28, 3)
    g.generateTexture('laser-beam', 6, 28)
    g.destroy()
  }

  /**
   * Ensure enemy laser texture exists for combat system
   */
  ensureEnemyLaserTexture(): void {
    if (this.scene.textures.exists('enemy-laser')) return
    const g = this.scene.add.graphics({ x: 0, y: 0 })
    g.clear()
    g.fillStyle(0xff4d3a, 1)
    g.fillRoundedRect(0, 0, 6, 28, 3)
    g.generateTexture('enemy-laser', 6, 28)
    g.destroy()
  }

  private createPortalsData(width: number, height: number): Array<PortalData & { x: number; y: number; color: number; emoji: string }> {
    return [
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
  }

  private createPortal(
    portalData: PortalData & { x: number; y: number; color: number; emoji: string },
    onActivate: (sceneName: string) => void
  ): Phaser.GameObjects.Container {
    const portal = this.scene.add.container(portalData.x, portalData.y)
    
    portal.add([
      this.scene.add.rectangle(0, 0, 60, 80, portalData.color, 0.7),
      this.scene.add.text(0, -10, portalData.emoji, { fontSize: '24px' }).setOrigin(0.5),
      this.scene.add.text(0, 15, portalData.name.replace(' ', '\n'), { 
        fontSize: '10px', 
        align: 'center', 
        color: '#ffffff' 
      }).setOrigin(0.5)
    ])
    
    this.scene.physics.add.existing(portal, true)
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
}
