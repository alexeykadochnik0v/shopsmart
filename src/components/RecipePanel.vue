<template>
  <div class="recipe-panel">
    <h2 class="text-h6 mb-4 px-4">Готовые рецепты</h2>
    <div class="recipe-list">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '../stores/recipe';
import RecipeCard from './RecipeCard.vue';

defineProps<{
  recipes: Recipe[]
}>();
</script>

<style scoped>
.recipe-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.recipe-list {
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
}

@media (max-width: 959px) {
  .recipe-panel {
    padding: 0 1rem;
  }

  .recipe-list {
    border-radius: 0;
  }
}
</style>
