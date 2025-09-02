import { Controls, Euler, Vector3 } from 'three'

export { Controls, Euler, Vector3 }

export class PointerLockControls extends Controls {
  isLocked = false
  
  constructor(camera?: any, domElement?: HTMLElement) {
    super(camera, domElement)
  }
  
  lock() {
    this.isLocked = true
  }
  
  unlock() {
    this.isLocked = false
  }
  
  getObject() {
    return { position: new Vector3(), rotation: new Euler() }
  }
  
  connect() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
}
