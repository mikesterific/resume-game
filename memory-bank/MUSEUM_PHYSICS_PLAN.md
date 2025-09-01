# Space Museum Physics Enhancement Plan

## 🎯 **Objective**
Add realistic physics-based movement to the Space Museum, including adjustable gravity and jumping mechanics, creating a more immersive and playful experience.

## 🌍 **Physics System Overview**

### **Core Physics Parameters**
```typescript
interface PhysicsConfig {
  gravity: number           // Default: 9.8 m/s² (Earth), Target: 7.84 m/s² (0.8x Earth)
  jumpVelocity: number      // Initial upward velocity when jumping
  playerMass: number        // Player mass for physics calculations
  airResistance: number     // Air friction coefficient
  groundFriction: number    // Ground friction for movement
  maxVelocity: {
    x: number               // Max horizontal speed
    y: number               // Terminal velocity (falling)
    z: number               // Max forward/backward speed
  }
  collisionBounds: {
    radius: number          // Player collision radius
    height: number          // Player height for ceiling detection
  }
}
```

## 🚀 **Implementation Plan**

### **Phase 1: Basic Physics Foundation**

#### 1.1 Physics State Management
```typescript
interface PhysicsState {
  position: THREE.Vector3
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  isGrounded: boolean
  isJumping: boolean
  canJump: boolean
  timeInAir: number
  lastGroundY: number
}
```

#### 1.2 Gravity Implementation
- Apply constant downward acceleration based on gravity setting
- Update velocity: `velocity.y -= gravity * deltaTime`
- Update position: `position.y += velocity.y * deltaTime`
- Implement terminal velocity cap

#### 1.3 Ground Detection
- Raycast downward from player position
- Check distance to floor (y = 0 in current implementation)
- Set `isGrounded = true` when distance < threshold
- Reset vertical velocity when landing

### **Phase 2: Jump Mechanics**

#### 2.1 Jump Input Handling
```typescript
// Add to keyboard controls
case 'Space':
  if (state.physics.isGrounded && state.physics.canJump) {
    initiateJump()
  }
  break
```

#### 2.2 Jump Physics
```typescript
const initiateJump = () => {
  state.physics.velocity.y = calculateJumpVelocity(jumpHeight, gravity)
  state.physics.isJumping = true
  state.physics.canJump = false  // Prevent double jumping
  playJumpSound()  // Optional audio feedback
}

// Calculate initial velocity needed to reach desired height
const calculateJumpVelocity = (height: number, gravity: number): number => {
  return Math.sqrt(2 * gravity * height)
}
```

#### 2.3 Jump Variations
- **Normal Jump**: Standard height based on gravity
- **Running Jump**: Slightly higher when moving
- **Crouch Jump**: Higher jump from crouched position (spring effect)

### **Phase 3: Environmental Variations**

#### 3.1 Gravity Zones
```typescript
interface GravityZone {
  position: THREE.Vector3
  radius: number
  gravityMultiplier: number
  visualEffect?: 'shimmer' | 'distortion' | 'particles'
}

// Different museum areas with varying gravity
const gravityZones = [
  { name: 'Earth Normal', multiplier: 1.0 },
  { name: 'Lunar Gallery', multiplier: 0.165 },  // Moon gravity
  { name: 'Martian Wing', multiplier: 0.38 },    // Mars gravity
  { name: 'Space Station', multiplier: 0.8 },     // Your suggested 0.8x
  { name: 'Zero-G Chamber', multiplier: 0.05 }   // Near weightless
]
```

#### 3.2 Visual Indicators
- HUD display showing current gravity level
- Particle effects in low-gravity zones
- Footstep particles that float longer in low gravity
- Jump trail effects that vary with gravity

### **Phase 4: Advanced Movement**

#### 4.1 Momentum Conservation
```typescript
// Preserve horizontal momentum during jumps
const updateMovement = (delta: number) => {
  if (!state.physics.isGrounded) {
    // Air control (reduced)
    const airControl = 0.3
    velocity.x *= (1 - airResistance * delta)
    velocity.z *= (1 - airResistance * delta)
  } else {
    // Ground movement (full control)
    velocity.x *= (1 - groundFriction * delta)
    velocity.z *= (1 - groundFriction * delta)
  }
}
```

#### 4.2 Advanced Controls
- **Double Jump**: Unlock in certain areas
- **Wall Jump**: Push off walls in low gravity
- **Glide**: Hold jump to slow descent in low gravity
- **Crouch**: Duck under obstacles, prepare for higher jumps

### **Phase 5: Collision System**

#### 5.1 Boundary Detection
```typescript
const checkBoundaries = () => {
  const museumRadius = 29  // Slightly less than wall radius
  const distanceFromCenter = Math.sqrt(position.x ** 2 + position.z ** 2)
  
  if (distanceFromCenter > museumRadius) {
    // Push player back
    const angle = Math.atan2(position.z, position.x)
    position.x = Math.cos(angle) * museumRadius
    position.z = Math.sin(angle) * museumRadius
    velocity.x *= -0.5  // Bounce effect
    velocity.z *= -0.5
  }
}
```

#### 5.2 Ceiling Collision
- Check if player position.y > (wallHeight - playerHeight)
- Stop upward velocity on ceiling hit
- Add "bonk" sound effect

### **Phase 6: UI/UX Enhancements**

