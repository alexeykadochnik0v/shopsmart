import { defineStore } from 'pinia';

const STORAGE_KEY = 'shopsmart_shopping_list';

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
}

export const useShoppingStore = defineStore('shopping', {
  state: () => ({
    items: [] as ShoppingItem[],
  }),

  getters: {
    sortedItems: (state) => {
      return [...state.items].sort((a, b) => {
        // Сначала сортируем по статусу (незавершенные сверху)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // В рамках одного статуса сохраняем порядок добавления
        return a.timestamp - b.timestamp;
      });
    },
    
    completedItems: (state) => {
      return state.items.filter(item => item.completed);
    },

    activeItems: (state) => {
      return state.items.filter(item => !item.completed);
    },
  },

  actions: {
    initializeStore() {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
    },

    addItem(text: string) {
      const normalizedText = text.trim().toLowerCase();
      const existingItem = this.items.find(item => 
        item.text.toLowerCase() === normalizedText
      );

      if (existingItem) {
        if (existingItem.completed) {
          existingItem.completed = false;
          this.saveToLocalStorage();
        }
        return;
      }

      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        timestamp: Date.now(),
      };
      
      // Добавляем новый элемент в начало списка активных элементов
      const lastActiveIndex = this.items.findIndex(item => item.completed);
      if (lastActiveIndex === -1) {
        this.items.push(newItem);
      } else {
        this.items.splice(lastActiveIndex, 0, newItem);
      }
      
      this.saveToLocalStorage();
    },

    toggleItem(id: string) {
      const item = this.items.find(item => item.id === id);
      if (item) {
        item.completed = !item.completed;
        // Перемещаем элемент в соответствующую часть списка
        const itemIndex = this.items.findIndex(i => i.id === id);
        this.items.splice(itemIndex, 1);
        
        if (item.completed) {
          this.items.push(item); // В конец списка если завершен
        } else {
          const lastActiveIndex = this.items.findIndex(i => i.completed);
          if (lastActiveIndex === -1) {
            this.items.push(item);
          } else {
            this.items.splice(lastActiveIndex, 0, item);
          }
        }
        
        this.saveToLocalStorage();
      }
    },

    deleteItem(id: string) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveToLocalStorage();
    },

    clearCompleted() {
      this.items = this.items.filter(item => !item.completed);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    },
  },
});