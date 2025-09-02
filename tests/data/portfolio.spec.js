const { 
  portfolioData, 
  getProjectById, 
  getSkillById, 
  getProjectsByType, 
  getSkillsByCategory 
} = require('@/data/portfolio')

describe('Portfolio Data Module', () => {
  // ===============================================
  // 📊 PORTFOLIO DATA STRUCTURE TESTS
  // ===============================================
  
  describe('Portfolio Data Structure', () => {
    test('has required top-level properties', () => {
      expect(portfolioData).toHaveProperty('projects')
      expect(portfolioData).toHaveProperty('skills')
      expect(portfolioData).toHaveProperty('resume')
    })

    test('projects is an array', () => {
      expect(Array.isArray(portfolioData.projects)).toBe(true)
      expect(portfolioData.projects.length).toBeGreaterThan(0)
    })

    test('skills is an array', () => {
      expect(Array.isArray(portfolioData.skills)).toBe(true)
      expect(portfolioData.skills.length).toBeGreaterThan(0)
    })

    test('resume is an object', () => {
      expect(typeof portfolioData.resume).toBe('object')
      expect(portfolioData.resume).not.toBeNull()
    })
  })

  // ===============================================
  // 🎯 PROJECT DATA VALIDATION TESTS
  // ===============================================
  
  describe('Projects Data Validation', () => {
    test('all projects have required properties', () => {
      portfolioData.projects.forEach((project, index) => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('description')
        expect(project).toHaveProperty('technologies')
        expect(project).toHaveProperty('type')
        
        // Verify they are not null/undefined
        expect(project.id).toBeDefined()
        expect(project.title).toBeDefined()
        expect(project.description).toBeDefined()
        expect(project.technologies).toBeDefined()
        expect(project.type).toBeDefined()
      })
    })

    test('project IDs are unique', () => {
      const ids = portfolioData.projects.map(project => project.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    test('project titles are non-empty strings', () => {
      portfolioData.projects.forEach((project, index) => {
        expect(typeof project.title).toBe('string', `Project ${index} title should be string`)
        expect(project.title.trim().length).toBeGreaterThan(0, `Project ${index} title should not be empty`)
      })
    })

    test('project descriptions are non-empty strings', () => {
      portfolioData.projects.forEach((project, index) => {
        expect(typeof project.description).toBe('string', `Project ${index} description should be string`)
        expect(project.description.trim().length).toBeGreaterThan(0, `Project ${index} description should not be empty`)
      })
    })

    test('project technologies are arrays', () => {
      portfolioData.projects.forEach((project, index) => {
        expect(Array.isArray(project.technologies)).toBe(true, `Project ${index} technologies should be array`)
        expect(project.technologies.length).toBeGreaterThan(0, `Project ${index} should have at least one technology`)
        project.technologies.forEach((tech, techIndex) => {
          expect(typeof tech).toBe('string', `Project ${index} technology ${techIndex} should be string`)
        })
      })
    })

    test('project types are valid', () => {
      const validTypes = ['game', 'web']
      portfolioData.projects.forEach((project, index) => {
        expect(validTypes).toContain(project.type, `Project ${index} has invalid type: ${project.type}`)
      })
    })

    test('projects have consistent structure', () => {
      portfolioData.projects.forEach((project, index) => {
        expect(typeof project.id).toBe('string', `Project ${index} id should be string`)
        if (project.demoUrl !== undefined) {
          expect(typeof project.demoUrl).toBe('string', `Project ${index} demoUrl should be string`)
        }
      })
    })

    test('specific project data integrity', () => {
      // Test a few specific projects to ensure data accuracy
      const portfolioQuest = portfolioData.projects.find(p => p.id === 'portfolio-quest')
      expect(portfolioQuest).toBeDefined()
      expect(portfolioQuest?.title).toBe('Portfolio Quest')
      expect(portfolioQuest?.type).toBe('game')
      expect(portfolioQuest?.technologies).toContain('Vue 3')
      expect(portfolioQuest?.demoUrl).toBe('#')

      const dellXPS = portfolioData.projects.find(p => p.id === 'dell-xps-poc')
      expect(dellXPS).toBeDefined()
      expect(dellXPS?.title).toBe('Dell XPS Proof of Concept')
      expect(dellXPS?.type).toBe('web')
      expect(dellXPS?.technologies).toContain('HTML5')
    })
  })

  // ===============================================
  // 🎮 SKILLS DATA VALIDATION TESTS
  // ===============================================
  
  describe('Skills Data Validation', () => {
    test('all skills have required properties', () => {
      portfolioData.skills.forEach((skill, index) => {
        expect(skill).toHaveProperty('id')
        expect(skill).toHaveProperty('name')
        expect(skill).toHaveProperty('category')
        expect(skill).toHaveProperty('level')
        expect(skill).toHaveProperty('icon')
        expect(skill).toHaveProperty('description')
        
        // Verify they are not null/undefined
        expect(skill.id).toBeDefined()
        expect(skill.name).toBeDefined()
        expect(skill.category).toBeDefined()
        expect(skill.level).toBeDefined()
        expect(skill.icon).toBeDefined()
        expect(skill.description).toBeDefined()
      })
    })

    test('skill IDs are unique', () => {
      const ids = portfolioData.skills.map(skill => skill.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    test('skill names are non-empty strings', () => {
      portfolioData.skills.forEach((skill, index) => {
        expect(typeof skill.name).toBe('string', `Skill ${index} name should be string`)
        expect(skill.name.trim().length).toBeGreaterThan(0, `Skill ${index} name should not be empty`)
      })
    })

    test('skill categories are valid', () => {
      const validCategories = ['frontend', 'testing', 'architecture', 'tooling', 'ai', 'security', 'leadership']
      portfolioData.skills.forEach((skill, index) => {
        expect(validCategories).toContain(skill.category, `Skill ${index} has invalid category: ${skill.category}`)
      })
    })

    test('skill levels are valid numbers', () => {
      portfolioData.skills.forEach((skill, index) => {
        expect(typeof skill.level).toBe('number', `Skill ${index} level should be number`)
        expect(skill.level).toBeGreaterThanOrEqual(1, `Skill ${index} level should be >= 1`)
        expect(skill.level).toBeLessThanOrEqual(5, `Skill ${index} level should be <= 5`)
        expect(Number.isInteger(skill.level)).toBe(true, `Skill ${index} level should be integer`)
      })
    })

    test('skill icons are non-empty strings', () => {
      portfolioData.skills.forEach((skill, index) => {
        expect(typeof skill.icon).toBe('string', `Skill ${index} icon should be string`)
        expect(skill.icon.trim().length).toBeGreaterThan(0, `Skill ${index} icon should not be empty`)
      })
    })

    test('skill descriptions are non-empty strings', () => {
      portfolioData.skills.forEach((skill, index) => {
        expect(typeof skill.description).toBe('string', `Skill ${index} description should be string`)
        expect(skill.description.trim().length).toBeGreaterThan(0, `Skill ${index} description should not be empty`)
      })
    })

    test('specific skill data integrity', () => {
      // Test specific skills to ensure data accuracy
      const frontend = portfolioData.skills.find(s => s.id === 'frontend')
      expect(frontend).toBeDefined()
      expect(frontend?.name).toBe('Front-End Expert (20+ Years)')
      expect(frontend?.category).toBe('frontend')
      expect(frontend?.level).toBe(5)
      expect(frontend?.icon).toBe('👨‍💻')

      const testing = portfolioData.skills.find(s => s.id === 'testing')
      expect(testing).toBeDefined()
      expect(testing?.name).toBe('Testing Aficionado')
      expect(testing?.category).toBe('testing')
      expect(testing?.level).toBe(5)
      expect(testing?.icon).toBe('🧪')
    })
  })

  // ===============================================
  // 📄 RESUME DATA VALIDATION TESTS
  // ===============================================
  
  describe('Resume Data Validation', () => {
    test('has required top-level properties', () => {
      expect(portfolioData.resume).toHaveProperty('name')
      expect(portfolioData.resume).toHaveProperty('title')
      expect(portfolioData.resume).toHaveProperty('email')
      expect(portfolioData.resume).toHaveProperty('summary')
      expect(portfolioData.resume).toHaveProperty('experience')
      expect(portfolioData.resume).toHaveProperty('education')
      expect(portfolioData.resume).toHaveProperty('skills')
    })

    test('basic resume fields are correct types', () => {
      expect(typeof portfolioData.resume.name).toBe('string')
      expect(typeof portfolioData.resume.title).toBe('string')
      expect(typeof portfolioData.resume.summary).toBe('string')
      expect(Array.isArray(portfolioData.resume.experience)).toBe(true)
      expect(Array.isArray(portfolioData.resume.education)).toBe(true)
      expect(Array.isArray(portfolioData.resume.skills)).toBe(true)
    })

    test('resume name and title are non-empty', () => {
      expect(portfolioData.resume.name.trim().length).toBeGreaterThan(0)
      expect(portfolioData.resume.title.trim().length).toBeGreaterThan(0)
      expect(portfolioData.resume.summary.trim().length).toBeGreaterThan(0)
    })

    test('specific resume data integrity', () => {
      expect(portfolioData.resume.name).toBe('Michael Garrett Jones')
      expect(portfolioData.resume.title).toBe('Principal UI Architect / Technical Lead (Vue)')
      expect(portfolioData.resume.email).toBe('')
    })

    test('all experience entries have required properties', () => {
      portfolioData.resume.experience.forEach((exp, index) => {
        expect(exp).toHaveProperty('id')
        expect(exp).toHaveProperty('company')
        expect(exp).toHaveProperty('position')
        expect(exp).toHaveProperty('startDate')
        expect(exp).toHaveProperty('description')
        expect(exp).toHaveProperty('technologies')
        
        // Verify they are not null/undefined
        expect(exp.id).toBeDefined()
        expect(exp.company).toBeDefined()
        expect(exp.position).toBeDefined()
        expect(exp.startDate).toBeDefined()
        expect(exp.description).toBeDefined()
        expect(exp.technologies).toBeDefined()
      })
    })

    test('experience IDs are unique', () => {
      const ids = portfolioData.resume.experience.map(exp => exp.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    test('experience dates follow correct format', () => {
      const datePattern = /^\d{4}-\d{2}$/
      portfolioData.resume.experience.forEach((exp, index) => {
        expect(datePattern.test(exp.startDate)).toBe(true, `Experience ${index} startDate format invalid: ${exp.startDate}`)
        if (exp.endDate) {
          expect(datePattern.test(exp.endDate)).toBe(true, `Experience ${index} endDate format invalid: ${exp.endDate}`)
        }
      })
    })

    test('experience technologies are arrays', () => {
      portfolioData.resume.experience.forEach((exp, index) => {
        expect(Array.isArray(exp.technologies)).toBe(true, `Experience ${index} technologies should be array`)
        expect(exp.technologies.length).toBeGreaterThan(0, `Experience ${index} should have technologies`)
        exp.technologies.forEach((tech, techIndex) => {
          expect(typeof tech).toBe('string', `Experience ${index} technology ${techIndex} should be string`)
        })
      })
    })

    test('specific experience data integrity', () => {
      const scaleComputing = portfolioData.resume.experience.find(exp => exp.id === 'scale-computing')
      expect(scaleComputing).toBeDefined()
      expect(scaleComputing?.company).toBe('Scale Computing')
      expect(scaleComputing?.position).toBe('Principal UI Architect / Technical Lead (Vue)')
      expect(scaleComputing?.startDate).toBe('2021-01')
      expect(scaleComputing?.technologies).toContain('Vue 3')

      const dell = portfolioData.resume.experience.find(exp => exp.id === 'dell-technologies')
      expect(dell).toBeDefined()
      expect(dell?.company).toBe('Dell Technologies')
      expect(dell?.endDate).toBe('2020-07')
    })
  })

  // ===============================================
  // 🔍 HELPER FUNCTION TESTS
  // ===============================================
  
  describe('Helper Functions', () => {
    describe('getProjectById', () => {
      test('returns correct project for valid ID', () => {
        const project = getProjectById('portfolio-quest')
        expect(project).toBeDefined()
        expect(project?.id).toBe('portfolio-quest')
        expect(project?.title).toBe('Portfolio Quest')
      })

      test('returns undefined for non-existent ID', () => {
        const project = getProjectById('non-existent-project')
        expect(project).toBeUndefined()
      })

      test('returns undefined for empty string', () => {
        const project = getProjectById('')
        expect(project).toBeUndefined()
      })

      test('returns undefined for null/undefined input', () => {
        expect(getProjectById(null)).toBeUndefined()
        expect(getProjectById(undefined)).toBeUndefined()
      })

      test('is case sensitive', () => {
        const project1 = getProjectById('portfolio-quest')
        const project2 = getProjectById('PORTFOLIO-QUEST')
        const project3 = getProjectById('Portfolio-Quest')
        
        expect(project1).toBeDefined()
        expect(project2).toBeUndefined()
        expect(project3).toBeUndefined()
      })

      test('works for all existing project IDs', () => {
        portfolioData.projects.forEach(project => {
          const found = getProjectById(project.id)
          expect(found).toBeDefined()
          expect(found?.id).toBe(project.id)
        })
      })
    })

    describe('getSkillById', () => {
      test('returns correct skill for valid ID', () => {
        const skill = getSkillById('frontend')
        expect(skill).toBeDefined()
        expect(skill?.id).toBe('frontend')
        expect(skill?.name).toBe('Front-End Expert (20+ Years)')
      })

      test('returns undefined for non-existent ID', () => {
        const skill = getSkillById('non-existent-skill')
        expect(skill).toBeUndefined()
      })

      test('returns undefined for empty string', () => {
        const skill = getSkillById('')
        expect(skill).toBeUndefined()
      })

      test('returns undefined for null/undefined input', () => {
        expect(getSkillById(null)).toBeUndefined()
        expect(getSkillById(undefined)).toBeUndefined()
      })

      test('is case sensitive', () => {
        const skill1 = getSkillById('frontend')
        const skill2 = getSkillById('FRONTEND')
        const skill3 = getSkillById('Frontend')
        
        expect(skill1).toBeDefined()
        expect(skill2).toBeUndefined()
        expect(skill3).toBeUndefined()
      })

      test('works for all existing skill IDs', () => {
        portfolioData.skills.forEach(skill => {
          const found = getSkillById(skill.id)
          expect(found).toBeDefined()
          expect(found?.id).toBe(skill.id)
        })
      })
    })

    describe('getProjectsByType', () => {
      test('returns game projects correctly', () => {
        const gameProjects = getProjectsByType('game')
        expect(Array.isArray(gameProjects)).toBe(true)
        expect(gameProjects.length).toBeGreaterThan(0)
        gameProjects.forEach(project => {
          expect(project.type).toBe('game')
        })
      })

      test('returns web projects correctly', () => {
        const webProjects = getProjectsByType('web')
        expect(Array.isArray(webProjects)).toBe(true)
        expect(webProjects.length).toBeGreaterThan(0)
        webProjects.forEach(project => {
          expect(project.type).toBe('web')
        })
      })

      test('returns empty array for non-existent type', () => {
        const projects = getProjectsByType('mobile')
        expect(Array.isArray(projects)).toBe(true)
        expect(projects.length).toBe(0)
      })

      test('game and web projects sum equals total projects', () => {
        const gameProjects = getProjectsByType('game')
        const webProjects = getProjectsByType('web')
        const totalFiltered = gameProjects.length + webProjects.length
        expect(totalFiltered).toBe(portfolioData.projects.length)
      })

      test('returns different arrays for different types', () => {
        const gameProjects = getProjectsByType('game')
        const webProjects = getProjectsByType('web')
        expect(gameProjects).not.toBe(webProjects)
        expect(gameProjects).not.toEqual(webProjects)
      })

      test('returns new array each time (not reference)', () => {
        const gameProjects1 = getProjectsByType('game')
        const gameProjects2 = getProjectsByType('game')
        expect(gameProjects1).not.toBe(gameProjects2)
        expect(gameProjects1).toEqual(gameProjects2)
      })
    })

    describe('getSkillsByCategory', () => {
      test('returns frontend skills correctly', () => {
        const frontendSkills = getSkillsByCategory('frontend')
        expect(Array.isArray(frontendSkills)).toBe(true)
        expect(frontendSkills.length).toBeGreaterThan(0)
        frontendSkills.forEach(skill => {
          expect(skill.category).toBe('frontend')
        })
      })

      test('returns testing skills correctly', () => {
        const testingSkills = getSkillsByCategory('testing')
        expect(Array.isArray(testingSkills)).toBe(true)
        expect(testingSkills.length).toBeGreaterThan(0)
        testingSkills.forEach(skill => {
          expect(skill.category).toBe('testing')
        })
      })

      test('returns architecture skills correctly', () => {
        const architectureSkills = getSkillsByCategory('architecture')
        expect(Array.isArray(architectureSkills)).toBe(true)
        architectureSkills.forEach(skill => {
          expect(skill.category).toBe('architecture')
        })
      })

      test('returns empty array for non-existent category', () => {
        const skills = getSkillsByCategory('non-existent')
        expect(Array.isArray(skills)).toBe(true)
        expect(skills.length).toBe(0)
      })

      test('all skill categories are represented', () => {
        const categories = ['frontend', 'testing', 'architecture', 'tooling', 'ai', 'security', 'leadership']
        const allCategorizedSkills = categories.reduce((total, category) => {
          return total + getSkillsByCategory(category).length
        }, 0)
        expect(allCategorizedSkills).toBe(portfolioData.skills.length)
      })

      test('returns new array each time (not reference)', () => {
        const frontendSkills1 = getSkillsByCategory('frontend')
        const frontendSkills2 = getSkillsByCategory('frontend')
        expect(frontendSkills1).not.toBe(frontendSkills2)
        expect(frontendSkills1).toEqual(frontendSkills2)
      })

      test('each category returns unique skills', () => {
        const categories = ['frontend', 'testing', 'architecture', 'tooling', 'ai', 'security', 'leadership']
        const allSkillIds = new Set()
        
        categories.forEach(category => {
          const skills = getSkillsByCategory(category)
          skills.forEach(skill => {
            expect(allSkillIds.has(skill.id)).toBe(false) // No duplicate IDs across categories
            allSkillIds.add(skill.id)
          })
        })
      })
    })
  })

  // ===============================================
  // 🧪 DATA CONSISTENCY TESTS
  // ===============================================
  
  describe('Data Consistency', () => {
    test('no duplicate IDs across all data', () => {
      const projectIds = portfolioData.projects.map(p => p.id)
      const skillIds = portfolioData.skills.map(s => s.id)
      const experienceIds = portfolioData.resume.experience.map(e => e.id)
      
      const allIds = [...projectIds, ...skillIds, ...experienceIds]
      const uniqueIds = new Set(allIds)
      
      expect(allIds.length).toBe(uniqueIds.size)
    })

    test('technology consistency across projects and experience', () => {
      // Collect all technologies from projects and experience
      const projectTechs = new Set()
      portfolioData.projects.forEach(project => {
        project.technologies.forEach(tech => projectTechs.add(tech))
      })

      const experienceTechs = new Set()
      portfolioData.resume.experience.forEach(exp => {
        exp.technologies.forEach(tech => experienceTechs.add(tech))
      })

      // Test that there's some overlap (common technologies)
      const commonTechs = [...projectTechs].filter(tech => experienceTechs.has(tech))
      expect(commonTechs.length).toBeGreaterThan(0)
    })

    test('skill levels are distributed reasonably', () => {
      const levelCounts = {}
      portfolioData.skills.forEach(skill => {
        levelCounts[skill.level] = (levelCounts[skill.level] || 0) + 1
      })

      // Should have skills at multiple levels
      expect(Object.keys(levelCounts).length).toBeGreaterThanOrEqual(2)
      
      // Level 5 skills should exist (expertise)
      expect(levelCounts[5]).toBeGreaterThan(0)
    })

    test('experience chronology makes sense', () => {
      const experienceWithDates = portfolioData.resume.experience
        .filter(exp => exp.endDate) // Only check completed experiences
        .map(exp => ({
          ...exp,
          start: new Date(exp.startDate + '-01'),
          end: new Date(exp.endDate + '-01')
        }))

      experienceWithDates.forEach(exp => {
        expect(exp.start.getTime()).toBeLessThan(exp.end.getTime())
      })
    })
  })

  // ===============================================
  // 🚀 PERFORMANCE TESTS
  // ===============================================
  
  describe('Performance', () => {
    test('helper functions execute quickly', () => {
      const iterations = 1000
      
      // Test getProjectById performance
      const start1 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getProjectById('portfolio-quest')
      }
      const end1 = performance.now()
      expect(end1 - start1).toBeLessThan(100) // Should complete in under 100ms

      // Test getSkillById performance
      const start2 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getSkillById('frontend')
      }
      const end2 = performance.now()
      expect(end2 - start2).toBeLessThan(100)

      // Test filtering functions performance
      const start3 = performance.now()
      for (let i = 0; i < iterations; i++) {
        getProjectsByType('web')
        getSkillsByCategory('frontend')
      }
      const end3 = performance.now()
      expect(end3 - start3).toBeLessThan(200)
    })
  })
})