#### 6.1 Physics HUD
```vue
<div class="physics-hud">
  <div class="gravity-indicator">
    <span class="label">Gravity:</span>
    <span class="value">{{ (currentGravity / 9.8).toFixed(1) }}x Earth</span>
    <div class="gravity-bar" :style="{ width: gravityPercentage + '%' }"></div>
  </div>
  <div class="jump-indicator" :class="{ ready: canJump }">
    <span>SPACE: Jump</span>
  </div>
</div>
```

#### 6.2 Settings Menu
- Gravity slider (0.1x to 2.0x Earth)
- Jump height multiplier
- Air control sensitivity
- Toggle physics debug visualization

### **Phase 7: Interactive Elements**

#### 7.1 Physics-Based Interactions
- **Floating Portfolio Frames**: In low-gravity zones
- **Bouncing Platforms**: Jump pads with extra velocity
- **Gravity Wells**: Areas that pull/push the player
- **Physics Puzzles**: Reach high frames using gravity mechanics

#### 7.2 Environmental Storytelling
- Different gallery sections represent different celestial bodies
- Educational plaques about gravity on different planets
- Visual cues (floating dust, slow-falling particles) indicate gravity

## 🎮 **Implementation Code Structure**

### **New File: PhysicsSystem.ts**
```typescript
export class PhysicsSystem {
  private config: PhysicsConfig
  private state: PhysicsState
  
  constructor(initialConfig: Partial<PhysicsConfig> = {}) {
    this.config = { ...defaultPhysicsConfig, ...initialConfig }
    this.state = createInitialPhysicsState()
  }
  
  update(deltaTime: number, inputs: InputState): void {
    this.applyGravity(deltaTime)
    this.handleJumping(deltaTime, inputs)
    this.updateVelocity(deltaTime)
    this.updatePosition(deltaTime)
    this.checkCollisions()
    this.checkGrounded()
  }
  
  setGravity(multiplier: number): void {
    this.config.gravity = 9.8 * multiplier
  }
  
  getState(): Readonly<PhysicsState> {
    return this.state
  }
}
```

### **Integration with SpaceMuseum.vue**
```typescript
// In setup()
const physics = new PhysicsSystem({ gravity: 7.84 }) // 0.8x Earth

// In animate()
physics.update(delta, {
  jump: state.jumpPressed,
  moveForward: state.moveForward,
  // ... other inputs
})

const physicsState = physics.getState()
state.camera.position.copy(physicsState.position)
```

## 📊 **Performance Considerations**

### **Optimization Strategies**
1. **Spatial Partitioning**: Only check collisions with nearby objects
2. **LOD for Physics**: Simpler physics for distant objects
3. **Fixed Timestep**: Ensure consistent physics regardless of framerate
4. **Object Pooling**: Reuse physics objects for particles/effects

### **Performance Targets**
- Maintain 60 FPS with physics enabled
- Physics update < 2ms per frame
- Memory usage < 10MB for physics system

## 🧪 **Testing Plan**

### **Unit Tests**
- Gravity calculations
- Jump velocity formulas
- Collision detection accuracy
- Boundary enforcement

### **Integration Tests**
- Movement feel at different gravities
- Jump height consistency
- Collision response smoothness
- Performance under stress

### **User Testing**
- Intuitive controls
- Motion sickness prevention
- Fun factor of different gravities
- Accessibility considerations

## 🎯 **Success Metrics**

1. **Technical**
   - Smooth physics at 60 FPS
   - Accurate collision detection
   - Responsive controls

2. **User Experience**
   - Players spend more time exploring
   - Positive feedback on movement feel
   - Discovery of gravity zones

3. **Engagement**
   - Jump mechanic usage statistics
   - Time spent in different gravity zones
   - Completion of physics-based challenges

## 🚀 **Quick Start Implementation**

### **Minimal Viable Physics (Day 1)**
```typescript
// Add to SpaceMuseum.vue state
const physicsState = {
  velocityY: 0,
  isGrounded: true,
  gravity: 7.84,  // 0.8x Earth
  jumpSpeed: 8
}

// Add to animate()
// Apply gravity
if (!physicsState.isGrounded) {
  physicsState.velocityY -= physicsState.gravity * delta
  state.camera.position.y += physicsState.velocityY * delta
}

// Ground check
if (state.camera.position.y <= 1.8) {
  state.camera.position.y = 1.8
  physicsState.velocityY = 0
  physicsState.isGrounded = true
}

// Jump (add Space key handler)
if (jumpPressed && physicsState.isGrounded) {
  physicsState.velocityY = physicsState.jumpSpeed
  physicsState.isGrounded = false
}
```

## 📚 **References & Inspiration**

- **Unity CharacterController**: Industry-standard physics movement
- **Source Engine Physics**: Smooth air control and bunny hopping
- **Portal 2**: Gravity manipulation puzzles
- **Prey (2017)**: Zero-G movement in space station
- **The Outer Wilds**: Variable gravity on different planets

## 🎨 **Visual Effects Ideas**

1. **Jump Particles**: Dust clouds that behave differently in various gravities
2. **Motion Trails**: Light trails that arc based on gravity
3. **Gravity Distortion**: Subtle screen warping in extreme gravity zones
4. **Floating Debris**: Environmental objects that respond to gravity changes
5. **Footstep Impacts**: Variable based on landing force and gravity

---

**Next Steps**: 
1. Implement basic jumping with 0.8x gravity
2. Add ground detection and collision
3. Create gravity zone system
4. Polish with effects and UI
5. User test and iterate on feel
