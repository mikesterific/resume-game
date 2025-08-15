const Phaser = require('phaser').default
const { EffectsManager } = require('@/game/managers/EffectsManager')

describe('EffectsManager', () => {
  let scene
  let manager

  beforeEach(() => {
    scene = new Phaser.Scene({ key: 'TestScene' })
    // Mock tweens.add method
    scene.tweens = { add: jest.fn() }
    // Mock time.delayedCall method  
    scene.time = { delayedCall: jest.fn() }
    manager = new EffectsManager(scene)
  })

  describe('constructor', () => {
    test('initializes with scene reference', () => {
      expect(manager).toBeTruthy()
    })
  })

  describe('spawnExplosionAt', () => {
    test('creates enemy explosion with correct properties', () => {
      const imageSpy = jest.spyOn(scene.add, 'image')
      const mockExplosion = { 
        setDepth: jest.fn().mockReturnThis(),
        setBlendMode: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      imageSpy.mockReturnValue(mockExplosion)

      manager.spawnExplosionAt(100, 200)

      expect(imageSpy).toHaveBeenCalledWith(100, 200, 'enemy-explosion')
      expect(mockExplosion.setDepth).toHaveBeenCalledWith(50)
      expect(mockExplosion.setBlendMode).toHaveBeenCalledWith(Phaser.BlendModes.ADD)
      expect(mockExplosion.setDisplaySize).toHaveBeenCalledWith(160, 160)
      expect(mockExplosion.setAlpha).toHaveBeenCalledWith(0.9)
    })

    test('creates tween animation for explosion', () => {
      const mockExplosion = { 
        setDepth: jest.fn().mockReturnThis(),
        setBlendMode: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'image').mockReturnValue(mockExplosion)

      manager.spawnExplosionAt(100, 200)

      expect(scene.tweens.add).toHaveBeenCalledWith({
        targets: mockExplosion,
        scale: { from: 0.1, to: 0.5 },
        alpha: { from: 1, to: 0 },
        duration: 550,
        ease: 'Cubic.Out',
        onComplete: expect.any(Function)
      })
    })
  })

  describe('spawnHeroExplosionAt', () => {
    test('creates hero explosion with correct properties', () => {
      const imageSpy = jest.spyOn(scene.add, 'image')
      const mockExplosion = { 
        setDepth: jest.fn().mockReturnThis(),
        setBlendMode: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      imageSpy.mockReturnValue(mockExplosion)

      manager.spawnHeroExplosionAt(150, 250)

      expect(imageSpy).toHaveBeenCalledWith(150, 250, 'hero-explosion')
      expect(mockExplosion.setDepth).toHaveBeenCalledWith(50)
      expect(mockExplosion.setBlendMode).toHaveBeenCalledWith(Phaser.BlendModes.ADD)
      expect(mockExplosion.setDisplaySize).toHaveBeenCalledWith(180, 180)
      expect(mockExplosion.setAlpha).toHaveBeenCalledWith(1)
    })

    test('creates different tween animation for hero explosion', () => {
      const mockExplosion = { 
        setDepth: jest.fn().mockReturnThis(),
        setBlendMode: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'image').mockReturnValue(mockExplosion)

      manager.spawnHeroExplosionAt(150, 250)

      expect(scene.tweens.add).toHaveBeenCalledWith({
        targets: mockExplosion,
        scale: { from: 0.5, to: 1.0 },
        alpha: { from: 1, to: 0 },
        duration: 600,
        ease: 'Cubic.Out',
        onComplete: expect.any(Function)
      })
    })
  })

  describe('createShieldHitEffect', () => {
    test('creates particle system with correct properties', () => {
      const particlesSpy = jest.spyOn(scene.add, 'particles')
      const mockParticles = { destroy: jest.fn() }
      particlesSpy.mockReturnValue(mockParticles)

      const color = 0x00AAFF
      manager.createShieldHitEffect(75, 125, color)

      expect(particlesSpy).toHaveBeenCalledWith(75, 125, 'laser-beam', {
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.8, end: 0 },
        tint: color,
        speed: { min: 50, max: 150 },
        lifespan: 300,
        quantity: 5
      })
    })

    test('schedules particle cleanup', () => {
      const mockParticles = { destroy: jest.fn() }
      jest.spyOn(scene.add, 'particles').mockReturnValue(mockParticles)

      manager.createShieldHitEffect(75, 125, 0x00AAFF)

      expect(scene.time.delayedCall).toHaveBeenCalledWith(500, expect.any(Function))
    })
  })

  describe('createShieldDestructionEffect', () => {
    test('creates larger particle system for destruction', () => {
      const particlesSpy = jest.spyOn(scene.add, 'particles')
      const mockParticles = { destroy: jest.fn() }
      particlesSpy.mockReturnValue(mockParticles)

      const color = 0xFF0000
      manager.createShieldDestructionEffect(50, 100, color)

      expect(particlesSpy).toHaveBeenCalledWith(50, 100, 'laser-beam', {
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0 },
        tint: color,
        speed: { min: 100, max: 250 },
        lifespan: 600,
        quantity: 15
      })
    })

    test('schedules longer cleanup delay for destruction effect', () => {
      const mockParticles = { destroy: jest.fn() }
      jest.spyOn(scene.add, 'particles').mockReturnValue(mockParticles)

      manager.createShieldDestructionEffect(50, 100, 0xFF0000)

      expect(scene.time.delayedCall).toHaveBeenCalledWith(800, expect.any(Function))
    })
  })

  describe('createShieldReactivationEffect', () => {
    test('creates gentle particle system for reactivation', () => {
      const particlesSpy = jest.spyOn(scene.add, 'particles')
      const mockParticles = { destroy: jest.fn() }
      particlesSpy.mockReturnValue(mockParticles)

      const color = 0x00FF00
      manager.createShieldReactivationEffect(25, 75, color)

      expect(particlesSpy).toHaveBeenCalledWith(25, 75, 'laser-beam', {
        scale: { start: 0.1, end: 0.4 },
        alpha: { start: 0.3, end: 0.8 },
        tint: color,
        speed: { min: 20, max: 80 },
        lifespan: 800,
        quantity: 10
      })
    })

    test('schedules cleanup for reactivation effect', () => {
      const mockParticles = { destroy: jest.fn() }
      jest.spyOn(scene.add, 'particles').mockReturnValue(mockParticles)

      manager.createShieldReactivationEffect(25, 75, 0x00FF00)

      expect(scene.time.delayedCall).toHaveBeenCalledWith(1000, expect.any(Function))
    })
  })

  describe('animateXpGain', () => {
    let mockXpText

    beforeEach(() => {
      mockXpText = {
        x: 50,
        y: 60
      }
    })

    test('does nothing if xpText is null', () => {
      manager.animateXpGain(10, null)
      
      expect(scene.tweens.add).not.toHaveBeenCalled()
    })

    test('creates scale animation for XP text', () => {
      manager.animateXpGain(25, mockXpText)

      expect(scene.tweens.add).toHaveBeenCalledWith({
        targets: mockXpText,
        scaleX: { from: 1, to: 1.3 },
        scaleY: { from: 1, to: 1.3 },
        duration: 200,
        yoyo: true,
        ease: 'Back.easeOut'
      })
    })

    test('creates floating XP text with correct properties', () => {
      const textSpy = jest.spyOn(scene.add, 'text')
      const mockFloatingText = { 
        y: 60,
        setDepth: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      textSpy.mockReturnValue(mockFloatingText)

      manager.animateXpGain(35, mockXpText)

      expect(textSpy).toHaveBeenCalledWith(130, 60, '+35', {
        fontSize: '18px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        fontStyle: 'bold',
        color: '#F1C40F',
        stroke: '#000000',
        strokeThickness: 2
      })
      expect(mockFloatingText.setDepth).toHaveBeenCalledWith(101)
    })

    test('creates floating animation for XP text', () => {
      const mockFloatingText = { 
        y: 60,
        setDepth: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'text').mockReturnValue(mockFloatingText)

      manager.animateXpGain(15, mockXpText)

      // Should create two tween animations (scale + floating)
      expect(scene.tweens.add).toHaveBeenCalledTimes(2)
      
      // Check the floating text animation
      expect(scene.tweens.add).toHaveBeenCalledWith({
        targets: mockFloatingText,
        y: 20, // 60 - 40
        alpha: { from: 1, to: 0 },
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: expect.any(Function)
      })
    })
  })

  describe('effect cleanup', () => {
    test('explosion onComplete callback destroys explosion', () => {
      const mockExplosion = { 
        setDepth: jest.fn().mockReturnThis(),
        setBlendMode: jest.fn().mockReturnThis(), 
        setDisplaySize: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'image').mockReturnValue(mockExplosion)

      manager.spawnExplosionAt(100, 200)

      // Get the onComplete callback and execute it
      const tweenCall = scene.tweens.add.mock.calls[0][0]
      tweenCall.onComplete()

      expect(mockExplosion.destroy).toHaveBeenCalled()
    })

    test('particle effects cleanup callbacks work', () => {
      const mockParticles = { destroy: jest.fn() }
      jest.spyOn(scene.add, 'particles').mockReturnValue(mockParticles)

      manager.createShieldHitEffect(75, 125, 0x00AAFF)

      // Get the delayedCall callback and execute it
      const cleanupCall = scene.time.delayedCall.mock.calls[0][1]
      cleanupCall()

      expect(mockParticles.destroy).toHaveBeenCalled()
    })
  })
})
