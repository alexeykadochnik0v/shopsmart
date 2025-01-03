<template>
  <v-app>
    <v-app-bar
      :elevation="0"
      class="px-3"
      :color="theme.global.current.value.dark ? 'background' : 'surface'"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
        :class="{ 'rotate-180': drawer }"
        class="transition-transform"
      />

      <v-app-bar-title class="text-primary font-weight-bold">
        ShopSmart
      </v-app-bar-title>

      <template v-slot:append>
        <div class="d-flex align-center gap-4">
          <AddRecipeDialog v-if="!$vuetify.display.smAndDown" />
          <v-btn
            icon
            @click="toggleTheme"
          >
            <v-icon>{{ theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <!-- Мобильное меню -->
    <v-navigation-drawer
      v-if="$vuetify.display.smAndDown"
      v-model="drawer"
      temporary
      location="bottom"
      height="90vh"
      class="rounded-t-xl"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-plus"
          @click="showAddRecipeDialog = true; drawer = false"
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
      v-if="$vuetify.display.smAndDown"
      v-model="showAddRecipeDialog"
      @close="showAddRecipeDialog = false"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import AddRecipeDialog from './components/AddRecipeDialog.vue';
import ShoppingList from './components/ShoppingList.vue';
import RecipePanel from './components/RecipePanel.vue';
import { useShoppingStore } from './stores/shopping';
import { useRecipeStore } from './stores/recipe';

const theme = useTheme();
const drawer = ref(false);
const showAddRecipeDialog = ref(false);
const shoppingStore = useShoppingStore();
const recipeStore = useRecipeStore();

const THEME_KEY = 'shopsmart_theme';

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
.rotate-180 {
  transform: rotate(180deg);
}

.transition-transform {
  transition: transform 0.2s ease-in-out;
}

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(var(--v-theme-background));
}

.v-application {
  background-color: rgb(var(--v-theme-background)) !important;
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
}

.gap-4 {
  gap: 1rem;
}
</style>
