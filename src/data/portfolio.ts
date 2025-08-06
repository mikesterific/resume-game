import type { ProjectData, SkillData, ResumeData } from '@/types/game'

// Sample portfolio data - replace with your actual data
export const portfolioData = {
  projects: [
    {
      id: 'portfolio-quest',
      title: 'Portfolio Quest',
      description: 'An interactive, retro RPG-inspired portfolio website that showcases professional work through an engaging game experience. Built with Vue 3, Phaser.js, and TypeScript.',
      technologies: ['Vue 3', 'Phaser.js', 'TypeScript', 'Vite', 'CSS3'],
      type: 'game' as const,
      demoUrl: '#',
      githubUrl: 'https://github.com/yourusername/portfolio-quest'
    },
    {
      id: 'ecommerce-app',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution featuring product catalog, shopping cart, payment processing, and admin dashboard. Built with modern web technologies.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
      type: 'web' as const,
      demoUrl: 'https://demo-ecommerce.example.com',
      githubUrl: 'https://github.com/yourusername/ecommerce-platform'
    },
    {
      id: 'mobile-fitness',
      title: 'Fitness Tracker',
      description: 'A comprehensive fitness tracking mobile app with workout logging, progress analytics, social features, and integration with wearable devices.',
      technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
      type: 'mobile' as const,
      demoUrl: 'https://apps.apple.com/app/fitness-tracker',
      githubUrl: 'https://github.com/yourusername/fitness-tracker'
    },
    {
      id: 'data-viz',
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for visualizing complex datasets with real-time updates, customizable charts, and export capabilities.',
      technologies: ['Vue 3', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
      type: 'web' as const,
      demoUrl: 'https://dataviz-demo.example.com',
      githubUrl: 'https://github.com/yourusername/data-viz-dashboard'
    },
    {
      id: 'component-library',
      title: 'Vue Component Library',
      description: 'A comprehensive, reusable component library with robust testing, documentation, and design system integration.',
      technologies: ['Vue 3', 'TypeScript', 'Storybook', 'Vitest', 'SCSS'],
      type: 'library' as const,
      demoUrl: 'https://components.example.com',
      githubUrl: 'https://github.com/yourusername/vue-components'
    }
  ] as ProjectData[],

  skills: [
    {
      id: 'frontend',
      name: 'Front-End Expert (20+ Years)',
      category: 'frontend' as const,
      level: 5,
      icon: '👨‍💻',
      description: 'Deep mastery of Vue.js (including Vue 3, Options API, and Composition API), React.js, and Angular. Fluent in CSS3, HTML5, SASS/LESS, and TailwindCSS. Performance optimization expert - wrote Pro HTML5 Performance book and drove 30% performance boost at Dell.'
    },
    {
      id: 'testing',
      name: 'Testing Aficionado', 
      category: 'testing' as const,
      level: 5,
      icon: '🧪',
      description: 'Cypress ninja with expertise in config, isolation, retries, and CI stability. Jest, Mocha, Chai master. Writes full-coverage tests that are resilient, not just green.'
    },
    {
      id: 'architecture',
      name: 'State Management & Architecture',
      category: 'architecture' as const,
      level: 5,
      icon: '📦',
      description: 'Vuex wizard with pattern-oriented store design. Integrates Supabase, Socket.IO, and external APIs with store architecture. Designed large-scale apps at EA, Dell, RentPath, and Scale Computing.'
    },
    {
      id: 'tooling',
      name: 'Tooling & Build Systems',
      category: 'tooling' as const,
      level: 5,
      icon: '⚙️',
      description: 'Fluent with Vite, Webpack, npm, yarn, Babel, ESLint, and TypeScript. Expert in managing mono repos and custom component libraries.'
    },
    {
      id: 'ai',
      name: 'AI & RAG Engineering',
      category: 'ai' as const,
      level: 4,
      icon: '🧠',
      description: 'Developed custom RAG systems with similarity search and best-practices enrichment. Uses LLMs to generate, iterate, and refine test cases and documentation. AI-integration into dev workflow is deployed, not theoretical.'
    },
    {
      id: 'devops',
      name: 'DevOps & Networking',
      category: 'devops' as const,
      level: 4,
      icon: '📡',
      description: 'Knows networking from a dev perspective (CIDR, HomeKit security, Asus routers, VLANs). Fluent in Git, branching strategies, merge automation, and version hygiene.'
    },
    {
      id: 'security',
      name: 'Security & Accessibility',
      category: 'security' as const,
      level: 4,
      icon: '🔒',
      description: 'Linux Foundation certified in Secure Software Development (LFD121). Brings accessibility and security into early-stage design—not bolted on after.'
    },
    {
      id: 'leadership',
      name: 'Thought Leader & Author',
      category: 'leadership' as const,
      level: 5,
      icon: '🎤',
      description: 'Gave a Google Tech Talk on animating pseudo-elements. Published author of "Pro HTML5 Performance" by Apress. UI badass (tattoo verified).'
    }
  ] as SkillData[],

  resume: {
    name: 'Your Name',
    title: 'Full Stack Developer',
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://yourportfolio.com',
    summary: 'Passionate full-stack developer with expertise in modern web technologies, game development, and creating engaging user experiences. Dedicated to writing clean, maintainable code and delivering high-quality solutions.',
    
    experience: [
      {
        id: 'senior-dev',
        company: 'Tech Innovations Inc.',
        position: 'Senior Full Stack Developer',
        startDate: '2022-01',
        endDate: undefined,
        description: 'Lead development of large-scale web applications using Vue.js, Node.js, and cloud technologies. Mentor junior developers and drive technical architecture decisions.',
        technologies: ['Vue 3', 'Node.js', 'AWS', 'TypeScript', 'MongoDB']
      },
      {
        id: 'full-stack-dev',
        company: 'Digital Solutions LLC',
        position: 'Full Stack Developer',
        startDate: '2020-03',
        endDate: '2022-01',
        description: 'Developed and maintained multiple client projects, focusing on responsive web applications and mobile-first design principles.',
        technologies: ['React', 'Express.js', 'PostgreSQL', 'React Native']
      },
      {
        id: 'frontend-dev',
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        startDate: '2018-06',
        endDate: '2020-03',
        description: 'Built interactive user interfaces and implemented modern frontend frameworks in a fast-paced startup environment.',
        technologies: ['JavaScript', 'Vue.js', 'SCSS', 'Webpack']
      }
    ],
    
    education: [
      {
        id: 'cs-degree',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2014-09',
        endDate: '2018-05',
        gpa: '3.8'
      }
    ],
    
    skills: [
      // Reference the skills array above
    ]
  } as ResumeData
}

// Helper functions for data access
export function getProjectById(id: string): ProjectData | undefined {
  return portfolioData.projects.find(project => project.id === id)
}

export function getSkillById(id: string): SkillData | undefined {
  return portfolioData.skills.find(skill => skill.id === id)
}

export function getProjectsByType(type: ProjectData['type']): ProjectData[] {
  return portfolioData.projects.filter(project => project.type === type)
}

export function getSkillsByCategory(category: SkillData['category']): SkillData[] {
  return portfolioData.skills.filter(skill => skill.category === category)
}