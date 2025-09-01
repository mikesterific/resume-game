# System Patterns - Resume Game

## Architecture Patterns

### Hybrid Game-Web Architecture
- **Game Layer**: Phaser.js canvas for 2D world and character interactions
- **3D Museum Layer**: Three.js WebGL for immersive 3D portfolio gallery
- **UI Layer**: Vue 3 components for modals, forms, and traditional elements
- **Data Layer**: JSON configuration for portfolio content and game world data
- **Asset Layer**: Optimized sprite sheets, tilesets, PBR textures, and media files

### Component Structure
```
Portfolio Quest/
├── Game Engine (Phaser.js)
│   ├── Scene Management (different game areas)
│   ├── Character Controller
│   ├── Interaction System
│   └── Animation Engine
├── 3D Museum Engine (Three.js)
│   ├── Circular Gallery Architecture
│   ├── First-Person Controls (PointerLockControls)
│   ├── PBR Material System
│   ├── Professional Gallery Lighting
│   └── Interactive Portfolio Frames
├── UI Framework (Vue 3)
│   ├── Modal Components (project details)
│   ├── Navigation Components
│   └── Traditional Portfolio Views
└── Data Management
    ├── Portfolio JSON data
    ├── Game Configuration
    ├── Professional Texture Assets
    └── Asset Manifests
```

## Design Patterns

### Game Design Patterns
- **State Pattern**: Game scenes (Skill Village, Project Forest, Résumé Tower)
- **Observer Pattern**: User interactions triggering UI updates
- **Factory Pattern**: Dynamic creation of interactive game objects
- **Command Pattern**: User input handling and game actions
- **Functional Factory Pattern**: Pure creation functions for game entities
- **Shared Utility Pattern**: Reusable functions across multiple scenes

### 3D Museum Design Patterns
- **Circular Architecture Pattern**: Radial layout for optimal portfolio viewing
- **Professional Gallery Lighting**: Ambient + spotlights for artwork illumination
- **PBR Material System**: Physically Based Rendering for realistic surfaces
- **Modular Asset Loading**: Professional textures from established libraries
- **First-Person Interaction**: PointerLockControls for immersive navigation
- **Event-Driven Modals**: Vue emit system for portfolio piece interactions

### Web Design Patterns
- **Composition API**: Vue 3's modern approach for component logic
- **MVVM Pattern**: Vue's reactive data binding and component architecture
- **Responsive Design**: Mobile-first with HDMI optimization
- **Progressive Enhancement**: Core content accessible without game features

## Development Patterns

### Asset Organization
- **Sprite Atlases**: Efficient texture packing for game performance
- **Modular Assets**: Reusable tilesets and sprite components
- **Lazy Loading**: On-demand asset loading for better performance
- **Content Strategy**: JSON-driven content for easy updates

### Code Organization
- **Scene-Based Architecture**: Separate files for each game area
- **Component-Based UI**: Reusable Vue 3 components with Composition API
- **Event-Driven Communication**: Clean separation between game and UI layers
- **Configuration-Driven**: JSON files for game world and portfolio data
- **Functional Scene Architecture**: Pure functions and factory patterns within Phaser classes

### Functional Programming Patterns (NEW)
- **Pure Functions**: Data generation and calculations without side effects
- **Factory Functions**: Reusable object creation for game entities
- **State Management**: Centralized state interfaces for scene management
- **Shared Utilities**: Common functions across scenes (distance, movement, proximity)
- **Immutable Data Structures**: Read-only configuration and game data
- **Functional Composition**: Building complex behaviors from simple functions

#### Implemented Functional Utilities
```typescript
// Shared across all scenes
calculateDistance(obj1, obj2) → number
findNearestObject(player, objects, maxDistance) → GameObject | null
updatePlayerVelocity(playerBody, cursors, keyboard, speed) → void
createPlayer(scene, x, y) → Phaser.GameObjects.Rectangle

// Scene-specific factories
createSkillNPC(scene, skill, onInteract) → Container
createResumeBook(scene, element, onInteract) → Container  
createProjectChest(scene, project, onInteract) → Container
createPortal(scene, portalData, onActivate) → Container
```

## Technology Stack

