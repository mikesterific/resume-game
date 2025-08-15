import Phaser from 'phaser'

export class UIManager {
  private scene: Phaser.Scene
  private interactionPrompt: Phaser.GameObjects.Text | null = null
  private healthText: Phaser.GameObjects.Text | null = null
  private xpText: Phaser.GameObjects.Text | null = null
  private xpTotal: number = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Initialize all UI elements
   */
  initialize(playerHealth: number, maxPlayerHealth: number): void {
    this.setupInteractionPrompt()
    this.setupNavigationHints()
    this.setupHealthDisplay(playerHealth, maxPlayerHealth)
    this.setupXpDisplay()
  }

  /**
   * Get the interaction prompt text object
   */
  getInteractionPrompt(): Phaser.GameObjects.Text | null {
    return this.interactionPrompt
  }

  /**
   * Get the XP text object for animations
   */
  getXpText(): Phaser.GameObjects.Text | null {
    return this.xpText
  }

  /**
   * Get the health text object
   */
  getHealthText(): Phaser.GameObjects.Text | null {
    return this.healthText
  }

  /**
   * Update health display
   */
  updateHealth(currentHealth: number, maxHealth: number): void {
    if (this.healthText) {
      this.healthText.setText(`Health: ${currentHealth}/${maxHealth}`)
    }
  }

  /**
   * Update XP total and display
   */
  updateXp(newTotal: number): void {
    this.xpTotal = newTotal
    if (this.xpText) {
      this.xpText.setText(`XP: ${this.xpTotal}`)
    }
  }

  /**
   * Add XP to the current total
   */
  addXp(amount: number): void {
    this.xpTotal += amount
    this.updateXp(this.xpTotal)
  }

  /**
   * Get current XP total
   */
  getXpTotal(): number {
    return this.xpTotal
  }

  /**
   * Show portal interaction prompt
   */
  showPortalPrompt(portalName: string): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setText(`Press SPACE to travel to ${portalName}`)
      this.interactionPrompt.setVisible(true)
    }
  }

  /**
   * Show station interaction prompt
   */
  showStationPrompt(stationName: string): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setText(`Press SPACE to dock with ${stationName.replace('\n', ' ')}`)
      this.interactionPrompt.setVisible(true)
    }
  }

  /**
   * Show docking prompt
   */
  showDockingPrompt(): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setText('Docking...')
      this.interactionPrompt.setVisible(true)
    }
  }

  /**
   * Show docked prompt
   */
  showDockedPrompt(): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setText('Docked! Press SPACE to undock')
      this.interactionPrompt.setVisible(true)
    }
  }

  /**
   * Show shields up prompt
   */
  showShieldsUpPrompt(): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setText('Shields up — docking disabled')
      this.interactionPrompt.setVisible(true)
    }
  }

  /**
   * Hide interaction prompt
   */
  hidePrompt(): void {
    if (this.interactionPrompt) {
      this.interactionPrompt.setVisible(false)
    }
  }

  private setupInteractionPrompt(): void {
    this.interactionPrompt = this.scene.add.text(
      this.scene.scale.width / 2, 
      this.scene.scale.height - 80, 
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
  }

  private setupNavigationHints(): void {
    this.scene.add.text(20, this.scene.scale.height - 60, 'WASD/Arrows: Navigate | SPACE: Fire lasers | D: Dock/Undock/Interact', {
      fontSize: '16px',
      color: '#95A5A6'
    })
  }

  private setupHealthDisplay(playerHealth: number, maxPlayerHealth: number): void {
    this.healthText = this.scene.add.text(24, 24, '', {
      fontSize: '22px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      fontStyle: 'bold',
      color: '#FF6B6B',
      stroke: '#000000',
      strokeThickness: 3
    }).setDepth(100)
    
    this.updateHealth(playerHealth, maxPlayerHealth)
  }

  private setupXpDisplay(): void {
    this.xpText = this.scene.add.text(24, 60, 'XP: 0', {
      fontSize: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      fontStyle: 'bold',
      color: '#F1C40F',
      stroke: '#000000',
      strokeThickness: 3
    }).setDepth(100)
  }
}
