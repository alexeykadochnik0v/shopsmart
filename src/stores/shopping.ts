import { defineStore } from 'pinia';

const STORAGE_KEY = 'shopsmart_shopping_list';

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
}

export const useShoppingStore = defineStore('shopping', {
  state: () => ({
    items: [] as ShoppingItem[],
  }),

  actions: {
    initializeStore() {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
    },

    addItem(text: string) {
      if (text.trim()) {
        const newItem: ShoppingItem = {
          id: new Date().toISOString(),
          text: text.trim(),
          completed: false,
        };
        this.items.unshift(newItem);
        this.saveItems();
      }
    },

    updateItem(item: ShoppingItem) {
      const index = this.items.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.items[index] = { ...item };
        this.saveItems();
      }
    },

    deleteItem(id: string) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveItems();
    },

    clearCompleted() {
      this.items = this.items.filter(item => !item.completed);
      this.saveItems();
    },

    saveItems() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    },
  },
});