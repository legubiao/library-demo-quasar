<template>
  <q-input :model-value="modelValue"
           @update:model-value="updateValue" :type="isPwd ? 'password' : 'text'">
    <template v-slot:append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'PasswordInput',
  props: {
    modelValue: String
  },
  setup (props, context) {
    return {
      isPwd: ref(true),
      updateValue (value) {
        context.emit('update:modelValue', value)
      }
    }
  }
}
</script>
