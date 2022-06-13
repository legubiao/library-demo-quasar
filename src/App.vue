<template>
  <router-view v-slot="{ Component }">
    <transition-bounce>
      <component :is="Component" />
    </transition-bounce>
  </router-view>
</template>

<script>
import { defineComponent, provide, ref } from 'vue'
import TransitionBounce from 'components/universal/Bounce.vue'

export default defineComponent({
  name: 'App',
  components: { TransitionBounce },
  setup () {
    sessionStorage.removeItem('role')
    provide('api', ref())
  }
})
</script>

<style>
#q-app {
  overflow: hidden;
}
.blur-accent {
  background: v-bind(accent);
  backdrop-filter: blur(10px) brightness(100%)
}
.blur {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px) brightness(100%);
}
.q-table th {
  font-weight: bold;
  font-size: 1rem;
}
</style>
