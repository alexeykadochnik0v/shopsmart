import { defineStore } from 'pinia';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
}

const STORAGE_KEY = 'shopsmart_recipes';

// Предустановленные рецепты
const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'default-1',
    name: 'Борщ',
    ingredients: [
      'Свекла',
      'Капуста',
      'Морковь',
      'Картофель',
      'Лук',
      'Томатная паста',
      'Мясо',
      'Чеснок',
      'Зелень',
      'Сметана'
    ]
  },
  {
    id: 'default-2',
    name: 'Оливье',
    ingredients: [
      'Картофель',
      'Морковь',
      'Яйца',
      'Колбаса',
      'Горошек консервированный',
      'Огурцы маринованные',
      'Майонез',
      'Лук'
    ]
  },
  {
    id: 'default-3',
    name: 'Паста Карбонара',
    ingredients: [
      'Спагетти',
      'Бекон',
      'Яйца',
      'Сыр пармезан',
      'Чеснок',
      'Черный перец',
      'Соль'
    ]
  },
  {
    id: 'default-4',
    name: 'Цезарь с курицей',
    ingredients: [
      'Салат романо',
      'Куриная грудка',
      'Сыр пармезан',
      'Хлеб для сухариков',
      'Чеснок',
      'Соус цезарь',
      'Помидоры черри'
    ]
  }
];

// Абстракция для хранилища данных, чтобы легко переключиться на Firebase
interface StorageAdapter {
  getRecipes(): Recipe[];
  saveRecipes(recipes: Recipe[]): void;
}

// Реализация для localStorage
class LocalStorageAdapter implements StorageAdapter {
  getRecipes(): Recipe[] {
    const recipes = localStorage.getItem(STORAGE_KEY);
    return recipes ? JSON.parse(recipes) : DEFAULT_RECIPES;
  }

  saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }
}

// В будущем можно будет создать FirebaseAdapter, реализующий тот же интерфейс
export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[],
    storage: new LocalStorageAdapter(),
  }),

  actions: {
    initializeStore() {
      this.recipes = this.storage.getRecipes();
    },

    addRecipe(recipe: Recipe) {
      this.recipes.unshift(recipe);
      this.storage.saveRecipes(this.recipes);
    },

    removeRecipe(id: string) {
      this.recipes = this.recipes.filter(recipe => recipe.id !== id);
      this.storage.saveRecipes(this.recipes);
    },

    updateRecipe(updatedRecipe: Recipe) {
      const index = this.recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
      if (index !== -1) {
        this.recipes[index] = updatedRecipe;
        this.storage.saveRecipes(this.recipes);
      }
    },
  },
});
