<template>
  <transition
    mode="out-in"
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'TransitionFade'
}
</script>
