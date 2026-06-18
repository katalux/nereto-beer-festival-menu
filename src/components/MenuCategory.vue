<script setup>
import MenuItemCard from './MenuItemCard.vue'

defineProps({
  category: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <section :id="category.id" class="menu-category" data-category-section data-reveal>
    <div class="category-heading" :style="{ '--category-color': category.color }">
      <div class="category-icon" aria-hidden="true">{{ category.icon }}</div>
      <div>
        <p class="eyebrow mb-1">Categoria</p>
        <h2>{{ category.title }}</h2>
        <p>{{ category.subtitle }}</p>
      </div>
      <span class="category-count">{{ category.items.length }}</span>
    </div>

    <div class="row g-3 g-lg-4">
      <div v-for="item in category.items" :key="item.name" class="col-12 col-md-6 col-xl-4">
        <MenuItemCard :item="item" />
      </div>
    </div>
  </section>
</template>
