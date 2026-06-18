<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FestivalHero from './components/FestivalHero.vue'
import MenuCategory from './components/MenuCategory.vue'
// Ricerca disattivata nel layout: il componente resta pronto da riattivare se il menu crescerà.
// import MenuSearch from './components/MenuSearch.vue'
import BottomActions from './components/BottomActions.vue'
import AppLoader from './components/AppLoader.vue'

const DEFAULT_MENU = {
  festival: {
    title: 'Nereto Beer Festival',
    edition: 'V Edizione',
    year: '2026',
    claim: 'Curiamo gli assetati',
    dates: 'Dal 30 giugno al 5 luglio',
    location: 'P.zza Cavour, Nereto TE',
    heroNote: 'Menu digitale ufficiale'
  },
  contacts: {
    facebook: 'https://www.facebook.com/neretobeerfestival',
    instagram: 'https://www.instagram.com/beerfestivalnereto/',
    whatsapp: 'https://wa.me/393534842559'
  },
  notice: 'Menu dimostrativo.',
  categories: []
}

const menu = ref(DEFAULT_MENU)
const loading = ref(true)
const showLoader = ref(true)
const MIN_LOADER_TIME = 1000
const query = ref('')
const activeCategory = ref('')
const baseUrl = import.meta.env.BASE_URL
const logoSrc = `${baseUrl}assets/images/logo-main.png`
const backgroundStyle = { '--festival-bg': `url('${baseUrl}assets/images/festival-bg.png')` }
let observer
let animationContext

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const visibleCategories = computed(() => {
  if (!normalizedQuery.value) return menu.value.categories

  return menu.value.categories
    .map((category) => {
      const items = category.items.filter((item) => {
        const haystack = [
          item.name,
          item.description,
          item.price,
          item.badge,
          ...(item.allergens || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(normalizedQuery.value)
      })

      return { ...category, items }
    })
    .filter((category) => category.items.length > 0)
})

const navCategories = computed(() => (normalizedQuery.value ? visibleCategories.value : menu.value.categories))

function forceScrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  })

  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

async function loadMenu() {
  const loaderStartedAt = performance.now()

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/menu.json`, {
      cache: 'no-cache'
    })

    if (!response.ok) throw new Error('Menu non disponibile')

    menu.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false

    await nextTick()

    activeCategory.value = visibleCategories.value[0]?.id || ''

    initObserver()
    runAnimations()

    const elapsed = performance.now() - loaderStartedAt
    const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsed)

    window.setTimeout(() => {
      forceScrollTop()
      showLoader.value = false

      requestAnimationFrame(() => {
        forceScrollTop()
      })
    }, remainingTime)
  }
}

function scrollToCategory(categoryId) {
  const element = document.getElementById(categoryId)
  if (!element) return

  const stickyMenu = document.querySelector('.category-strip')

  const stickyHeight = stickyMenu?.offsetHeight || 0
  const extraOffset = 60

  const targetPosition =
    element.getBoundingClientRect().top +
    window.scrollY -
    stickyHeight -
    extraOffset

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  })
}

function initObserver() {
  observer?.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting)
      if (visibleEntry) activeCategory.value = visibleEntry.target.id
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.01
    }
  )

  document.querySelectorAll('[data-category-section]').forEach((section) => observer.observe(section))
}

function runAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  gsap.registerPlugin(ScrollTrigger)
  animationContext?.revert()

  animationContext = gsap.context(() => {
    gsap.from('[data-hero-logo]', {
      y: 26,
      opacity: 0,
      scale: 0.88,
      rotate: -2,
      duration: 0.85,
      ease: 'back.out(1.8)'
    })

    gsap.from('[data-hero-copy] > *', {
      y: 18,
      opacity: 0,
      duration: 0.58,
      stagger: 0.08,
      delay: 0.12,
      ease: 'power3.out'
    })

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 34,
        opacity: 0,
        duration: 0.62,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true
        }
      })
    })
  })
}

watch(visibleCategories, async () => {
  await nextTick()
  activeCategory.value = visibleCategories.value[0]?.id || ''
  initObserver()
  ScrollTrigger?.refresh?.()
})

onMounted(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  forceScrollTop()

  requestAnimationFrame(() => {
    forceScrollTop()
  })

  loadMenu()
})

onBeforeUnmount(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'auto'
  }
})

onUnmounted(() => {
  observer?.disconnect()
  animationContext?.revert()
})
</script>

<template>
  <AppLoader
    v-show="showLoader"
    :logo-src="logoSrc"
    :class="{ 'app-loader--hidden': !showLoader }"
  />

  <main class="app-shell" :style="backgroundStyle">
    <FestivalHero :festival="menu.festival" :contacts="menu.contacts" />

    <section class="menu-panel" aria-label="Menu del festival">
      <div class="container px-3 px-lg-4">
        <div id="menu-start" class="scroll-anchor"></div>
        <div class="menu-toolbar menu-toolbar--compact glass-card" data-reveal>
          <div>
            <p class="eyebrow mb-1">Menu digitale</p>
            <h1 class="toolbar-title mb-0">Scegli e goditi la festa.</h1>
          </div>

          <!--
            Ricerca disattivata: per un menu breve è più immediato mostrare subito tutte le categorie.
            Il componente è stato isolato in `src/components/MenuSearch.vue`.
            Per riattivarlo:
            1. decommenta l'import `MenuSearch` nello script;
            2. decommenta il componente qui sotto.

            <MenuSearch v-model="query" />
          -->
        </div>

        <div class="category-strip" aria-label="Categorie menu" data-reveal>
          <button
            v-for="category in navCategories"
            :key="category.id"
            class="category-pill"
            :class="{ active: activeCategory === category.id }"
            type="button"
            @click="scrollToCategory(category.id)"
          >
            <span>{{ category.icon }}</span>
            {{ category.title }}
          </button>
        </div>

        <div v-if="menu.notice" class="menu-notice" data-reveal>
          <strong>Nota:</strong> {{ menu.notice }}
        </div>

        <div v-if="loading" class="loading-card glass-card">
          <span class="beer-loader" aria-hidden="true"></span>
          Caricamento menu...
        </div>

        <template v-else>
          <div v-if="visibleCategories.length" class="menu-grid mt-4">
            <MenuCategory
              v-for="category in visibleCategories"
              :key="category.id"
              :category="category"
            />
          </div>

          <div v-else class="empty-state glass-card">
            <h2>Nessun risultato</h2>
            <p>Prova a cercare una categoria, un prodotto o un allergene diverso.</p>
            <button class="btn btn-festival" type="button" @click="query = ''">Pulisci ricerca</button>
          </div>
        </template>
      </div>
    </section>

    <footer class="festival-footer">
      <div class="container px-3 text-center">
        <img :src="logoSrc" alt="Nereto Beer Festival" class="footer-logo" />
        <p class="mb-1">{{ menu.festival.dates }}</p>
        <p class="mb-0">{{ menu.festival.location }}</p>
      </div>
    </footer>

    <BottomActions :contacts="menu.contacts" />
  </main>
</template>
