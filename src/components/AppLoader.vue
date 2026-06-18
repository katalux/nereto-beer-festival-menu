<script setup>
defineProps({
  logoSrc: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="app-loader" aria-label="Caricamento menu">
    <img
      :src="logoSrc"
      width="827"
      height="768"
      alt="Nereto Beer Festival"
      class="app-loader__logo"
      fetchpriority="high"
      decoding="async"
    />
  </section>
</template>