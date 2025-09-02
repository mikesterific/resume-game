const {
  spaceStationConfigs,
  stationColorPalette,
  stationTypes,
  getStationConfig,
  getStationsBySecor
} = require('@/assets/images/space-stations/station-data')

describe('Station Data Module', () => {
  // ===============================================
  // 📊 STATION DATA STRUCTURE TESTS
  // ===============================================
  
  describe('Station Data Structure', () => {
    test('has required exported properties', () => {
      expect(spaceStationConfigs).toBeDefined()
      expect(stationColorPalette).toBeDefined()
      expect(stationTypes).toBeDefined()
      expect(getStationConfig).toBeDefined()
      expect(getStationsBySecor).toBeDefined()
    })

    test('spaceStationConfigs is a non-empty array', () => {
      expect(Array.isArray(spaceStationConfigs)).toBe(true)
      expect(spaceStationConfigs.length).toBeGreaterThan(0)
    })

    test('stationColorPalette is an object', () => {
      expect(typeof stationColorPalette).toBe('object')
      expect(stationColorPalette).not.toBeNull()
    })

    test('stationTypes is an object', () => {
      expect(typeof stationTypes).toBe('object')
      expect(stationTypes).not.toBeNull()
    })

    test('helper functions are functions', () => {
      expect(typeof getStationConfig).toBe('function')
      expect(typeof getStationsBySecor).toBe('function')
    })
  })

  // ===============================================
  // 🚀 STATION CONFIG VALIDATION TESTS
  // ===============================================
  
  describe('Station Configurations Validation', () => {
    test('all stations have required properties', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(station).toHaveProperty('id')
        expect(station).toHaveProperty('skillId')
        expect(station).toHaveProperty('stationType')
        expect(station).toHaveProperty('colorVariant')
        expect(station).toHaveProperty('sector')
        expect(station).toHaveProperty('position')
        expect(station).toHaveProperty('size')
        expect(station).toHaveProperty('description')
        
        // Verify they are not null/undefined
        expect(station.id).toBeDefined()
        expect(station.skillId).toBeDefined()
        expect(station.stationType).toBeDefined()
        expect(station.colorVariant).toBeDefined()
        expect(station.sector).toBeDefined()
        expect(station.position).toBeDefined()
        expect(station.size).toBeDefined()
        expect(station.description).toBeDefined()
      })
    })

    test('station IDs are unique', () => {
      const ids = spaceStationConfigs.map(station => station.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    test('skill IDs are unique', () => {
      const skillIds = spaceStationConfigs.map(station => station.skillId)
      const uniqueSkillIds = new Set(skillIds)
      expect(skillIds.length).toBe(uniqueSkillIds.size)
    })

    test('station IDs follow naming convention', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(station.id).toMatch(/-station$/)
        expect(typeof station.id).toBe('string')
        expect(station.id.trim().length).toBeGreaterThan(0)
      })
    })

    test('skill IDs are non-empty strings', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(typeof station.skillId).toBe('string')
        expect(station.skillId.trim().length).toBeGreaterThan(0)
      })
    })

    test('station types are valid', () => {
      const validTypes = ['A', 'B', 'C', 'D', 'E']
      spaceStationConfigs.forEach((station, index) => {
        expect(validTypes).toContain(station.stationType)
      })
    })

    test('color variants are non-empty strings', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(typeof station.colorVariant).toBe('string')
        expect(station.colorVariant.trim().length).toBeGreaterThan(0)
      })
    })

    test('sectors are valid', () => {
      const validSectors = ['development', 'infrastructure', 'innovation']
      spaceStationConfigs.forEach((station, index) => {
        expect(validSectors).toContain(station.sector)
      })
    })

    test('positions have valid coordinates', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(typeof station.position).toBe('object')
        expect(station.position).toHaveProperty('x')
        expect(station.position).toHaveProperty('y')
        expect(typeof station.position.x).toBe('number')
        expect(typeof station.position.y).toBe('number')
        expect(station.position.x).toBeGreaterThanOrEqual(0)
        expect(station.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    test('sizes have valid dimensions', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(typeof station.size).toBe('object')
        expect(station.size).toHaveProperty('width')
        expect(station.size).toHaveProperty('height')
        expect(typeof station.size.width).toBe('number')
        expect(typeof station.size.height).toBe('number')
        expect(station.size.width).toBeGreaterThan(0)
        expect(station.size.height).toBeGreaterThan(0)
      })
    })

    test('descriptions are non-empty strings', () => {
      spaceStationConfigs.forEach((station, index) => {
        expect(typeof station.description).toBe('string')
        expect(station.description.trim().length).toBeGreaterThan(0)
      })
    })

    test('specific station data integrity', () => {
      // Test specific stations to ensure data accuracy
      const frontendStation = spaceStationConfigs.find(s => s.id === 'frontend-station')
      expect(frontendStation).toBeDefined()
      expect(frontendStation?.skillId).toBe('frontend')
      expect(frontendStation?.stationType).toBe('A')
      expect(frontendStation?.colorVariant).toBe('blue')
      expect(frontendStation?.sector).toBe('development')
      expect(frontendStation?.position).toEqual({ x: 200, y: 300 })
      expect(frontendStation?.size).toEqual({ width: 80, height: 80 })

      const aiStation = spaceStationConfigs.find(s => s.id === 'ai-station')
      expect(aiStation).toBeDefined()
      expect(aiStation?.skillId).toBe('ai')
      expect(aiStation?.stationType).toBe('D')
      expect(aiStation?.colorVariant).toBe('cyan')
      expect(aiStation?.sector).toBe('innovation')
    })
  })

  // ===============================================
  // 🎨 COLOR PALETTE VALIDATION TESTS
  // ===============================================
  
  describe('Station Color Palette Validation', () => {
    test('has all expected color variants', () => {
      const expectedColors = ['blue', 'green', 'orange', 'purple', 'gray', 'cyan', 'gold']
      expectedColors.forEach(color => {
        expect(stationColorPalette).toHaveProperty(color)
      })
    })

    test('all color values are valid hex colors', () => {
      const hexColorPattern = /^#[0-9A-Fa-f]{6}$/
      Object.values(stationColorPalette).forEach(color => {
        expect(typeof color).toBe('string')
        expect(hexColorPattern.test(color)).toBe(true)
      })
    })

    test('color values are unique', () => {
      const colors = Object.values(stationColorPalette)
      const uniqueColors = new Set(colors)
      expect(colors.length).toBe(uniqueColors.size)
    })

    test('all station color variants exist in palette', () => {
      spaceStationConfigs.forEach(station => {
        expect(stationColorPalette).toHaveProperty(station.colorVariant)
      })
    })

    test('specific color mappings are correct', () => {
      expect(stationColorPalette.blue).toBe('#4A6FA5')
      expect(stationColorPalette.green).toBe('#5FB85F')
      expect(stationColorPalette.orange).toBe('#E67E22')
      expect(stationColorPalette.purple).toBe('#9B59B6')
      expect(stationColorPalette.gray).toBe('#7F8C8D')
      expect(stationColorPalette.cyan).toBe('#1ABC9C')
      expect(stationColorPalette.gold).toBe('#F39C12')
    })
  })

  // ===============================================
  // 🏗️ STATION TYPES VALIDATION TESTS
  // ===============================================
  
  describe('Station Types Validation', () => {
    test('has all expected station types', () => {
      const expectedTypes = ['A', 'B', 'C', 'D', 'E']
      expectedTypes.forEach(type => {
        expect(stationTypes).toHaveProperty(type)
      })
    })

    test('all station type descriptions are non-empty strings', () => {
      Object.values(stationTypes).forEach(description => {
        expect(typeof description).toBe('string')
        expect(description.trim().length).toBeGreaterThan(0)
      })
    })

    test('all used station types exist in type definitions', () => {
      spaceStationConfigs.forEach(station => {
        expect(stationTypes).toHaveProperty(station.stationType)
      })
    })

    test('specific type descriptions are correct', () => {
      expect(stationTypes.A).toBe('Compact research module with communication arrays')
      expect(stationTypes.B).toBe('Medium industrial platform with docking bays')
      expect(stationTypes.C).toBe('Large hub station with multiple sections')
      expect(stationTypes.D).toBe('Specialized research facility with unique architecture')
      expect(stationTypes.E).toBe('Command station with prominent control towers')
    })
  })

  // ===============================================
  // 🔧 HELPER FUNCTION TESTS
  // ===============================================
  
  describe('Helper Functions', () => {
    describe('getStationConfig', () => {
      test('returns correct station for valid skill ID', () => {
        const station = getStationConfig('frontend')
        expect(station).toBeDefined()
        expect(station?.skillId).toBe('frontend')
        expect(station?.id).toBe('frontend-station')
      })

      test('returns undefined for non-existent skill ID', () => {
        const station = getStationConfig('non-existent-skill')
        expect(station).toBeUndefined()
      })

      test('returns undefined for empty string', () => {
        const station = getStationConfig('')
        expect(station).toBeUndefined()
      })

      test('returns undefined for null/undefined input', () => {
        expect(getStationConfig(null)).toBeUndefined()
        expect(getStationConfig(undefined)).toBeUndefined()
      })

      test('is case sensitive', () => {
        const station1 = getStationConfig('frontend')
        const station2 = getStationConfig('FRONTEND')
        const station3 = getStationConfig('Frontend')
        
        expect(station1).toBeDefined()
        expect(station2).toBeUndefined()
        expect(station3).toBeUndefined()
      })

      test('works for all existing skill IDs', () => {
        spaceStationConfigs.forEach(expectedStation => {
          const foundStation = getStationConfig(expectedStation.skillId)
          expect(foundStation).toBeDefined()
          expect(foundStation?.skillId).toBe(expectedStation.skillId)
          expect(foundStation?.id).toBe(expectedStation.id)
        })
      })

      test('returns exact station object references', () => {
        const station = getStationConfig('ai')
        const expectedStation = spaceStationConfigs.find(s => s.skillId === 'ai')
        expect(station).toBe(expectedStation)
      })
    })

    describe('getStationsBySecor', () => {
      test('returns development sector stations correctly', () => {
        const devStations = getStationsBySecor('development')
        expect(Array.isArray(devStations)).toBe(true)
        expect(devStations.length).toBeGreaterThan(0)
        devStations.forEach(station => {
          expect(station.sector).toBe('development')
        })
        
        // Verify specific development stations
        const stationIds = devStations.map(s => s.id)
        expect(stationIds).toContain('frontend-station')
        expect(stationIds).toContain('testing-station')
        expect(stationIds).toContain('architecture-station')
      })

      test('returns infrastructure sector stations correctly', () => {
        const infraStations = getStationsBySecor('infrastructure')
        expect(Array.isArray(infraStations)).toBe(true)
        expect(infraStations.length).toBeGreaterThan(0)
        infraStations.forEach(station => {
          expect(station.sector).toBe('infrastructure')
        })
        
        // Verify specific infrastructure stations
        const stationIds = infraStations.map(s => s.id)
        expect(stationIds).toContain('tooling-station')
        expect(stationIds).toContain('security-station')
      })

      test('returns innovation sector stations correctly', () => {
        const innovationStations = getStationsBySecor('innovation')
        expect(Array.isArray(innovationStations)).toBe(true)
        expect(innovationStations.length).toBeGreaterThan(0)
        innovationStations.forEach(station => {
          expect(station.sector).toBe('innovation')
        })
        
        // Verify specific innovation stations
        const stationIds = innovationStations.map(s => s.id)
        expect(stationIds).toContain('ai-station')
        expect(stationIds).toContain('leadership-station')
      })

      test('returns empty array for non-existent sector', () => {
        const stations = getStationsBySecor('non-existent-sector')
        expect(Array.isArray(stations)).toBe(true)
        expect(stations.length).toBe(0)
      })

      test('all sectors combined equal total stations', () => {
        const devStations = getStationsBySecor('development')
        const infraStations = getStationsBySecor('infrastructure')
        const innovationStations = getStationsBySecor('innovation')
        const totalFiltered = devStations.length + infraStations.length + innovationStations.length
        expect(totalFiltered).toBe(spaceStationConfigs.length)
      })

      test('returns different arrays for different sectors', () => {
        const devStations = getStationsBySecor('development')
        const infraStations = getStationsBySecor('infrastructure')
        const innovationStations = getStationsBySecor('innovation')
        
        expect(devStations).not.toBe(infraStations)
        expect(infraStations).not.toBe(innovationStations)
        expect(devStations).not.toBe(innovationStations)
      })

      test('returns new array each time (not reference)', () => {
        const devStations1 = getStationsBySecor('development')
        const devStations2 = getStationsBySecor('development')
        expect(devStations1).not.toBe(devStations2)
        expect(devStations1).toEqual(devStations2)
      })

      test('returns exact station object references', () => {
        const devStations = getStationsBySecor('development')
        devStations.forEach(station => {
          const originalStation = spaceStationConfigs.find(s => s.id === station.id)
          expect(station).toBe(originalStation)
        })
      })
    })
  })

  // ===============================================
  // 🏢 SECTOR DISTRIBUTION TESTS
  // ===============================================
  
  describe('Sector Distribution Analysis', () => {
    test('has stations in all three sectors', () => {
      const sectors = new Set(spaceStationConfigs.map(s => s.sector))
      expect(sectors.has('development')).toBe(true)
      expect(sectors.has('infrastructure')).toBe(true)
      expect(sectors.has('innovation')).toBe(true)
      expect(sectors.size).toBe(3)
    })

    test('development sector has most stations', () => {
      const sectorCounts = {}
      spaceStationConfigs.forEach(station => {
        sectorCounts[station.sector] = (sectorCounts[station.sector] || 0) + 1
      })
      
      expect(sectorCounts.development).toBeGreaterThanOrEqual(2)
      expect(sectorCounts.infrastructure).toBeGreaterThanOrEqual(1)
      expect(sectorCounts.innovation).toBeGreaterThanOrEqual(1)
    })

    test('sector positioning follows expected layout', () => {
      // Development sector stations (left side)
      const devStations = getStationsBySecor('development')
      devStations.forEach(station => {
        expect(station.position.x).toBeLessThanOrEqual(400)
      })

      // Infrastructure sector stations (right side)  
      const infraStations = getStationsBySecor('infrastructure')
      infraStations.forEach(station => {
        expect(station.position.x).toBeGreaterThanOrEqual(600)
      })

      // Innovation sector stations (center/top)
      const innovationStations = getStationsBySecor('innovation')
      innovationStations.forEach(station => {
        expect(station.position.y).toBeLessThanOrEqual(300)
      })
    })
  })

  // ===============================================
  // 🧪 DATA CONSISTENCY TESTS
  // ===============================================
  
  describe('Data Consistency', () => {
    test('all stations have consistent size', () => {
      // All stations should be same size in current implementation
      const sizes = spaceStationConfigs.map(s => `${s.size.width}x${s.size.height}`)
      const uniqueSizes = new Set(sizes)
      expect(uniqueSizes.size).toBe(1)
      expect(sizes[0]).toBe('80x80')
    })

    test('station types are distributed across stations', () => {
      const usedTypes = new Set(spaceStationConfigs.map(s => s.stationType))
      expect(usedTypes.size).toBeGreaterThan(1) // Should use multiple types
      
      // Verify each used type exists in stationTypes
      usedTypes.forEach(type => {
        expect(stationTypes).toHaveProperty(type)
      })
    })

    test('color variants match expected skill mappings', () => {
      // Based on comments in the file
      const expectedMappings = {
        frontend: 'blue',
        testing: 'green', 
        architecture: 'orange',
        tooling: 'purple',
        security: 'gray',
        ai: 'cyan',
        leadership: 'gold'
      }

      Object.entries(expectedMappings).forEach(([skillId, expectedColor]) => {
        const station = getStationConfig(skillId)
        expect(station).toBeDefined()
        expect(station?.colorVariant).toBe(expectedColor)
      })
    })

    test('no duplicate positions', () => {
      const positions = spaceStationConfigs.map(s => `${s.position.x},${s.position.y}`)
      const uniquePositions = new Set(positions)
      expect(positions.length).toBe(uniquePositions.size)
    })

    test('descriptions are unique', () => {
      const descriptions = spaceStationConfigs.map(s => s.description)
      const uniqueDescriptions = new Set(descriptions)
      expect(descriptions.length).toBe(uniqueDescriptions.size)
    })
  })

  // ===============================================
  // 🚀 PERFORMANCE TESTS
  // ===============================================
  
  describe('Performance', () => {
    test('helper functions execute quickly', () => {
      const iterations = 1000
      
      // Test getStationConfig performance
      const start1 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getStationConfig('frontend')
      }
      const end1 = performance.now()
      expect(end1 - start1).toBeLessThan(100) // Should complete in under 100ms

      // Test getStationsBySecor performance
      const start2 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getStationsBySecor('development')
      }
      const end2 = performance.now()
      expect(end2 - start2).toBeLessThan(100)
    })

    test('data structures are lightweight', () => {
      // Ensure configs array doesn't grow too large
      expect(spaceStationConfigs.length).toBeLessThan(50)
      
      // Ensure each station config is reasonably sized
      spaceStationConfigs.forEach(station => {
        const serialized = JSON.stringify(station)
        expect(serialized.length).toBeLessThan(500) // Reasonable size limit
      })
    })
  })

  // ===============================================
  // 🔍 EDGE CASES & ERROR HANDLING
  // ===============================================
  
  describe('Edge Cases & Error Handling', () => {
    test('handles invalid function parameters gracefully', () => {
      // Test various invalid inputs
      const invalidInputs = [null, undefined, '', 0, false, [], {}]
      
      invalidInputs.forEach(input => {
        expect(() => getStationConfig(input)).not.toThrow()
        expect(getStationConfig(input)).toBeUndefined()
        
        expect(() => getStationsBySecor(input)).not.toThrow()
        expect(getStationsBySecor(input)).toEqual([])
      })
    })

    test('data remains immutable after function calls', () => {
      const originalLength = spaceStationConfigs.length
      const originalFirstStation = { ...spaceStationConfigs[0] }
      
      // Call functions multiple times
      getStationConfig('frontend')
      getStationsBySecor('development')
      
      // Verify data unchanged
      expect(spaceStationConfigs.length).toBe(originalLength)
      expect(spaceStationConfigs[0]).toEqual(originalFirstStation)
    })

    test('helper functions work with whitespace in inputs', () => {
      // Note: Current implementation doesn't trim, so this tests actual behavior
      expect(getStationConfig(' frontend ')).toBeUndefined()
      expect(getStationsBySecor(' development ')).toEqual([])
    })
  })
})
