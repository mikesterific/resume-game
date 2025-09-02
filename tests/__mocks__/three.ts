// Comprehensive Three.js mock
export class Vector3 {
  x: number = 0
  y: number = 0
  z: number = 0
  
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
  
  set(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }
  
  copy(v: Vector3) {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
  }
  
  clone() {
    return new Vector3(this.x, this.y, this.z)
  }
  
  add(v: Vector3) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
    return this
  }
  
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    if (length > 0) {
      this.x /= length
      this.y /= length
      this.z /= length
    }
    return this
  }
}

export class Euler {
  x: number = 0
  y: number = 0
  z: number = 0
  order: string = 'XYZ'
  
  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x
    this.y = y
    this.z = z
    this.order = order
  }
  
  set(x: number, y: number, z: number, order?: string) {
    this.x = x
    this.y = y
    this.z = z
    if (order) this.order = order
    return this
  }
}

export class Object3D {
  position = new Vector3()
  rotation = new Euler()
  scale = new Vector3(1, 1, 1)
  visible = true
  children: Object3D[] = []
  parent: Object3D | null = null
  
  add(object: Object3D) {
    this.children.push(object)
    object.parent = this
  }
  
  remove(object: Object3D) {
    const index = this.children.indexOf(object)
    if (index !== -1) {
      this.children.splice(index, 1)
      object.parent = null
    }
  }
  
  traverse(callback: (obj: Object3D) => void) {
    callback(this)
    for (const child of this.children) {
      child.traverse(callback)
    }
  }
}

export class Camera extends Object3D {
  near = 0.1
  far = 2000
  
  constructor() {
    super()
  }
}

export class PerspectiveCamera extends Camera {
  fov = 50
  aspect = 1
  
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
    super()
    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far
  }
  
  updateProjectionMatrix() {
    // Mock implementation
  }
}

export class Scene extends Object3D {
  constructor() {
    super()
  }
}

export class WebGLRenderer {
  domElement = document.createElement('canvas')
  
  setSize(width: number, height: number) {
    this.domElement.width = width
    this.domElement.height = height
  }
  
  render(scene: Scene, camera: Camera) {
    // Mock implementation
  }
  
  dispose() {
    // Mock implementation
  }
}

export class Geometry {
  constructor() {}
}

export class BufferGeometry extends Geometry {
  constructor() {
    super()
  }
  
  dispose() {
    // Mock implementation
  }
}

export class Material {
  constructor() {}
  
  dispose() {
    // Mock implementation
  }
}

export class Mesh extends Object3D {
  geometry: BufferGeometry
  material: Material
  
  constructor(geometry = new BufferGeometry(), material = new Material()) {
    super()
    this.geometry = geometry
    this.material = material
  }
}

// Controls mock
export class Controls extends Object3D {
  enabled = true
  
  constructor(object?: Object3D, domElement?: HTMLElement) {
    super()
  }
  
  dispose() {
    // Mock implementation
  }
}

export class PointerLockControls extends Controls {
  isLocked = false
  
  constructor(camera?: PerspectiveCamera, domElement?: HTMLElement) {
    super(camera, domElement)
  }
  
  lock() {
    this.isLocked = true
  }
  
  unlock() {
    this.isLocked = false
  }
  
  getObject() {
    return new Object3D()
  }
  
  connect() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
}

// Loaders mock
export class Loader {
  load(url: string, onLoad?: Function, onProgress?: Function, onError?: Function) {
    if (onLoad) {
      setTimeout(() => onLoad({}), 100)
    }
  }
}

export class GLTFLoader extends Loader {
  load(url: string, onLoad?: Function, onProgress?: Function, onError?: Function) {
    if (onLoad) {
      setTimeout(() => onLoad({ scene: new Scene() }), 100)
    }
  }
}

// Lights mock
export class Light extends Object3D {
  color = { r: 1, g: 1, b: 1 }
  intensity = 1
  
  constructor(color?: any, intensity = 1) {
    super()
    if (color) this.color = color
    this.intensity = intensity
  }
}

export class AmbientLight extends Light {
  constructor(color?: any, intensity = 1) {
    super(color, intensity)
  }
}

export class DirectionalLight extends Light {
  target = new Object3D()
  
  constructor(color?: any, intensity = 1) {
    super(color, intensity)
  }
}

// Default export
const THREE = {
  Vector3,
  Euler,
  Object3D,
  Camera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Geometry,
  BufferGeometry,
  Material,
  Mesh,
  Controls,
  PointerLockControls,
  Loader,
  GLTFLoader,
  Light,
  AmbientLight,
  DirectionalLight
}

export default THREE
