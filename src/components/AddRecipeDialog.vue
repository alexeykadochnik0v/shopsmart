<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500px"
    @click:outside="close"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        Новый рецепт
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        <v-text-field
          v-model="recipeName"
          label="Название рецепта"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          @keyup.enter="focusIngredientInput"
        />

        <v-text-field
          ref="ingredientInput"
          v-model="newIngredient"
          label="Добавить ингредиент"
          append-inner-icon="mdi-plus"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-2"
          @click:append-inner="addIngredient"
          @keyup.enter="addIngredient"
        />

        <v-list v-if="ingredients.length > 0" class="pa-0 mt-2">
          <v-list-item
            v-for="(ingredient, index) in ingredients"
            :key="index"
            density="comfortable"
          >
            <template v-slot:prepend>
              <v-icon
                color="error"
                class="mr-2 cursor-pointer"
                @click="removeIngredient(index)"
              >
                mdi-close
              </v-icon>
            </template>
            <v-list-item-title>{{ ingredient }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          variant="text"
          @click="close"
          :disabled="saving"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          @click="save"
          :loading="saving"
          :disabled="!isValid"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipe';

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const recipeStore = useRecipeStore();

const recipeName = ref('');
const ingredients = ref<string[]>([]);
const newIngredient = ref('');
const saving = ref(false);
const ingredientInput = ref<HTMLElement | null>(null);

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
  emit('update:modelValue', false);
  emit('close');
  recipeName.value = '';
  ingredients.value = [];
  newIngredient.value = '';
  saving.value = false;
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
