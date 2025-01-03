<template>
  <div class="shopping-list">
    <h2 class="text-h6 mb-4 px-4">Список покупок</h2>
    <div class="d-flex align-center mb-4 px-4">
      <v-text-field
        v-model="newItem"
        label="Добавить в список покупок"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="flex-grow-1"
        color="primary"
        bg-color="surface"
        @keyup.enter="addItem"
      />
      <v-btn
        icon
        variant="text"
        color="primary"
        class="ml-2"
        @click="addItem"
        :disabled="!newItem"
      >
        <v-icon icon="mdi-plus" />
      </v-btn>
    </div>

    <ShoppingItems
      :items="shoppingStore.items"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShoppingStore } from '../stores/shopping';
import ShoppingItems from './ShoppingItems.vue';

const shoppingStore = useShoppingStore();
const newItem = ref('');

const addItem = () => {
  if (newItem.value.trim()) {
    shoppingStore.addItem(newItem.value);
    newItem.value = '';
  }
};
</script>

<style scoped>
.shopping-list {
  padding: 1rem;
}

@media (max-width: 959px) {
  .shopping-list {
    padding: 1rem 0;
  }
  .shopping-list h2, .shopping-list .d-flex {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
