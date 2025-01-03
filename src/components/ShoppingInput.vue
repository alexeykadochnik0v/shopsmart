<template>
  <div class="input-group">
    <input 
      v-model="itemName" 
      @keyup.enter="addItem"
      placeholder="Добавить продукт..."
    />
    <button @click="addItem">Добавить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShoppingStore } from '../stores/shopping';

const store = useShoppingStore();
const itemName = ref('');

const addItem = () => {
  if (itemName.value.trim()) {
    store.addItem(itemName.value.trim());
    itemName.value = '';
  }
};
</script>

<style scoped>
.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
