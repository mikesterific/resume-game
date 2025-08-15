const Phaser = require('phaser').default
const { SceneConfigManager } = require('@/game/managers/SceneConfigManager')

describe('SceneConfigManager', () => {
  let scene
  let manager

  beforeEach(() => {
    scene = new Phaser.Scene({ key: 'TestScene' })
    // Mock scene.scale for screen dimensions
    scene.scale = { width: 800, height: 600 }
    // Mock textures.exists method
    scene.textures = { exists: jest.fn().mockReturnValue(false) }
    manager = new SceneConfigManager(scene)
  })

  describe('constructor', () => {
    test('initializes with scene reference', () => {
      expect(manager).toBeTruthy()
    })
  })

  describe('setupSpaceBackground', () => {
    test('creates deep space background rectangle', () => {
      const rectangleSpy = jest.spyOn(scene.add, 'rectangle')
      
      manager.setupSpaceBackground()

      expect(rectangleSpy).toHaveBeenCalledWith(
        400, 300, 800, 600, // center x, center y, width, height
        0x0A0A1F, 1.0 // color, alpha
      )
    })

    test('creates starfield with 100 stars', () => {
      const circleSpy = jest.spyOn(scene.add, 'circle')
      
      manager.setupSpaceBackground()

      expect(circleSpy).toHaveBeenCalledTimes(100)
      
      // Verify stars have random positions and properties
      const starCalls = circleSpy.mock.calls
      starCalls.forEach(call => {
        const [x, y, size, color, alpha] = call
        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThanOrEqual(800)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThanOrEqual(600)
        expect(size).toBeGreaterThanOrEqual(1)
        expect(size).toBeLessThanOrEqual(3)
        expect(color).toBe(0xFFFFFF)
        expect(alpha).toBeGreaterThanOrEqual(0.3)
        expect(alpha).toBeLessThanOrEqual(0.9)
      })
    })

    test('creates scene title', () => {
      const textSpy = jest.spyOn(scene.add, 'text')
      const mockTitle = { setOrigin: jest.fn().mockReturnThis() }
      textSpy.mockReturnValue(mockTitle)
      
      manager.setupSpaceBackground()

      expect(textSpy).toHaveBeenCalledWith(
        400, 60, '🚀 Skills Command Center',
        expect.objectContaining({
          fontSize: '32px',
          color: '#ECF0F1',
          fontStyle: 'bold'
        })
      )
      expect(mockTitle.setOrigin).toHaveBeenCalledWith(0.5)
    })

    test('creates subtitle description', () => {
      const textSpy = jest.spyOn(scene.add, 'text')
      const mockSubtitle = { setOrigin: jest.fn().mockReturnThis() }
      textSpy.mockReturnValue(mockSubtitle)
      
      manager.setupSpaceBackground()

      expect(textSpy).toHaveBeenCalledWith(
        400, 120, 'Navigate to different stations to explore technical expertise',
        expect.objectContaining({
          fontSize: '18px',
          color: '#BDC3C7'
        })
      )
    })
  })

  describe('setupPortals', () => {
    let mockCallback

    beforeEach(() => {
      mockCallback = jest.fn()
    })

    test('creates portals group and returns it', () => {
      const groupSpy = jest.spyOn(scene.add, 'group')
      const mockGroup = { add: jest.fn() }
      groupSpy.mockReturnValue(mockGroup)
      
      const result = manager.setupPortals(mockCallback)

      expect(groupSpy).toHaveBeenCalled()
      expect(result).toBe(mockGroup)
    })

    test('creates portal containers for each portal', () => {
      const containerSpy = jest.spyOn(scene.add, 'container')
      const mockContainer = {
        add: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSize: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      }
      containerSpy.mockReturnValue(mockContainer)
      
      // Mock physics.add.existing
      scene.physics = { add: { existing: jest.fn() } }
      
      manager.setupPortals(mockCallback)

      // Should create 2 portal containers (forest and tower)
      expect(containerSpy).toHaveBeenCalledTimes(2)
      
      // Check portal positions
      expect(containerSpy).toHaveBeenNthCalledWith(1, 50, 300) // forest: left side
      expect(containerSpy).toHaveBeenNthCalledWith(2, 750, 300) // tower: right side
    })

    test('creates portal visual elements', () => {
      const rectangleSpy = jest.spyOn(scene.add, 'rectangle')
      const textSpy = jest.spyOn(scene.add, 'text')
      const mockContainer = {
        add: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSize: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      }
      jest.spyOn(scene.add, 'container').mockReturnValue(mockContainer)
      scene.physics = { add: { existing: jest.fn() } }
      
      manager.setupPortals(mockCallback)

      // Should create rectangles for portal backgrounds
      expect(rectangleSpy).toHaveBeenCalledTimes(2)
      expect(rectangleSpy).toHaveBeenNthCalledWith(1, 0, 0, 60, 80, 0x27ae60, 0.7) // forest
      expect(rectangleSpy).toHaveBeenNthCalledWith(2, 0, 0, 60, 80, 0x8e44ad, 0.7) // tower
      
      // Should create text elements for emojis and names
      expect(textSpy).toHaveBeenCalledTimes(4) // 2 emojis + 2 names
    })

    test('sets up portal interaction callbacks', () => {
      const mockContainer = {
        add: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSize: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn()
      }
      jest.spyOn(scene.add, 'container').mockReturnValue(mockContainer)
      scene.physics = { add: { existing: jest.fn() } }
      
      manager.setupPortals(mockCallback)

      // Both portals should have interaction callbacks set up
      expect(mockContainer.on).toHaveBeenCalledTimes(2)
      expect(mockContainer.on).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    })

    test('portal callbacks trigger onActivate with correct scene names', () => {
      const mockContainer = {
        add: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSize: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn()
      }
      jest.spyOn(scene.add, 'container').mockReturnValue(mockContainer)
      scene.physics = { add: { existing: jest.fn() } }
      
      manager.setupPortals(mockCallback)

      // Get the callback functions
      const forestCallback = mockContainer.on.mock.calls[0][1]
      const towerCallback = mockContainer.on.mock.calls[1][1]
      
      // Trigger callbacks
      forestCallback()
      towerCallback()
      
      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect(mockCallback).toHaveBeenNthCalledWith(1, 'ProjectForestScene')
      expect(mockCallback).toHaveBeenNthCalledWith(2, 'ResumeTowerScene')
    })
  })

  describe('ensureLaserTexture', () => {
    test('does nothing if texture already exists', () => {
      scene.textures.exists = jest.fn().mockReturnValue(true)
      const graphicsSpy = jest.spyOn(scene.add, 'graphics')
      
      manager.ensureLaserTexture()

      expect(scene.textures.exists).toHaveBeenCalledWith('laser-beam')
      expect(graphicsSpy).not.toHaveBeenCalled()
    })

    test('creates laser texture if it does not exist', () => {
      scene.textures.exists = jest.fn().mockReturnValue(false)
      const mockGraphics = {
        clear: jest.fn().mockReturnThis(),
        fillStyle: jest.fn().mockReturnThis(),
        fillRoundedRect: jest.fn().mockReturnThis(),
        generateTexture: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'graphics').mockReturnValue(mockGraphics)
      
      manager.ensureLaserTexture()

      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0x00ffff, 1)
      expect(mockGraphics.fillRoundedRect).toHaveBeenCalledWith(0, 0, 6, 28, 3)
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith('laser-beam', 6, 28)
      expect(mockGraphics.destroy).toHaveBeenCalled()
    })
  })

  describe('ensureEnemyLaserTexture', () => {
    test('does nothing if texture already exists', () => {
      scene.textures.exists = jest.fn().mockReturnValue(true)
      const graphicsSpy = jest.spyOn(scene.add, 'graphics')
      
      manager.ensureEnemyLaserTexture()

      expect(scene.textures.exists).toHaveBeenCalledWith('enemy-laser')
      expect(graphicsSpy).not.toHaveBeenCalled()
    })

    test('creates enemy laser texture with red color', () => {
      scene.textures.exists = jest.fn().mockReturnValue(false)
      const mockGraphics = {
        clear: jest.fn().mockReturnThis(),
        fillStyle: jest.fn().mockReturnThis(),
        fillRoundedRect: jest.fn().mockReturnThis(),
        generateTexture: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }
      jest.spyOn(scene.add, 'graphics').mockReturnValue(mockGraphics)
      
      manager.ensureEnemyLaserTexture()

      expect(mockGraphics.fillStyle).toHaveBeenCalledWith(0xff4d3a, 1) // Red color
      expect(mockGraphics.generateTexture).toHaveBeenCalledWith('enemy-laser', 6, 28)
    })
  })

  describe('portal data creation', () => {
    test('creates correct portal data structure', () => {
      const mockCallback = jest.fn()
      const mockContainer = {
        add: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSize: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      }
      jest.spyOn(scene.add, 'container').mockReturnValue(mockContainer)
      scene.physics = { add: { existing: jest.fn() } }
      
      manager.setupPortals(mockCallback)

      // Verify portal data is set correctly
      expect(mockContainer.setData).toHaveBeenCalledWith('portalData', {
        id: 'forest',
        name: 'Project Forest',
        targetScene: 'ProjectForestScene'
      })
      
      expect(mockContainer.setData).toHaveBeenCalledWith('portalData', {
        id: 'tower',
        name: 'Résumé Tower',
        targetScene: 'ResumeTowerScene'
      })
      
      expect(mockContainer.setData).toHaveBeenCalledWith('isPortal', true)
    })
  })

  describe('integration', () => {
    test('all setup methods can be called together', () => {
      expect(() => {
        manager.setupSpaceBackground()
        manager.ensureLaserTexture()
        manager.ensureEnemyLaserTexture()
        manager.setupPortals(jest.fn())
      }).not.toThrow()
    })

    test('handles different screen sizes', () => {
      scene.scale = { width: 1200, height: 800 }
      const rectangleSpy = jest.spyOn(scene.add, 'rectangle')
      
      manager.setupSpaceBackground()

      expect(rectangleSpy).toHaveBeenCalledWith(
        600, 400, 1200, 800, // Adjusted to new screen size
        0x0A0A1F, 1.0
      )
    })
  })
})
