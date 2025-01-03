export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}