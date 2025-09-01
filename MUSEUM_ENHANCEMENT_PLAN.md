# Space Museum Enhancement Plan
*Inspired by [3D Art Gallery Three.js](https://github.com/theringsofsaturn/3D-art-gallery-threejs)*

## 🎯 **Objectives**
Transform our circular space museum into a professional-grade 3D gallery experience using high-quality textures, materials, and interactive features.

## 📦 **Asset Requirements**

### **Textures to Download**
1. **Floor Material**
   - Source: [AmbientCG WoodFloor040](https://ambientcg.com/view?id=WoodFloor040)
   - Resolution: 1K (for performance) or 2K (for quality)
   - Files needed: Diffuse, Normal, Roughness, AO maps
   - Target: Replace current flat floor color

2. **Ceiling Material**
   - Source: [AmbientCG OfficeCeiling005](https://ambientcg.com/view?id=OfficeCeiling005)
   - Resolution: 1K recommended
   - Files needed: Diffuse, Normal, Roughness maps
   - Target: Professional ceiling appearance

3. **Wall Material**
   - Source: [Polyhaven Leather White](https://polyhaven.com/a/leather%5Fwhite)
   - Resolution: 1K recommended
   - Files needed: Diffuse, Normal, Roughness, Displacement maps
   - Target: Replace current flat wall colors

### **3D Models (Optional)**
1. **Decorative Sculptures**
   - Source: [Sketchfab Aphrodite Statue](https://sketchfab.com/3d-models/100kz11-aphrodite-kallipygos-statuette-c01ba617ec83491195146583b70e3df9)
   - Format: GLTF/GLB preferred
   - Placement: Center of circular museum or corners

## 🛠️ **Implementation Phases**

### **Phase 1: Texture Integration**
```javascript
// Enhanced floor with PBR materials
const textureLoader = new THREE.TextureLoader()

// Load floor textures
const floorDiffuse = textureLoader.load('/textures/floor/diffuse.jpg')
const floorNormal = textureLoader.load('/textures/floor/normal.jpg')
const floorRoughness = textureLoader.load('/textures/floor/roughness.jpg')
const floorAO = textureLoader.load('/textures/floor/ao.jpg')

// Configure texture wrapping and repeat
[floorDiffuse, floorNormal, floorRoughness, floorAO].forEach(texture => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8) // Adjust for circular floor
})

// Create PBR material
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorDiffuse,
  normalMap: floorNormal,
  roughnessMap: floorRoughness,
  aoMap: floorAO,
  aoMapIntensity: 1.0
})
```

### **Phase 2: Advanced Lighting System**
```javascript
// Professional gallery lighting inspired by the reference
const setupGalleryLighting = () => {
  // Main ambient lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.2)
  scene.add(ambientLight)

  // Directional light for overall illumination
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, 20, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 4096
  directionalLight.shadow.mapSize.height = 4096
  scene.add(directionalLight)

  // Individual spotlights for each artwork (like real galleries)
  portfolioFrames.forEach((frame, index) => {
    const spotlight = new THREE.SpotLight(0xffffff, 1.0, 30, Math.PI / 6, 0.3)
    spotlight.position.set(
      frame.position.x * 0.7, // Closer to center
      wallHeight - 1,
      frame.position.z * 0.7
    )
    spotlight.target = frame.mesh
    spotlight.castShadow = true
    scene.add(spotlight)
    scene.add(spotlight.target)
  })
}
```

### **Phase 3: Interactive Enhancements**
```javascript
// Hover effects for portfolio frames
const addFrameInteractivity = () => {
  portfolioFrames.forEach(frame => {
    // Add glow effect on hover
    const glowGeometry = new THREE.PlaneGeometry(
      frame.width + 0.5, 
      frame.height + 0.5
    )
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.copy(frame.mesh.position)
    glow.position.z -= 0.01
    glow.rotation.copy(frame.mesh.rotation)
    
    frame.glow = glow
    scene.add(glow)
  })
}

// Proximity-based glow animation
const updateFrameProximity = (playerPosition) => {
  portfolioFrames.forEach(frame => {
    const distance = playerPosition.distanceTo(frame.mesh.position)
    const maxGlowDistance = 10
    
    if (distance < maxGlowDistance) {
      const intensity = 1 - (distance / maxGlowDistance)
      frame.glow.material.opacity = intensity * 0.3
      
      // Scale effect
      const scale = 1 + (intensity * 0.05)
      frame.mesh.scale.setScalar(scale)
    } else {
      frame.glow.material.opacity = 0
      frame.mesh.scale.setScalar(1)
    }
  })
}
```

### **Phase 4: 3D Model Integration**
```javascript
// Load and place decorative 3D models
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loadDecorative3DModels = () => {
  const loader = new GLTFLoader()
  
  // Central sculpture
  loader.load('/models/statue.glb', (gltf) => {
    const statue = gltf.scene
    statue.scale.setScalar(2) // Adjust size
    statue.position.set(0, 0, 0) // Center of museum
    statue.castShadow = true
    statue.receiveShadow = true
    scene.add(statue)
  })
  
  // Corner decorative elements
  const cornerPositions = [
    { x: 20, z: 20 },
    { x: -20, z: 20 },
    { x: 20, z: -20 },
    { x: -20, z: -20 }
  ]
  
  cornerPositions.forEach(pos => {
    loader.load('/models/decorative.glb', (gltf) => {
      const model = gltf.scene
      model.position.set(pos.x, 0, pos.z)
      model.scale.setScalar(0.5)
      scene.add(model)
    })
  })
}
```

## 📁 **File Structure Plan**
```
public/
├── textures/
│   ├── floor/
│   │   ├── diffuse.jpg
│   │   ├── normal.jpg
│   │   ├── roughness.jpg
│   │   └── ao.jpg
│   ├── ceiling/
│   │   ├── diffuse.jpg
│   │   ├── normal.jpg
│   │   └── roughness.jpg
│   └── walls/
│       ├── diffuse.jpg
│       ├── normal.jpg
│       ├── roughness.jpg
│       └── displacement.jpg
├── models/
│   ├── statue.glb
│   └── decorative.glb
└── sounds/ (optional)
    ├── ambient.mp3
    └── footsteps.mp3
```

## 🎯 **Success Metrics**
- [ ] Professional PBR materials implemented
- [ ] Individual artwork lighting system
- [ ] Interactive hover effects
- [ ] 3D decorative models placed
- [ ] Performance maintained (60fps)
- [ ] Mobile compatibility preserved

## 🚀 **Next Steps**
1. Download texture assets from specified sources
2. Create texture loading system
3. Implement PBR materials
4. Add individual artwork lighting
5. Integrate 3D models
6. Test performance and optimize

## 📚 **References**
- [3D Art Gallery Three.js](https://github.com/theringsofsaturn/3D-art-gallery-threejs)
- [AmbientCG Textures](https://ambientcg.com/)
- [Polyhaven Materials](https://polyhaven.com/)
- [Sketchfab 3D Models](https://sketchfab.com/)