### Frontend
- **Game Engine**: Phaser.js 3.x
- **UI Framework**: Vue 3 with Composition API
- **Build Tool**: Vite (optimized for Vue)
- **Animation**: GSAP, Phaser animations
- **Styling**: CSS3, SCSS/SASS (with Vite support)

### Development Tools
- **Art**: Aseprite, Pixel Studio, or free alternatives
- **Design**: Figma for UI mockups
- **Version Control**: Git with GitHub/GitLab
- **Testing**: Vitest (Vite's testing framework), Cypress for E2E testing

### Deployment
- **Hosting**: Netlify, Vercel, or GitHub Pages
- **CDN**: Built-in CDN from hosting provider
- **Domain**: Professional domain registration
- **Analytics**: Google Analytics or similar

### Asset Pipeline
- **Images**: WebP with PNG fallbacks
- **Audio**: MP3/OGG with toggle controls
- **Optimization**: Image compression, code minification
- **Caching**: Service worker for offline functionality

---

### Debugging and Validation Patterns (NEW)
- **Phaser Group iteration semantics**: Returning `false` from `Group.children.each` stops iteration after the first item. Return `null` (or no boolean) to process all children. Use this to avoid partial updates in per-tick loops.
- **In-scene instrumentation**: Add lightweight labels and periodic JSON snapshots to verify state across many entities simultaneously. Example: show shield HP above stations and log an array of all shield states once per second.
- **Visibility of regeneration**: Regeneration logic only manifests after damage and a cooldown. For testing, apply a one-time `-1 HP` across entities or provide a debug toggle to force visibility.
- **Lifecycle reactivation**: When an entity is “destroyed” (hidden/disabled) and later regens, re-enable both visibility and physics bodies to restore interactions.
- **Config unification for isolation**: Temporarily unify per-entity configs to remove variables during debugging; restore differentiated configs after validation.

---

### QA & Testing Rituals (NEW)
- **Run tests at task completion**: After finishing any task, run the full test suite before marking it complete.
  - Command: `npm test`
  - Prefer running the full suite (not just a subset) to satisfy coverage thresholds configured for scenes.
- **Vue + Phaser testing guideline**: For Vue components that integrate Phaser, mount using `@vue/test-utils` and rely on the Phaser mock to avoid starting a real game loop.
- **If thresholds fail**: Add or adjust tests until Jest coverage thresholds pass for files with explicit gates (e.g., scenes in `jest.config.cjs`).

---

### Canvas Positioning Architecture (NEW)
The Phaser canvas positioning follows a precise hierarchy for full-viewport game experience with overlay modals:

#### DOM Structure & Flow
```text
#app (fills viewport)
└─ .game-container (fills viewport; relative; overflow:hidden; background)
   ├─ #game-container.game-canvas (fills .game-container; Phaser parent)
   │  └─ <canvas> (injected by Phaser; scaled+centered via FIT + CENTER_BOTH)
   └─ [Vue modals] (fixed; z-index:1000; overlay above canvas)
```

#### Phaser Canvas Injection
- **Parent Target**: Phaser mounts canvas into `parent: 'game-container'` (GameConfig.ts)
- **Base Dimensions**: `width: 1920, height: 1080` for HDMI optimization
- **Scale Mode**: `Phaser.Scale.FIT` maintains aspect ratio while fitting parent
- **Centering**: `autoCenter: Phaser.Scale.CENTER_BOTH` centers canvas within parent
- **Size Constraints**: `min: 800×600, max: 3840×2160` for responsive bounds

#### Container Hierarchy
- **`.game-container`**: Outer wrapper (100vw×100vh, relative positioning, overflow:hidden)
- **`#game-container.game-canvas`**: Phaser parent div (100% of wrapper, direct child)
- **Canvas Element**: Injected by Phaser, scaled/centered within parent div

## 3D Museum Implementation Lessons

### Technical Architecture Decisions

#### Three.js Integration with Vue 3
- **Component Structure**: SpaceMuseum.vue as standalone Three.js component
- **Lifecycle Management**: onMounted/onUnmounted for proper cleanup
- **State Management**: Reactive refs for UI state, internal object for 3D state
- **Event System**: Vue emit events for portfolio interactions (independent from Phaser)

#### Asset Management Strategy
- **Professional Texture Sources**: AmbientCG and Polyhaven for high-quality PBR materials
- **Asset Organization**: `/public/textures/{floor,ceiling,walls}/` structure
- **Texture Loading**: THREE.TextureLoader with proper wrapping and repeat settings
- **Performance Optimization**: 1K textures for web performance vs 4K for quality

#### Circular Museum Architecture
```javascript
// Key architectural decisions:
const radius = 30              // Museum size for comfortable navigation
const wallHeight = 12          // Human-scale proportions
const wallThickness = 0.5      // Realistic wall depth
const frameSpacing = automatic // Even distribution around circle
```

### Material System Lessons

#### PBR Material Implementation
- **MeshStandardMaterial**: Better than MeshLambertMaterial for realistic lighting
- **Texture Mapping**: Proper UV wrapping with RepeatWrapping for seamless tiling
- **Professional Lighting**: Ambient (0.6) + Point lights (2.0 intensity) for gallery feel

#### Lighting Best Practices
- **Gallery Lighting Pattern**: Central illumination + perimeter lights + accent spotlights
- **Shadow Configuration**: 2048x2048 shadow maps for quality vs performance balance
- **Color Temperature**: White light (0xffffff) for accurate portfolio color representation

### Interaction System Patterns

#### First-Person Controls
- **PointerLockControls**: Industry standard for FPS navigation in Three.js
- **Movement Physics**: Velocity-based movement with friction for natural feel
- **Modal Integration**: Release pointer lock when opening portfolio modals

#### Event-Driven Architecture
```javascript
// Clean separation between 3D engine and Vue UI:
emit('project-selected', { projectId })  // To parent component
emit('exit-museum')                      // For navigation
```

### Asset Acquisition Strategy

#### Professional Asset Sources
1. **Clone Reference Projects**: Extract working assets from established galleries
2. **Professional Libraries**: AmbientCG (free registration) and Polyhaven (free)
3. **Fallback Strategy**: Generate procedural textures if downloads fail
4. **Version Control**: Handle Git LFS issues with large texture files

#### File Organization Lessons
```
public/textures/
├── floor/diffuse.jpg     (Wood texture - most visible impact)
├── ceiling/diffuse.jpg   (Office ceiling - professional feel)
└── walls/diffuse.jpg     (Wall texture - gallery atmosphere)
```

### Performance Optimization Patterns

#### Texture Optimization
- **Resolution Strategy**: Start with 1K, upgrade to 2K only if needed
- **Format Choice**: JPG for diffuse maps, PNG for normal/alpha maps
- **Compression**: Balance quality vs loading time for web delivery

#### Rendering Optimization
- **Geometry Efficiency**: 64 segments for smooth circles without excess polygons
- **Material Sharing**: Reuse materials where possible to reduce draw calls
- **Shadow Optimization**: Selective shadow casting for performance

### Integration Patterns

#### Vue + Three.js Best Practices
- **Component Isolation**: Keep Three.js logic contained within Vue component
- **Cleanup Management**: Proper disposal of Three.js resources on component unmount
- **State Synchronization**: Use Vue reactive refs for UI state, internal objects for 3D state
- **Modal Coordination**: Prevent 3D interactions when Vue modals are open

#### Multi-Engine Architecture
- **Independent Systems**: Phaser game and Three.js museum as separate experiences
- **Shared Assets**: Reuse portfolio data across both engines
- **Routing Strategy**: Vue Router for navigation between 2D game and 3D museum
- **Event Isolation**: Separate event systems prevent cross-contamination
- **Global CSS**: `html,body` at 100% height, `overflow:hidden` prevents scrollbars

#### Visual Positioning Results
- Canvas scales to fit viewport while preserving 16:9 aspect ratio
- Letterboxing space (if any) remains inside `.game-container`
- Vue modals overlay with `position:fixed` and `z-index:1000`
- Touch interaction prevented on canvas via `touch-action:none`

#### Common Adjustments
- **Remove letterboxing**: Change to `Phaser.Scale.RESIZE` (stretches aspect)
- **Top-left anchor**: Set `autoCenter: Phaser.Scale.NO_CENTER`
- **Limit max scaling**: Adjust `scale.max` for pixel density control

---

*Part of Memory Bank System*