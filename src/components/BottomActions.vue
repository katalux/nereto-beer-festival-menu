<script setup>
defineProps({
  contacts: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <nav class="bottom-actions" aria-label="Contatti festival">
    <a :href="contacts.facebook" target="_blank" rel="noreferrer" aria-label="Facebook Nereto Beer Festival">
      <span>f</span>
      Facebook
    </a>
    <a :href="contacts.instagram" target="_blank" rel="noreferrer" aria-label="Instagram Nereto Beer Festival">
      <span>◎</span>
      Instagram
    </a>
    <a :href="contacts.whatsapp" target="_blank" rel="noreferrer" aria-label="WhatsApp Nereto Beer Festival">
      <span>☏</span>
      WhatsApp
    </a>
  </nav>
</template>
