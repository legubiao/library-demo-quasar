<template>
  <router-view />
</template>

<script>
import { defineComponent, provide, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup () {
    provide('api', ref())
  }
})
</script>
