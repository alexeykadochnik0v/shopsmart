<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ isEditing ? 'Редактировать рецепт' : 'Новый рецепт' }}
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form ref="form" @submit.prevent="saveRecipe">
          <v-text-field
            v-model="recipe.name"
            label="Название рецепта"
            :rules="[v => !!v || 'Обязательное поле']"
            required
          />

          <v-combobox
            v-model="ingredients"
            label="Ингредиенты"
            multiple
            chips
            closable-chips
            :rules="[v => v.length > 0 || 'Добавьте хотя бы один ингредиент']"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                v-bind="props"
                :closable="true"
                @click:close="removeIngredient(item)"
              >
                {{ item }}
              </v-chip>
            </template>
          </v-combobox>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="secondary"
          variant="text"
          @click="close"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          @click="saveRecipe"
          :disabled="!isValid"
        >
          {{ isEditing ? 'Сохранить изменения' : 'Сохранить' }}
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
  modelValue: boolean
  editRecipe?: Recipe
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>();

const store = useRecipeStore();
const form = ref<any>(null);
const recipe = ref<Partial<Recipe>>({
  name: '',
});
const ingredients = ref<string[]>([]);
const isEditing = computed(() => !!props.editRecipe);

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

watch(() => props.editRecipe, (recipe) => {
  if (recipe) {
    recipe.value = { name: recipe.name };
    ingredients.value = [...recipe.ingredients];
  }
}, { immediate: true });

const isValid = computed(() => {
  return recipe.value.name && ingredients.value.length > 0;
});

const removeIngredient = (item: string) => {
  ingredients.value = ingredients.value.filter(i => i !== item);
};

const saveRecipe = async () => {
  if (!form.value) return;
  
  const { valid } = await form.value.validate();
  
  if (valid) {
    if (isEditing.value) {
      store.updateRecipe({
        id: props.editRecipe?.id,
        name: recipe.value.name!,
        ingredients: ingredients.value
      });
    } else {
      store.addRecipe({
        name: recipe.value.name!,
        ingredients: ingredients.value
      });
    }
    close();
  }
};

const close = () => {
  emit('update:modelValue', false);
  emit('close');
  resetForm();
};

const resetForm = () => {
  recipe.value = { name: '' };
  ingredients.value = [];
  if (form.value) {
    form.value.reset();
  }
};
</script>
