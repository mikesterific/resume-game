<template>
  <div class="game-view">
    <GameContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameContainer from '@/components/game/GameContainer.vue'

export default defineComponent({
  name: 'GameView',
  components: {
    GameContainer
  }
})
</script>

<style scoped>
.game-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
