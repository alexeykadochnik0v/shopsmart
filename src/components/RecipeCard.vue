<template>
  <div>
    <v-card
      variant="flat"
      :color="theme.global.current.value.dark ? 'background' : 'surface'"
      class="mb-3 mb-sm-4 recipe-card"
      elevation="0"
      rounded="lg"
    >
      <v-card-title class="d-flex align-center py-2 py-sm-3 px-3 px-sm-4 justify-space-between">
        <v-btn
          variant="text"
          class="text-none flex-grow-1 justify-start pa-1 pa-sm-2 text-secondary font-weight-medium"
          @click="addAllIngredients"
        >
          <v-icon
            icon="mdi-playlist-plus"
            class="mr-2"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'default' : 'large'"
          />
          <span class="text-body-2 text-sm-body-1">{{ recipe.name }}</span>
        </v-btn>

        <div class="d-flex align-center">
          <v-btn
            icon
            variant="text"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
            class="mr-2"
            @click="showEditDialog = true"
          >
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn
            icon
            variant="text"
            @click="isExpanded = !isExpanded"
            color="secondary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
          >
            <v-icon :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </v-btn>
        </div>
      </v-card-title>

      <RecipeIngredientList
        :ingredients="recipe.ingredients"
        :is-expanded="isExpanded"
      />
    </v-card>

    <EditRecipeDialog
      v-model="showEditDialog"
      :recipe="recipe"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useShoppingStore } from '../stores/shopping';
import { useRecipeStore } from '../stores/recipe';
import type { Recipe } from '../stores/recipe';
import RecipeIngredientList from './RecipeIngredientList.vue';
import EditRecipeDialog from './EditRecipeDialog.vue';

const props = defineProps<{
  recipe: Recipe
}>();

const theme = useTheme();
const isExpanded = ref(false);
const showEditDialog = ref(false);
const shoppingStore = useShoppingStore();
const recipeStore = useRecipeStore();

const addAllIngredients = () => {
  props.recipe.ingredients.forEach(ingredient => {
    shoppingStore.addItem(ingredient);
  });
};
</script>

<style scoped>
.recipe-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.recipe-card:hover {
  border-color: rgb(var(--v-theme-primary));
}

@media (max-width: 600px) {
  .recipe-card {
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: 0 !important;
  }
}
</style>
