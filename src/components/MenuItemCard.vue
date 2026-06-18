<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="menu-item-card" :class="{ featured: item.featured }">
    <div class="item-topline">
      <span v-if="item.badge" class="item-badge">{{ item.badge }}</span>
      <span v-if="item.featured" class="item-featured">Consigliato</span>
    </div>

    <div class="item-mainline">
      <h3>{{ item.name }}</h3>
      <strong class="item-price">{{ item.price }}</strong>
    </div>

    <p class="item-description">{{ item.description }}</p>

    <div class="allergen-row" :class="{ empty: !item.allergens?.length }">
      <span class="allergen-label">Allergeni</span>
      <template v-if="item.allergens?.length">
        <span v-for="allergen in item.allergens" :key="allergen" class="allergen-chip">
          {{ allergen }}
        </span>
      </template>
      <span v-else class="allergen-chip muted">nessuno indicato</span>
    </div>
  </article>
</template>
