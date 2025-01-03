<template>
  <v-list class="shopping-items" :lines="false">
    <TransitionGroup name="list" tag="div">
      <v-list-item
        v-for="item in store.sortedItems"
        :key="item.id"
        :class="['shopping-item', { 'completed': item.completed }]"
        class="px-0"
        :active="false"
        :hover="false"
        :color="theme.global.current.value.dark ? 'background' : 'surface'"
      >
        <template v-slot:prepend>
          <v-checkbox
            v-model="item.completed"
            @change="toggleItem(item.id)"
            hide-details
            color="primary"
            density="compact"
          />
        </template>

        <v-list-item-title
          class="shopping-item-text"
          :class="{ 'text-decoration-line-through': item.completed, 'text-disabled': item.completed }"
          @click="toggleItem(item.id)"
        >
          {{ item.text }}
        </v-list-item-title>

        <template v-slot:append>
          <v-btn
            icon
            variant="text"
            size="small"
            color="error"
            @click.stop="deleteItem(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </TransitionGroup>
  </v-list>

  <v-fade-transition>
    <div
      v-if="store.completedItems.length > 0"
      class="d-flex justify-end mt-4 px-4"
    >
      <v-btn
        color="error"
        variant="text"
        prepend-icon="mdi-delete-sweep"
        @click="store.clearCompleted"
      >
        Удалить завершенные
      </v-btn>
    </div>
  </v-fade-transition>
</template>

<script setup lang="ts">
import { useShoppingStore } from '../stores/shopping';
import { useTheme } from 'vuetify';

const theme = useTheme();
const store = useShoppingStore();

const toggleItem = (id: string) => {
  store.toggleItem(id);
};

const deleteItem = (id: string) => {
  store.deleteItem(id);
};
</script>

<style scoped>
.shopping-items {
  background: transparent !important;
}

.shopping-item {
  min-height: 40px !important;
  cursor: pointer;
  padding-right: 16px !important;

}

.shopping-item:hover {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.shopping-item-text {
  text-align: left;
  padding-left: 8px;
}

.completed {
  opacity: 0.7;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
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
