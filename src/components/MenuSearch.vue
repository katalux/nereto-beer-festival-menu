<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label class="search-box" for="menu-search">
    <span aria-hidden="true">🔎</span>
    <input
      id="menu-search"
      :value="modelValue"
      type="search"
      placeholder="Cerca panino, birra, allergene..."
      autocomplete="off"
      @input="updateValue"
    />
  </label>
</template>
