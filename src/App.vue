<template>
  <v-app>
    <v-app-bar
      :color="theme.global.current.value.dark ? 'background' : 'surface'"
      elevation="1"
    >
      <v-app-bar-title class="d-flex align-center">
        <v-icon icon="mdi-cart-outline" class="mr-2" />
        <span class="hidden-sm-and-down">Умный список покупок</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        icon
        class="hidden-sm-and-down"
        @click="showAddRecipeDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      
      <v-btn
        icon
        @click="toggleTheme"
      >
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn
        icon
        class="hidden-md-and-up"
        @click="drawer = true"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Мобильное меню -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">Меню</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-plus"
          @click="showAddRecipeDialog = true"
        >
          Добавить рецепт
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="app-content">
        <ShoppingList />
        <RecipePanel :recipes="recipeStore.recipes" />
      </div>
    </v-main>

    <AddRecipeDialog 
      v-model="showAddRecipeDialog"
      @close="showAddRecipeDialog = false"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useShoppingStore } from './stores/shopping';
import { useRecipeStore } from './stores/recipe';
import AddRecipeDialog from './components/AddRecipeDialog.vue';
import ShoppingList from './components/ShoppingList.vue';
import RecipePanel from './components/RecipePanel.vue';

const THEME_KEY = 'shopsmart_theme';
const theme = useTheme();
const shoppingStore = useShoppingStore();
const recipeStore = useRecipeStore();
const drawer = ref(false);
const showAddRecipeDialog = ref(false);

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem(THEME_KEY, newTheme);
};

onMounted(() => {
  // Загружаем сохраненную тему
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }

  shoppingStore.initializeStore();
  recipeStore.initializeStore();

  // Устанавливаем цвет фона для всей страницы
  document.documentElement.style.backgroundColor = 'rgb(var(--v-theme-background))';
});
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(var(--v-theme-background));
}

.v-application {
  font-family: 'Roboto', sans-serif !important;
  line-height: 1.6;
  background-color: rgb(var(--v-theme-background));
}

.app-content {
  display: grid;
  gap: 2rem;
  padding: 2rem;
  min-height: 100%;
  background-color: rgb(var(--v-theme-background));
}

@media (min-width: 960px) {
  .app-content {
    grid-template-columns: 1.5fr 1fr;
    max-width: 1600px;
    margin: 0 auto;
  }
}

@media (max-width: 959px) {
  .app-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .v-list-item {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
