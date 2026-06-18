<script setup>
const logoSrc = `${import.meta.env.BASE_URL}assets/images/logo-main.png`

defineProps({
  festival: {
    type: Object,
    required: true
  },
  contacts: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <header class="festival-hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="container px-3">
      <div class="hero-content">
        <div class="hero-logo-wrap" data-hero-logo>
          <img :src="logoSrc" alt="Nereto Beer Festival" class="hero-logo" />
        </div>

        <div class="hero-copy mt-5" data-hero-copy>
          <p class="hero-note mb-2">{{ festival.heroNote }}</p>
          <h1 class="hero-title">
            {{ festival.title }}
            <span>{{ festival.year }}</span>
          </h1>
          <p class="hero-claim mb-0">{{ festival.claim }}</p>

          <div class="hero-badges" aria-label="Informazioni evento">
            <span>{{ festival.edition }}</span>
            <span>{{ festival.dates }}</span>
            <span>{{ festival.location }}</span>
          </div>

          <div class="hero-actions">
            <a class="btn btn-festival btn-lg" href="#menu-start">Guarda il menu</a>
            <!-- <a class="btn btn-outline-festival btn-lg" :href="contacts.whatsapp" target="_blank" rel="noreferrer">
              WhatsApp
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
