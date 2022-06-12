<template>
  <transition
    mode="out-in"
    enter-active-class="animated flipInX"
    leave-active-class="animated flipOutX"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'TransitionFlip'
}
</script>
