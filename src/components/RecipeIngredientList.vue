<template>
  <v-expand-transition>
    <div v-if="isExpanded">
      <v-divider></v-divider>
      <v-list class="py-1 py-sm-2" :color="theme.global.current.value.dark ? 'background' : 'surface'">
        <v-list-item
          v-for="ingredient in ingredients"
          :key="ingredient"
          @click="addIngredient(ingredient)"
          :ripple="true"
          class="my-0 my-sm-1 rounded-lg"
          color="primary"
          :min-height="$vuetify.display.smAndDown ? 36 : 44"
        >
          <template v-slot:prepend>
            <v-icon
              icon="mdi-plus-circle-outline"
              :size="$vuetify.display.smAndDown ? 'small' : 'default'"
              class="mr-2"
              color="primary"
            />
          </template>
          <v-list-item-title :class="$vuetify.display.smAndDown ? 'text-body-2' : 'text-body-1'">
            {{ ingredient }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-expand-transition>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';
import { useShoppingStore } from '../stores/shopping';

const props = defineProps<{
  ingredients: string[];
  isExpanded: boolean;
}>();

const theme = useTheme();
const shoppingStore = useShoppingStore();

const addIngredient = (ingredient: string) => {
  shoppingStore.addItem(ingredient);
};
</script>

<style scoped>
.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
