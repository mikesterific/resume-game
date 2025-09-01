# Technical Context - Portfolio Quest

## Development Environment

### Node.js Version Requirement
- **Required**: Node.js v20+ (for Vite compatibility)
- **Issue**: Node.js v18 causes `crypto.hash is not a function` error with Vite
- **Solution**: Use nvm to switch to Node v20

```bash
# Switch to Node.js v20 (if available)
nvm use 20.19.1

# Or install and use latest v20 if not available
nvm install 20
nvm use 20

# Set as default (optional)
nvm alias default 20
```

### Development Server
```bash
# After switching to Node v20
npm run dev
```

## Core Technologies

### 3D Graphics Engine
- **Three.js**: WebGL-based 3D graphics library for the space museum
  - **Version**: Latest (installed via npm)
  - **Features**: PBR materials, shadow mapping, first-person controls
  - **Integration**: Standalone Vue component with proper lifecycle management
  - **Performance**: Optimized for web with 1K textures and efficient geometry

### Frontend Framework
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for build tooling and dev server

### Game Engine
- **Phaser.js 3** for interactive portfolio game
- **Hybrid Architecture**: Vue 3 + Phaser integration
- **Event Bridge**: Communication between Vue and Phaser

### Asset Management
- **Space Station Sprites**: CSS Sprite Maps from source images
  - `Five Intricate Space Stations in Orbit.png` (1024x1024)
  - `More Space Stations.png` (1536x1024)
- **Color Tinting**: Dynamic skill-based coloring
- **Performance**: 80x80px sprites, 60 FPS target

### Space Station Sprite System
- **Sprite Maps**: Extract regions from source images using coordinates
- **Color Variants**: 8 skill-specific color tints
- **Render Textures**: Dynamic sprite generation and tinting
- **Fallback System**: Geometric shapes if sprites fail to load

## Known Issues & Solutions

### Node.js v18 Compatibility
**Problem**: `TypeError: crypto.hash is not a function`
**Solution**: `nvm use 20.19.1` before running dev server

### Vite Cache Issues
**Problem**: Stale cache causing build errors
**Solution**: `rm -rf node_modules/.vite`

### Asset Loading
**Problem**: Large image files affecting performance
**Solution**: Sprite maps with region cropping

## Performance Optimizations
- Sprite maps vs individual files (reduces HTTP requests)
- 80x80px target size for consistent rendering
- Color tinting instead of multiple asset variants
- Render textures for dynamic sprite generation

## Input Mapping (Game)
- `WASD`/Arrow keys: movement
- `D`: Dock/undock/interact (replaces former SPACE behavior)
- `SPACE`: Fire lasers; holding creates a short-interval repeat until released

## Laser System
- Player lasers: procedural `laser-beam` texture (cyan), dual emitters near wing roots; velocity along forward vector.
- Enemy lasers: procedural `enemy-laser` texture (red), single emitter at nose, velocity straight along enemy facing (uses sprite rotation).
- Procedural texture `laser-beam` (6x28) with additive blend
- Dual emitters offset near wing roots; aligned to player rotation (forward vector)
- Lifetime cleanup (~2.5s) to prevent buildup
- Repeat interval currently 140ms; speed ~800px/s (tunable)

## Phaser 3 Collision Detection System

### Physics Systems Overview
Phaser 3 provides two main physics engines with different collision approaches:

#### Arcade Physics (Simple & Fast)
- **AABB (Axis-Aligned Bounding Box)** collision detection
- Performance-oriented for simple games
- Rectangle-based collision boundaries
- Suitable for platformers and simple space games

#### Matter Physics (Complex & Realistic)
- **Polygon-based collision detection** using Matter.js
- More realistic physics simulation
- Supports complex shapes and realistic physics
- Higher computational cost

### Collision vs Overlap Detection

**Collision**: Bodies physically separate when they touch (solid objects)
```javascript
// Bodies will separate on contact
this.physics.add.collider(player, platforms);
```

**Overlap**: Bodies can pass through each other, but events are triggered (sensors/triggers)
```javascript
// Bodies can pass through, but callback is triggered
this.physics.add.overlap(player, collectibles, collectItem);
```

### Collision Detection Process

1. **Broad Phase**: Quick spatial checks (grid/quadtree) to eliminate impossible collisions
2. **Narrow Phase**: Detailed collision math for potential collisions
3. **Collision Response**: Calculate separation, apply impulses, update positions

### Body Types & Properties

**Dynamic Bodies**: Can move and be affected by collisions
```javascript
player.body.setCollideWorldBounds(true);
player.body.setBounce(0.2); // 20% velocity bounce
```

**Static Bodies**: Cannot move but can be collided with
```javascript
platform.body.setImmovable(true);
```

### Collision Callbacks & Events

**Process Callback (Pre-collision)**:
```javascript
function processCallback(obj1, obj2) {
    // Return true to allow collision, false to prevent
    if (obj1.invulnerable) return false;
    return true;
}
```

**Collide Callback (Post-collision)**:
```javascript
function collideCallback(obj1, obj2) {
    // Handle collision effects after separation
    obj1.takeDamage();
    obj2.destroy();
}
```

### Advanced Collision Features

**Collision Categories** (Matter Physics):
```javascript
const PLAYER_CATEGORY = 0x0001;
const ENEMY_CATEGORY = 0x0002;
const PROJECTILE_CATEGORY = 0x0004;

player.setCollisionCategory(PLAYER_CATEGORY);
player.setCollidesWith([ENEMY_CATEGORY, WALL_CATEGORY]);
```

**World Boundaries**:
```javascript
world.checkCollision = {
    up: true,
    down: true,
    left: true,
    right: true
};
```

### Performance Optimization Rules

1. **Group Similar Objects**: Use physics groups for efficient collision checking
```javascript
const enemies = this.physics.add.group();
const bullets = this.physics.add.group();
this.physics.add.collider(bullets, enemies);
```

2. **Static vs Dynamic**: Use static bodies for immovable objects
3. **Collision Layers**: Organize collision detection by game logic layers
4. **Mass-based Separation**: Heavier objects move less during collisions

### Common Game Collision Patterns

**Space Game Pattern**:
```javascript
// Player vs boundaries
this.physics.add.collider(player, worldBounds);

// Player lasers vs enemies (destroy on hit)
this.physics.add.overlap(playerLasers, enemies, destroyEnemy);

// Player vs enemy lasers (damage/health system)
this.physics.add.overlap(player, enemyLasers, playerHit);

// Player vs enemies (collision damage)
this.physics.add.collider(player, enemies, playerCollision);
```

### Collision Resolution Properties

**Bounce & Friction**:
```javascript
body.setBounce(0.8);     // Energy retained after collision
body.setFriction(0.1);   // Movement resistance
```

**Mass & Velocity Transfer**:
```javascript
body.setMass(2);         // Affects collision response
// Collision affects both bodies based on mass, bounce, and impact angle
```

### Event System Integration

**Global Physics Events**:
```javascript
this.physics.world.on('collide', (event, bodyA, bodyB) => {
    // Handle any collision in the world
});
```

**Body-specific Events**:
```javascript
player.body.onCollide = true;
player.body.on('collide', (collision) => {
    // Handle collisions for specific body
});
```

This collision system enables complex game interactions while maintaining performance through spatial partitioning and optimized algorithms. The choice between Arcade and Matter physics depends on the complexity requirements of the game mechanics.