<template>
  <div>
    <v-card
      variant="flat"
      :color="theme.global.current.value.dark ? 'background' : 'surface'"
      class="mb-3 mb-sm-4 recipe-card"
      elevation="0"
      rounded="lg"
      @click="isExpanded = !isExpanded"
    >
      <v-card-title class="d-flex align-center py-2 py-sm-3 px-3 px-sm-4 justify-space-between">
        <div class="d-flex align-center flex-grow-1">
          <v-icon
            :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            class="mr-2"
            color="secondary"
            :size="$vuetify.display.smAndDown ? 'default' : 'large'"
          />
          <span class="text-body-2 text-sm-body-1 text-secondary font-weight-medium">{{ recipe.name }}</span>
        </div>

        <div class="d-flex align-center">
          <v-btn
            icon
            variant="text"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
            class="mr-2"
            @click.stop="showEditDialog = true"
            :ripple="false"
          >
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn
            icon
            variant="text"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
            @click.stop="addAllIngredients"
            :ripple="false"
          >
            <v-icon icon="mdi-playlist-plus" />
            <v-tooltip
              activator="parent"
              location="top"
            >
              Добавить все ингредиенты в список покупок
            </v-tooltip>
          </v-btn>
        </div>
      </v-card-title>

      <v-expand-transition>
        <div v-if="isExpanded">
          <RecipeIngredientList
            :ingredients="recipe.ingredients"
            :is-expanded="isExpanded"
          />
        </div>
      </v-expand-transition>
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

const addAllIngredients = () => {
  props.recipe.ingredients.forEach(ingredient => {
    shoppingStore.addItem(ingredient);
  });
};
</script>

<style scoped>
.recipe-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.recipe-card:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

@media (max-width: 600px) {
  .recipe-card {
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: 0 !important;
  }
}
</style>
