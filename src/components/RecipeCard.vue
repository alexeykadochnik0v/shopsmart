<template>
  <div>
    <v-card
      variant="flat"
      :color="theme.global.current.value.dark ? 'background' : 'surface'"
      class="mb-3 mb-sm-4 recipe-card"
      elevation="0"
      rounded="lg"
    >
      <v-card-title class="d-flex align-center py-2 py-sm-3 px-3 px-sm-4 justify-space-between">
        <v-btn
          variant="text"
          class="text-none flex-grow-1 justify-start pa-1 pa-sm-2 text-secondary font-weight-medium"
          @click="addAllIngredients"
        >
          <v-icon
            icon="mdi-playlist-plus"
            class="mr-2"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'default' : 'large'"
          />
          <span class="text-body-2 text-sm-body-1">{{ recipe.name }}</span>
        </v-btn>

        <div class="d-flex align-center">
          <v-btn
            icon
            variant="text"
            color="primary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
            class="mr-2"
            @click="showEditDialog = true"
          >
            <v-icon icon="mdi-pencil" />
          </v-btn>

          <v-btn
            icon
            variant="text"
            @click="isExpanded = !isExpanded"
            color="secondary"
            :size="$vuetify.display.smAndDown ? 'x-small' : 'small'"
          >
            <v-icon :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </v-btn>
        </div>
      </v-card-title>

      <v-expand-transition>
        <div v-if="isExpanded">
          <v-divider></v-divider>
          <v-list class="py-1 py-sm-2" :color="theme.global.current.value.dark ? 'background' : 'surface'">
            <v-list-item
              v-for="ingredient in recipe.ingredients"
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
    </v-card>

    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-primary pb-2">
          <span>Редактировать рецепт</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedName"
                  label="Название блюда"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  class="mb-4"
                  color="primary"
                  bg-color="surface"
                />
              </v-col>
              <v-col cols="12">
                <div class="d-flex align-center mb-4">
                  <v-text-field
                    v-model="newIngredient"
                    label="Добавить ингредиент"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    class="flex-grow-1"
                    color="primary"
                    bg-color="surface"
                    @keyup.enter="addEditedIngredient"
                  />
                  <v-btn
                    icon
                    variant="text"
                    color="primary"
                    class="ml-2"
                    @click="addEditedIngredient"
                    :disabled="!newIngredient"
                  >
                    <v-icon icon="mdi-plus" />
                  </v-btn>
                </div>
                
                <v-list v-if="editedIngredients.length" class="bg-surface rounded-lg">
                  <v-list-item
                    v-for="(ingredient, index) in editedIngredients"
                    :key="index"
                    density="compact"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        icon="mdi-close"
                        size="small"
                        color="error"
                        class="mr-2 cursor-pointer"
                        @click="removeEditedIngredient(index)"
                      />
                    </template>
                    <v-list-item-title class="text-secondary">{{ ingredient }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="secondary"
            variant="text"
            @click="closeEditDialog"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            @click="saveEditedRecipe"
            :disabled="!isValidEdit"
          >
            Сохранить изменения
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useShoppingStore } from '../stores/shopping';
import { useRecipeStore } from '../stores/recipe';
import type { Recipe } from '../stores/recipe';

const props = defineProps<{
  recipe: Recipe
}>();

const theme = useTheme();
const isExpanded = ref(false);
const showEditDialog = ref(false);
const shoppingStore = useShoppingStore();
const recipeStore = useRecipeStore();

// Состояние для редактирования
const editedName = ref('');
const editedIngredients = ref<string[]>([]);
const newIngredient = ref('');

const isValidEdit = computed(() => {
  return editedName.value.trim() !== '' && editedIngredients.value.length > 0;
});

const addAllIngredients = () => {
  props.recipe.ingredients.forEach(ingredient => {
    shoppingStore.addItem(ingredient);
  });
};

const addIngredient = (ingredient: string) => {
  shoppingStore.addItem(ingredient);
};

// Методы для редактирования
watch(showEditDialog, (newValue) => {
  if (newValue) {
    editedName.value = props.recipe.name;
    editedIngredients.value = [...props.recipe.ingredients];
  }
});

const addEditedIngredient = () => {
  if (newIngredient.value.trim()) {
    editedIngredients.value.push(newIngredient.value.trim());
    newIngredient.value = '';
  }
};

const removeEditedIngredient = (index: number) => {
  editedIngredients.value.splice(index, 1);
};

const saveEditedRecipe = () => {
  recipeStore.updateRecipe({
    id: props.recipe.id,
    name: editedName.value.trim(),
    ingredients: [...editedIngredients.value]
  });
  closeEditDialog();
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  editedName.value = '';
  editedIngredients.value = [];
  newIngredient.value = '';
};
</script>

<style scoped>
.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.v-card-title {
  line-height: 1.2;
}

.cursor-pointer {
  cursor: pointer;
}

.v-card {
  margin-bottom: 8px;
}

.recipe-card {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 959px) {
  .v-card {
    margin: 0;
    border-radius: 0 !important;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1) !important;
  }
}

@media (max-width: 600px) {
  .v-list-item {
    padding: 4px 8px !important;
  }
  
  .v-card-title {
    padding: 8px !important;
  }

  :deep(.v-card) {
    border-radius: 0 !important;
  }
}
</style>
