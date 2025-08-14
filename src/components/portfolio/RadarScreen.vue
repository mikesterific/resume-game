<template>
  <div class="radar">
    <div class="circle circle1"></div>
    <div class="circle circle2"></div>
    <div class="circle circle3"></div>
    <div class="circle circle4"></div>
    <div class="crosshair vertical"></div>
    <div class="crosshair horizontal"></div>
    <div
      v-for="blip in blips"
      :key="blip.key"
      class="blip"
      :title="blip.key"
      :style="{  top: '50%', left: '50%', transform: `translate(${blip.x}px, ${blip.y}px)` }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface RadarBlip {
  x: number;
  y: number;
  key: string;
}

export default defineComponent({
  name: 'RadarScreen',
  data() {
    return {

    }
  },
  props: {
    blips: {
      type: Array as PropType<RadarBlip[]>,
      default: () => [],
    },
  },
  computed: {
    
  }
})
</script>

<style scoped>
.radar {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 255, 0.3);
  flex: 0 0 auto;
}

.radar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(0, 255, 255, 0.18),
    rgba(0, 255, 255, 0.0) 35%
  );
  animation: radar-rotate 3s linear infinite;
  z-index: 1000000;
}

.circle {
  position: absolute;
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
  z-index: 1000000;
}

.circle1 { width: 100%; height: 100%; top: 0; left: 0; }
.circle2 { width: 75%; height: 75%; top: 12.5%; left: 12.5%; }
.circle3 { width: 50%; height: 50%; top: 25%; left: 25%; }
.circle4 { width: 25%; height: 25%; top: 37.5%; left: 37.5%; }

.crosshair {
  position: absolute;
  background: rgba(0, 255, 255, 0.3);
  z-index: 1;
}

.crosshair.vertical { width: 1px; height: 100%; left: 50%; top: 0; }
.crosshair.horizontal { width: 100%; height: 1px; top: 50%; left: 0; }

.blip {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.8), 0 0 12px rgba(0, 255, 255, 0.4);
  animation: blipPulse 1.6s ease-in-out infinite;
  z-index: 1000000;
}

@keyframes radar-rotate {
  to { transform: rotate(360deg); }
}

@keyframes blipPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
</style>
