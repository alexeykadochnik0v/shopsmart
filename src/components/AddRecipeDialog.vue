<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @update:model-value="handleDialogUpdate"
  >
    <template v-slot:activator="{ props: dialogProps }">
      <v-btn
        v-if="!$vuetify.display.smAndDown"
        color="primary"
        v-bind="dialogProps"
        class="text-none"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        Новый рецепт
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-primary pb-2">
        <span>Новый рецепт</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="recipeName"
                label="Название блюда"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-4"
                color="primary"
                bg-color="surface"
                @keyup.enter="focusIngredientInput"
              />
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center mb-4">
                <v-text-field
                  ref="ingredientInput"
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
              
              <v-list v-if="ingredients.length" class="bg-surface rounded-lg mb-4">
                <v-list-item
                  v-for="(ingredient, index) in ingredients"
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

              <div v-else class="text-caption text-secondary mb-4">
                Добавьте хотя бы один ингредиент
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
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
          Создать
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRecipeStore } from '../stores/recipe';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  modelValue?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const display = useDisplay();
const recipeStore = useRecipeStore();

// Используем локальное состояние для диалога
const dialog = computed({
  get: () => props.modelValue ?? false,
  set: (value) => {
    emit('update:modelValue', value);
    if (!value) emit('close');
  }
});

const recipeName = ref('');
const ingredients = ref<string[]>([]);
const newIngredient = ref('');
const saving = ref(false);
const ingredientInput = ref<HTMLElement | null>(null);

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    close();
  }
});

const isValid = computed(() => {
  return recipeName.value.trim() !== '' && ingredients.value.length > 0;
});

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    ingredients.value.push(newIngredient.value.trim());
    newIngredient.value = '';
  }
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const focusIngredientInput = () => {
  if (ingredientInput.value) {
    (ingredientInput.value as any).$el.querySelector('input').focus();
  }
};

const save = async () => {
  if (!isValid.value) return;
  
  saving.value = true;
  try {
    recipeStore.addRecipe({
      id: crypto.randomUUID(),
      name: recipeName.value.trim(),
      ingredients: [...ingredients.value]
    });
    close();
  } finally {
    saving.value = false;
  }
};

const close = () => {
  dialog.value = false;
  recipeName.value = '';
  ingredients.value = [];
  newIngredient.value = '';
  saving.value = false;
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
