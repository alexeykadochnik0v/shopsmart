<template>
  <v-list class="shopping-items" :lines="false">
    <TransitionGroup name="list">
      <v-list-item
        v-for="item in sortedItems"
        :key="item.id"
        :value="item"
        class="px-0 shopping-item"
        :active="false"
        :hover="false"
        :color="theme.global.current.value.dark ? 'background' : 'surface'"
        @click="toggleItem(item)"
      >
        <template v-slot:prepend>
          <v-checkbox
            v-model="item.completed"
            hide-details
            color="primary"
            density="compact"
            @click.stop
            @change="updateItem(item)"
          />
        </template>

        <v-list-item-title 
          :class="{ 
            'text-decoration-line-through': item.completed,
            'text-disabled': item.completed
          }"
          class="shopping-item-text"
        >
          {{ item.text }}
        </v-list-item-title>

        <template v-slot:append>
          <v-btn
            icon
            variant="text"
            size="small"
            color="error"
            @click.stop="deleteItem(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </TransitionGroup>
  </v-list>

  <v-fade-transition>
    <div
      v-if="completedItems.length > 0"
      class="d-flex justify-end mt-4 px-4"
    >
      <v-btn
        color="error"
        variant="text"
        prepend-icon="mdi-delete-sweep"
        @click="clearCompleted"
      >
        Удалить завершенные
      </v-btn>
    </div>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useShoppingStore } from '../stores/shopping';
import type { ShoppingItem } from '../stores/shopping';

const theme = useTheme();
const store = useShoppingStore();

const props = defineProps<{
  items: ShoppingItem[]
}>();

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => {
    if (a.completed === b.completed) {
      // Если оба элемента завершены или оба не завершены,
      // сортируем по времени добавления (id содержит timestamp)
      return b.id.localeCompare(a.id);
    }
    // Незавершенные элементы всегда сверху
    return a.completed ? 1 : -1;
  });
});

const completedItems = computed(() => {
  return props.items.filter(item => item.completed);
});

const toggleItem = (item: ShoppingItem) => {
  store.updateItem({
    ...item,
    completed: !item.completed
  });
};

const updateItem = (item: ShoppingItem) => {
  store.updateItem(item);
};

const deleteItem = (item: ShoppingItem) => {
  store.deleteItem(item.id);
};

const clearCompleted = () => {
  store.clearCompleted();
};
</script>

<style scoped>
.shopping-items {
  background: transparent !important;
}

.shopping-item {
  min-height: 40px !important;
  cursor: pointer;
}

.shopping-item:hover {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.shopping-item-text {
  text-align: left;
  padding-left: 8px;
}

/* Анимации для списка */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

@media (max-width: 959px) {
  .shopping-item {
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
