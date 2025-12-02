export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: number;
  recipe_id: number;
  name: string;
  amount: string;
  unit: string | null;
  sort_order: number;
}

export interface Instruction {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  instructions: Instruction[];
}
