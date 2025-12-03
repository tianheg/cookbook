// Re-export types from the database schema for backwards compatibility
export type {
  Recipe,
  NewRecipe,
  Ingredient,
  NewIngredient,
  Instruction,
  NewInstruction,
  RecipeWithDetails,
  CreateRecipeInput,
  UpdateRecipeInput,
} from './db/schema';

