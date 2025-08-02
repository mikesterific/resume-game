import { EventEmitter } from 'events'
import type { GameEvents, GameEventType, GameEventData } from '@/types/game'

/**
 * Event bridge for communication between Phaser game and Vue components
 * This singleton class manages all communication between the game engine and UI
 */
class GameEventBridge extends EventEmitter {
  private static instance: GameEventBridge
  
  private constructor() {
    super()
    this.setMaxListeners(100) // Increase limit for multiple listeners
  }

  public static getInstance(): GameEventBridge {
    if (!GameEventBridge.instance) {
      GameEventBridge.instance = new GameEventBridge()
    }
    return GameEventBridge.instance
  }

  /**
   * Emit a game event with type safety
   */
  public emitGameEvent<T extends GameEventType>(
    event: T,
    data: GameEventData<T>
  ): boolean {
    console.log(`[GameEventBridge] Emitting: ${event}`, data)
    return this.emit(event, data)
  }

  /**
   * Listen for a game event with type safety
   */
  public onGameEvent<T extends GameEventType>(
    event: T,
    listener: (data: GameEventData<T>) => void
  ): this {
    console.log(`[GameEventBridge] Listening for: ${event}`)
    return this.on(event, listener)
  }

  /**
   * Remove event listener
   */
  public offGameEvent<T extends GameEventType>(
    event: T,
    listener: (data: GameEventData<T>) => void
  ): this {
    return this.off(event, listener)
  }

  /**
   * Remove all listeners for an event
   */
  public removeAllGameListeners<T extends GameEventType>(event?: T): this {
    return this.removeAllListeners(event)
  }

  /**
   * Get active listener count for debugging
   */
  public getListenerCount<T extends GameEventType>(event: T): number {
    return this.listenerCount(event)
  }
}

// Export singleton instance
export const gameEventBridge = GameEventBridge.getInstance()
export default gameEventBridge