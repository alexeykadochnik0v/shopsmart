<template>
  <v-dialog v-model="showDialog" max-width="500px" @update:model-value="handleDialogUpdate">
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
                  @keyup.enter="addIngredient"
                />
                <v-btn
                  icon
                  variant="text"
                  color="primary"
                  class="ml-2"
                  @click="addIngredient"
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
                      @click="removeIngredient(index)"
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
        <v-btn
          color="error"
          variant="text"
          prepend-icon="mdi-delete"
          @click="confirmDelete"
          class="text-none"
        >
          Удалить рецепт
        </v-btn>
        <v-spacer />
        <v-btn
          color="secondary"
          variant="text"
          @click="close"
          class="text-none"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          @click="save"
          :disabled="!isValid"
          class="text-none"
          :loading="saving"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Диалог подтверждения удаления -->
  <v-dialog v-model="showDeleteConfirm" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-error d-flex align-center">
        <v-icon icon="mdi-alert" class="mr-2" color="error" />
        Удалить рецепт?
      </v-card-title>
      <v-card-text class="pt-3">
        Вы уверены, что хотите удалить рецепт "{{ props.recipe.name }}"? Это действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          variant="text"
          @click="showDeleteConfirm = false"
          class="text-none"
        >
          Отмена
        </v-btn>
        <v-btn
          color="error"
          @click="deleteRecipe"
          class="text-none"
          :loading="deleting"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import type { Recipe } from '../stores/recipe';

const props = defineProps<{
  recipe: Recipe;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const recipeStore = useRecipeStore();
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const showDeleteConfirm = ref(false);
const editedName = ref('');
const editedIngredients = ref<string[]>([]);
const newIngredient = ref('');
const saving = ref(false);
const deleting = ref(false);

const isValid = computed(() => {
  return editedName.value.trim() !== '' && editedIngredients.value.length > 0;
});

watch(showDialog, (newValue) => {
  if (newValue) {
    editedName.value = props.recipe.name;
    editedIngredients.value = [...props.recipe.ingredients];
  }
});

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    editedIngredients.value.push(newIngredient.value.trim());
    newIngredient.value = '';
  }
};

const removeIngredient = (index: number) => {
  editedIngredients.value.splice(index, 1);
};

const save = async () => {
  saving.value = true;
  try {
    recipeStore.updateRecipe({
      ...props.recipe,
      name: editedName.value.trim(),
      ingredients: editedIngredients.value
    });
    close();
  } finally {
    saving.value = false;
  }
};

const close = () => {
  showDialog.value = false;
  editedName.value = '';
  editedIngredients.value = [];
  newIngredient.value = '';
  showDeleteConfirm.value = false;
  saving.value = false;
  deleting.value = false;
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const deleteRecipe = async () => {
  deleting.value = true;
  try {
    recipeStore.removeRecipe(props.recipe.id);
    close();
  } finally {
    deleting.value = false;
  }
};

const handleDialogUpdate = (value: boolean) => {
  if (!value) {
    close();
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
