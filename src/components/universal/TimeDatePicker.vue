<template>
  <q-input :model-value="modelValue"
           @update:model-value="updateValue" :label="label">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date :model-value="modelValue"
                  @update:model-value="updateValue" mask="YYYY-MM-DD HH:mm">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time :model-value="modelValue"
                  @update:model-value="updateValue" mask="YYYY-MM-DD HH:mm" format24h now-btn>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    label: String,
    modelValue: String
  },
  setup (prop, context) {
    return {
      updateValue (value) {
        context.emit('update:modelValue', value)
      }
    }
  }
})
</script>
