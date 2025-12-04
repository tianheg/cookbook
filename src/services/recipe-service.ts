/**
 * Recipe service - handles all recipe-related business logic
 */

import { getDB } from '../db/client';
import {
  getRecipes,
  getRecipeById,
  getRecipeWithDetails,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  searchRecipesByIngredients,
  searchRecipesByInstructions,
} from '../db/queries';
import type { CreateRecipeInput, UpdateRecipeInput, RecipeWithDetails } from '../db/schema';

export class RecipeService {
  private db;

  constructor(dbInstance: D1Database) {
    this.db = getDB(dbInstance);
  }

  async listRecipes(filters?: { category?: string; difficulty?: string }) {
    return getRecipes(this.db, filters);
  }

  async getRecipe(id: number) {
    return getRecipeById(this.db, id);
  }

  async getRecipeWithDetails(id: number): Promise<RecipeWithDetails | null> {
    return getRecipeWithDetails(this.db, id);
  }

  async createRecipe(data: CreateRecipeInput) {
    return createRecipe(this.db, data);
  }

  async updateRecipe(id: number, data: UpdateRecipeInput) {
    return updateRecipe(this.db, id, data);
  }

  async deleteRecipe(id: number) {
    return deleteRecipe(this.db, id);
  }

  async searchRecipes(query: string, filters?: { category?: string; difficulty?: string }) {
    return searchRecipes(this.db, query, filters);
  }

  async searchByIngredients(query: string) {
    return searchRecipesByIngredients(this.db, query);
  }

  async searchByInstructions(query: string) {
    return searchRecipesByInstructions(this.db, query);
  }
}
