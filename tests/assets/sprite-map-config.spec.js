const {
  FIVE_STATIONS_REGIONS,
  MORE_STATIONS_REGIONS,
  STATION_COLOR_TINTS,
  STATION_SPRITE_MAP,
  getStationSpriteConfig,
  getColorTint
} = require('@/assets/images/space-stations/sprite-map-config')

describe('Sprite Map Config Module', () => {
  // ===============================================
  // 📊 DATA STRUCTURE VALIDATION TESTS
  // ===============================================
  
  describe('Data Structure Validation', () => {
    test('has required exported properties', () => {
      expect(FIVE_STATIONS_REGIONS).toBeDefined()
      expect(MORE_STATIONS_REGIONS).toBeDefined()
      expect(STATION_COLOR_TINTS).toBeDefined()
      expect(STATION_SPRITE_MAP).toBeDefined()
      expect(getStationSpriteConfig).toBeDefined()
      expect(getColorTint).toBeDefined()
    })

    test('FIVE_STATIONS_REGIONS is a non-empty array', () => {
      expect(Array.isArray(FIVE_STATIONS_REGIONS)).toBe(true)
      expect(FIVE_STATIONS_REGIONS.length).toBeGreaterThan(0)
    })

    test('MORE_STATIONS_REGIONS is a non-empty array', () => {
      expect(Array.isArray(MORE_STATIONS_REGIONS)).toBe(true)
      expect(MORE_STATIONS_REGIONS.length).toBeGreaterThan(0)
    })

    test('STATION_COLOR_TINTS is an object', () => {
      expect(typeof STATION_COLOR_TINTS).toBe('object')
      expect(STATION_COLOR_TINTS).not.toBeNull()
    })

    test('STATION_SPRITE_MAP is a non-empty array', () => {
      expect(Array.isArray(STATION_SPRITE_MAP)).toBe(true)
      expect(STATION_SPRITE_MAP.length).toBeGreaterThan(0)
    })

    test('helper functions are functions', () => {
      expect(typeof getStationSpriteConfig).toBe('function')
      expect(typeof getColorTint).toBe('function')
    })
  })

  // ===============================================
  // 🎯 FIVE STATIONS REGIONS VALIDATION
  // ===============================================
  
  describe('Five Stations Regions Validation', () => {
    test('all stations have required properties', () => {
      FIVE_STATIONS_REGIONS.forEach((station, index) => {
        expect(station).toHaveProperty('stationType')
        expect(station).toHaveProperty('baseRegion')
        expect(station).toHaveProperty('description')
        
        // Verify they are not null/undefined
        expect(station.stationType).toBeDefined()
        expect(station.baseRegion).toBeDefined()
        expect(station.description).toBeDefined()
      })
    })

    test('station types are valid and unique', () => {
      const validTypes = ['A', 'B', 'C', 'D', 'E']
      const stationTypes = FIVE_STATIONS_REGIONS.map(s => s.stationType)
      
      stationTypes.forEach(type => {
        expect(validTypes).toContain(type)
      })
      
      // Check uniqueness
      const uniqueTypes = new Set(stationTypes)
      expect(stationTypes.length).toBe(uniqueTypes.size)
    })

    test('all base regions have valid coordinates and dimensions', () => {
      FIVE_STATIONS_REGIONS.forEach((station, index) => {
        const region = station.baseRegion
        
        expect(region).toHaveProperty('x')
        expect(region).toHaveProperty('y')
        expect(region).toHaveProperty('width')
        expect(region).toHaveProperty('height')
        expect(region).toHaveProperty('sourceImage')
        
        // Validate coordinate types and values
        expect(typeof region.x).toBe('number')
        expect(typeof region.y).toBe('number')
        expect(typeof region.width).toBe('number')
        expect(typeof region.height).toBe('number')
        expect(typeof region.sourceImage).toBe('string')
        
        // Coordinates should be non-negative
        expect(region.x).toBeGreaterThanOrEqual(0)
        expect(region.y).toBeGreaterThanOrEqual(0)
        expect(region.width).toBeGreaterThan(0)
        expect(region.height).toBeGreaterThan(0)
        expect(region.sourceImage.trim().length).toBeGreaterThan(0)
      })
    })

    test('descriptions are non-empty strings', () => {
      FIVE_STATIONS_REGIONS.forEach((station, index) => {
        expect(typeof station.description).toBe('string')
        expect(station.description.trim().length).toBeGreaterThan(0)
      })
    })

    test('all use five-stations source image', () => {
      FIVE_STATIONS_REGIONS.forEach(station => {
        expect(station.baseRegion.sourceImage).toBe('five-stations')
      })
    })

    test('specific station configurations are correct', () => {
      const stationA = FIVE_STATIONS_REGIONS.find(s => s.stationType === 'A')
      expect(stationA).toBeDefined()
      expect(stationA?.description).toBe('Compact Research Module')
      expect(stationA?.baseRegion).toEqual({
        x: 50, y: 50, width: 300, height: 300,
        sourceImage: 'five-stations'
      })

      const stationE = FIVE_STATIONS_REGIONS.find(s => s.stationType === 'E')
      expect(stationE).toBeDefined()
      expect(stationE?.description).toBe('Command Station')
      expect(stationE?.baseRegion).toEqual({
        x: 500, y: 500, width: 300, height: 300,
        sourceImage: 'five-stations'
      })
    })

    test('covers all station types A through E', () => {
      const expectedTypes = ['A', 'B', 'C', 'D', 'E']
      const actualTypes = FIVE_STATIONS_REGIONS.map(s => s.stationType).sort()
      expect(actualTypes).toEqual(expectedTypes)
    })
  })

  // ===============================================
  // 🚀 MORE STATIONS REGIONS VALIDATION
  // ===============================================
  
  describe('More Stations Regions Validation', () => {
    test('all regions have required properties', () => {
      MORE_STATIONS_REGIONS.forEach((region, index) => {
        expect(region).toHaveProperty('x')
        expect(region).toHaveProperty('y')
        expect(region).toHaveProperty('width')
        expect(region).toHaveProperty('height')
        expect(region).toHaveProperty('sourceImage')
      })
    })

    test('all regions have valid coordinates and dimensions', () => {
      MORE_STATIONS_REGIONS.forEach((region, index) => {
        expect(typeof region.x).toBe('number')
        expect(typeof region.y).toBe('number')
        expect(typeof region.width).toBe('number')
        expect(typeof region.height).toBe('number')
        expect(typeof region.sourceImage).toBe('string')
        
        expect(region.x).toBeGreaterThanOrEqual(0)
        expect(region.y).toBeGreaterThanOrEqual(0)
        expect(region.width).toBeGreaterThan(0)
        expect(region.height).toBeGreaterThan(0)
        expect(region.sourceImage.trim().length).toBeGreaterThan(0)
      })
    })

    test('all use more-stations source image', () => {
      MORE_STATIONS_REGIONS.forEach(region => {
        expect(region.sourceImage).toBe('more-stations')
      })
    })

    test('regions follow horizontal layout pattern', () => {
      // Should have consistent y coordinate (horizontal layout)
      const yCoordinates = MORE_STATIONS_REGIONS.map(r => r.y)
      const uniqueY = new Set(yCoordinates)
      expect(uniqueY.size).toBe(1) // All should have same Y coordinate
      expect(yCoordinates[0]).toBe(200)

      // Width should be consistent
      const widths = MORE_STATIONS_REGIONS.map(r => r.width)
      const uniqueWidths = new Set(widths)
      expect(uniqueWidths.size).toBe(1)
      expect(widths[0]).toBe(256)

      // X coordinates should be in ascending order
      const xCoordinates = MORE_STATIONS_REGIONS.map(r => r.x)
      for (let i = 1; i < xCoordinates.length; i++) {
        expect(xCoordinates[i]).toBeGreaterThan(xCoordinates[i - 1])
      }
    })

    test('has expected number of stations', () => {
      expect(MORE_STATIONS_REGIONS.length).toBe(6)
    })

    test('x coordinates are properly spaced', () => {
      const expectedXs = [0, 256, 512, 768, 1024, 1280]
      const actualXs = MORE_STATIONS_REGIONS.map(r => r.x)
      expect(actualXs).toEqual(expectedXs)
    })
  })

  // ===============================================
  // 🎨 COLOR TINTS VALIDATION
  // ===============================================
  
  describe('Station Color Tints Validation', () => {
    test('has all expected color variants', () => {
      const expectedColors = ['blue', 'green', 'orange', 'purple', 'gray', 'cyan', 'gold']
      expectedColors.forEach(color => {
        expect(STATION_COLOR_TINTS).toHaveProperty(color)
      })
    })

    test('all color values are valid hex numbers', () => {
      Object.values(STATION_COLOR_TINTS).forEach(color => {
        expect(typeof color).toBe('number')
        expect(color).toBeGreaterThanOrEqual(0)
        expect(color).toBeLessThanOrEqual(0xFFFFFF)
      })
    })

    test('color values are unique', () => {
      const colors = Object.values(STATION_COLOR_TINTS)
      const uniqueColors = new Set(colors)
      expect(colors.length).toBe(uniqueColors.size)
    })

    test('specific color mappings are correct', () => {
      expect(STATION_COLOR_TINTS.blue).toBe(0x4A6FA5)
      expect(STATION_COLOR_TINTS.green).toBe(0x5FB85F)
      expect(STATION_COLOR_TINTS.orange).toBe(0xE67E22)
      expect(STATION_COLOR_TINTS.purple).toBe(0x9B59B6)
      expect(STATION_COLOR_TINTS.gray).toBe(0x7F8C8D)
      expect(STATION_COLOR_TINTS.cyan).toBe(0x1ABC9C)
      expect(STATION_COLOR_TINTS.gold).toBe(0xF39C12)
    })

    test('color names match expected skills', () => {
      // Based on comments in original file
      expect(STATION_COLOR_TINTS.blue).toBeDefined() // Frontend
      expect(STATION_COLOR_TINTS.green).toBeDefined() // Testing
      expect(STATION_COLOR_TINTS.orange).toBeDefined() // Architecture
      expect(STATION_COLOR_TINTS.purple).toBeDefined() // Tooling
      expect(STATION_COLOR_TINTS.gray).toBeDefined() // Security
      expect(STATION_COLOR_TINTS.cyan).toBeDefined() // AI
      expect(STATION_COLOR_TINTS.gold).toBeDefined() // Leadership
    })
  })

  // ===============================================
  // 🗺️ STATION SPRITE MAP VALIDATION
  // ===============================================
  
  describe('Station Sprite Map Validation', () => {
    test('all entries have required properties', () => {
      STATION_SPRITE_MAP.forEach((entry, index) => {
        expect(entry).toHaveProperty('id')
        expect(entry).toHaveProperty('type')
        expect(entry).toHaveProperty('color')
        expect(entry).toHaveProperty('skill')
        
        expect(entry.id).toBeDefined()
        expect(entry.type).toBeDefined()
        expect(entry.color).toBeDefined()
        expect(entry.skill).toBeDefined()
      })
    })

    test('IDs are unique', () => {
      const ids = STATION_SPRITE_MAP.map(entry => entry.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    test('station types are valid', () => {
      const validTypes = ['A', 'B', 'C', 'D', 'E']
      STATION_SPRITE_MAP.forEach(entry => {
        expect(validTypes).toContain(entry.type)
      })
    })

    test('colors exist in color tints', () => {
      STATION_SPRITE_MAP.forEach(entry => {
        expect(STATION_COLOR_TINTS).toHaveProperty(entry.color)
      })
    })

    test('skills are non-empty strings', () => {
      STATION_SPRITE_MAP.forEach(entry => {
        expect(typeof entry.skill).toBe('string')
        expect(entry.skill.trim().length).toBeGreaterThan(0)
      })
    })

    test('ID format matches pattern', () => {
      const idPattern = /^station-[a-z]-[a-z]+$/
      STATION_SPRITE_MAP.forEach(entry => {
        expect(entry.id).toMatch(idPattern)
      })
    })

    test('specific mappings are correct', () => {
      const frontendEntry = STATION_SPRITE_MAP.find(e => e.skill === 'Frontend')
      expect(frontendEntry).toBeDefined()
      expect(frontendEntry?.type).toBe('A')
      expect(frontendEntry?.color).toBe('blue')
      expect(frontendEntry?.id).toBe('station-a-blue')

      const aiEntry = STATION_SPRITE_MAP.find(e => e.skill === 'AI')
      expect(aiEntry).toBeDefined()
      expect(aiEntry?.type).toBe('D')
      expect(aiEntry?.color).toBe('cyan')
      expect(aiEntry?.id).toBe('station-d-cyan')
    })
  })

  // ===============================================
  // 🔧 HELPER FUNCTION TESTS
  // ===============================================
  
  describe('Helper Functions', () => {
    describe('getStationSpriteConfig', () => {
      test('returns correct config for valid station types', () => {
        const configA = getStationSpriteConfig('A')
        expect(configA).toBeDefined()
        expect(configA?.stationType).toBe('A')
        expect(configA?.description).toBe('Compact Research Module')
        
        const configB = getStationSpriteConfig('B')
        expect(configB).toBeDefined()
        expect(configB?.stationType).toBe('B')
        expect(configB?.description).toBe('Industrial Platform')
        
        const configC = getStationSpriteConfig('C')
        expect(configC).toBeDefined()
        expect(configC?.stationType).toBe('C')
        expect(configC?.description).toBe('Large Hub Station')
        
        const configD = getStationSpriteConfig('D')
        expect(configD).toBeDefined()
        expect(configD?.stationType).toBe('D')
        expect(configD?.description).toBe('Specialized Research')
        
        const configE = getStationSpriteConfig('E')
        expect(configE).toBeDefined()
        expect(configE?.stationType).toBe('E')
        expect(configE?.description).toBe('Command Station')
      })

      test('returns undefined for invalid station types', () => {
        expect(getStationSpriteConfig('F')).toBeUndefined()
        expect(getStationSpriteConfig('Z')).toBeUndefined()
        expect(getStationSpriteConfig('1')).toBeUndefined()
      })

      test('returns undefined for null/undefined input', () => {
        expect(getStationSpriteConfig(null)).toBeUndefined()
        expect(getStationSpriteConfig(undefined)).toBeUndefined()
      })

      test('returns undefined for empty string', () => {
        expect(getStationSpriteConfig('')).toBeUndefined()
      })

      test('is case sensitive', () => {
        expect(getStationSpriteConfig('a')).toBeUndefined()
        expect(getStationSpriteConfig('A')).toBeDefined()
      })

      test('returns exact config object references', () => {
        const configA = getStationSpriteConfig('A')
        const expectedConfigA = FIVE_STATIONS_REGIONS.find(c => c.stationType === 'A')
        expect(configA).toBe(expectedConfigA)
      })

      test('works for all valid station types', () => {
        const validTypes = ['A', 'B', 'C', 'D', 'E']
        validTypes.forEach(type => {
          const config = getStationSpriteConfig(type)
          expect(config).toBeDefined()
          expect(config?.stationType).toBe(type)
        })
      })
    })

    describe('getColorTint', () => {
      test('returns correct color for valid color names', () => {
        expect(getColorTint('blue')).toBe(0x4A6FA5)
        expect(getColorTint('green')).toBe(0x5FB85F)
        expect(getColorTint('orange')).toBe(0xE67E22)
        expect(getColorTint('purple')).toBe(0x9B59B6)
        expect(getColorTint('gray')).toBe(0x7F8C8D)
        expect(getColorTint('cyan')).toBe(0x1ABC9C)
        expect(getColorTint('gold')).toBe(0xF39C12)
      })

      test('returns white (0xFFFFFF) for invalid color names', () => {
        expect(getColorTint('invalid')).toBe(0xFFFFFF)
        expect(getColorTint('red')).toBe(0xFFFFFF)
        expect(getColorTint('black')).toBe(0xFFFFFF)
        expect(getColorTint('notacolor')).toBe(0xFFFFFF)
      })

      test('returns white for null/undefined input', () => {
        expect(getColorTint(null)).toBe(0xFFFFFF)
        expect(getColorTint(undefined)).toBe(0xFFFFFF)
      })

      test('returns white for empty string', () => {
        expect(getColorTint('')).toBe(0xFFFFFF)
      })

      test('is case sensitive', () => {
        expect(getColorTint('Blue')).toBe(0xFFFFFF)
        expect(getColorTint('BLUE')).toBe(0xFFFFFF)
        expect(getColorTint('blue')).toBe(0x4A6FA5)
      })

      test('returns white for whitespace input', () => {
        expect(getColorTint(' blue ')).toBe(0xFFFFFF)
        expect(getColorTint('\t')).toBe(0xFFFFFF)
        expect(getColorTint('\n')).toBe(0xFFFFFF)
      })

      test('works for all valid color names', () => {
        const validColors = ['blue', 'green', 'orange', 'purple', 'gray', 'cyan', 'gold']
        validColors.forEach(color => {
          const tint = getColorTint(color)
          expect(tint).toBeDefined()
          expect(typeof tint).toBe('number')
          expect(tint).not.toBe(0xFFFFFF) // Should not be the fallback white
        })
      })

      test('handles numeric input gracefully', () => {
        expect(getColorTint(123)).toBe(0xFFFFFF)
        expect(getColorTint(0)).toBe(0xFFFFFF)
      })

      test('handles object input gracefully', () => {
        expect(getColorTint({})).toBe(0xFFFFFF)
        expect(getColorTint([])).toBe(0xFFFFFF)
      })
    })
  })

  // ===============================================
  // 🧪 DATA CONSISTENCY TESTS
  // ===============================================
  
  describe('Data Consistency', () => {
    test('sprite map colors exist in color tints', () => {
      STATION_SPRITE_MAP.forEach(entry => {
        expect(STATION_COLOR_TINTS).toHaveProperty(entry.color)
        const colorValue = STATION_COLOR_TINTS[entry.color]
        expect(typeof colorValue).toBe('number')
      })
    })

    test('sprite map types exist in five stations regions', () => {
      STATION_SPRITE_MAP.forEach(entry => {
        const config = getStationSpriteConfig(entry.type)
        expect(config).toBeDefined()
      })
    })

    test('no duplicate skills in sprite map', () => {
      const skills = STATION_SPRITE_MAP.map(entry => entry.skill)
      const uniqueSkills = new Set(skills)
      expect(skills.length).toBe(uniqueSkills.size)
    })

    test('five stations regions dimensions fit expected bounds', () => {
      // Assuming 1024x1024 source image
      FIVE_STATIONS_REGIONS.forEach(station => {
        const region = station.baseRegion
        expect(region.x + region.width).toBeLessThanOrEqual(1024)
        expect(region.y + region.height).toBeLessThanOrEqual(1024)
      })
    })

    test('more stations regions dimensions fit expected bounds', () => {
      // Assuming 1536x1024 source image
      MORE_STATIONS_REGIONS.forEach(region => {
        expect(region.x + region.width).toBeLessThanOrEqual(1536)
        expect(region.y + region.height).toBeLessThanOrEqual(1024)
      })
    })

    test('color tint values are within valid hex range', () => {
      Object.values(STATION_COLOR_TINTS).forEach(color => {
        expect(color).toBeGreaterThanOrEqual(0x000000)
        expect(color).toBeLessThanOrEqual(0xFFFFFF)
      })
    })
  })

  // ===============================================
  // 🚀 PERFORMANCE TESTS
  // ===============================================
  
  describe('Performance', () => {
    test('helper functions execute quickly', () => {
      const iterations = 1000
      
      // Test getStationSpriteConfig performance
      const start1 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getStationSpriteConfig('A')
        getStationSpriteConfig('B')
        getStationSpriteConfig('C')
      }
      const end1 = performance.now()
      expect(end1 - start1).toBeLessThan(100)

      // Test getColorTint performance
      const start2 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getColorTint('blue')
        getColorTint('green')
        getColorTint('invalid')
      }
      const end2 = performance.now()
      expect(end2 - start2).toBeLessThan(100)
    })

    test('data structures are reasonably sized', () => {
      expect(FIVE_STATIONS_REGIONS.length).toBeLessThan(20)
      expect(MORE_STATIONS_REGIONS.length).toBeLessThan(20)
      expect(Object.keys(STATION_COLOR_TINTS).length).toBeLessThan(20)
      expect(STATION_SPRITE_MAP.length).toBeLessThan(20)
    })
  })

  // ===============================================
  // 🔍 EDGE CASES & ERROR HANDLING
  // ===============================================
  
  describe('Edge Cases & Error Handling', () => {
    test('functions handle invalid inputs gracefully', () => {
      const invalidInputs = [null, undefined, '', 0, false, [], {}, 'invalid']
      
      invalidInputs.forEach(input => {
        expect(() => getStationSpriteConfig(input)).not.toThrow()
        expect(() => getColorTint(input)).not.toThrow()
      })
    })

    test('data remains immutable after function calls', () => {
      const originalFiveStations = [...FIVE_STATIONS_REGIONS]
      const originalColorTints = { ...STATION_COLOR_TINTS }
      
      // Call functions multiple times
      getStationSpriteConfig('A')
      getColorTint('blue')
      
      // Verify data unchanged
      expect(FIVE_STATIONS_REGIONS).toEqual(originalFiveStations)
      expect(STATION_COLOR_TINTS).toEqual(originalColorTints)
    })

    test('functions return consistent results', () => {
      // Multiple calls should return same results
      const config1 = getStationSpriteConfig('A')
      const config2 = getStationSpriteConfig('A')
      expect(config1).toBe(config2)
      
      const color1 = getColorTint('blue')
      const color2 = getColorTint('blue')
      expect(color1).toBe(color2)
    })

    test('boundary value testing', () => {
      // Test first and last valid values
      expect(getStationSpriteConfig('A')).toBeDefined()
      expect(getStationSpriteConfig('E')).toBeDefined()
      
      // Test values just outside valid range
      expect(getStationSpriteConfig('F')).toBeUndefined()
      expect(getStationSpriteConfig('0')).toBeUndefined()
    })
  })
})
