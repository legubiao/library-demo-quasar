<template>
  <transition
    enter-active-class="animated bounceIn"
    leave-active-class="animated bounceOut"
    mode="out-in">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'TransitionBounce'
}
</script>
