import { eq, desc, and } from 'drizzle-orm';
import type { DB } from './client';
import { recipes, ingredients, instructions } from './schema';
import type {
  Recipe,
  RecipeWithDetails,
  CreateRecipeInput,
  UpdateRecipeInput,
} from './schema';

// Get all recipes with optional filters
export async function getRecipes(
  db: DB,
  filters?: { category?: string; difficulty?: string }
) {
  let query = db.select().from(recipes).orderBy(desc(recipes.createdAt));

  if (filters?.category || filters?.difficulty) {
    const conditions = [];
    if (filters.category) {
      conditions.push(eq(recipes.category, filters.category));
    }
    if (filters.difficulty) {
      conditions.push(eq(recipes.difficulty, filters.difficulty as 'easy' | 'medium' | 'hard'));
    }
    return await db
      .select()
      .from(recipes)
      .where(and(...conditions))
      .orderBy(desc(recipes.createdAt));
  }

  return await query;
}

// Get single recipe by ID
export async function getRecipeById(
  db: DB,
  id: number
): Promise<Recipe | undefined> {
  const result = await db.select().from(recipes).where(eq(recipes.id, id));
  return result[0];
}

// Get recipe with all details (ingredients and instructions)
export async function getRecipeWithDetails(
  db: DB,
  id: number
): Promise<RecipeWithDetails | null> {
  const recipe = await getRecipeById(db, id);
  if (!recipe) return null;

  const recipeIngredients = await db
    .select()
    .from(ingredients)
    .where(eq(ingredients.recipeId, id))
    .orderBy(ingredients.sortOrder);

  const recipeInstructions = await db
    .select()
    .from(instructions)
    .where(eq(instructions.recipeId, id))
    .orderBy(instructions.stepNumber);

  return {
    ...recipe,
    ingredients: recipeIngredients,
    instructions: recipeInstructions,
  };
}

// Create a new recipe with ingredients and instructions
export async function createRecipe(
  db: DB,
  data: CreateRecipeInput
): Promise<number> {
  // Insert recipe
  const [recipe] = await db
    .insert(recipes)
    .values({
      title: data.title,
      description: data.description,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      difficulty: data.difficulty,
      category: data.category,
      imageUrl: data.imageUrl,
    })
    .returning({ id: recipes.id });

  const recipeId = recipe.id;

  // Insert ingredients
  if (data.ingredients && data.ingredients.length > 0) {
    await db.insert(ingredients).values(
      data.ingredients.map((ing, index) => ({
        recipeId,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        sortOrder: index,
      }))
    );
  }

  // Insert instructions
  if (data.instructions && data.instructions.length > 0) {
    await db.insert(instructions).values(
      data.instructions.map((inst, index) => ({
        recipeId,
        stepNumber: index + 1,
        instruction: inst,
      }))
    );
  }

  return recipeId;
}

// Update a recipe
export async function updateRecipe(
  db: DB,
  id: number,
  data: Partial<CreateRecipeInput>
): Promise<boolean> {
  // Update recipe
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
  if (data.cookTime !== undefined) updateData.cookTime = data.cookTime;
  if (data.servings !== undefined) updateData.servings = data.servings;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

  if (Object.keys(updateData).length > 0) {
    await db.update(recipes).set(updateData).where(eq(recipes.id, id));
  }

  // Update ingredients if provided
  if (data.ingredients) {
    // Delete existing ingredients
    await db.delete(ingredients).where(eq(ingredients.recipeId, id));
    
    // Insert new ingredients
    if (data.ingredients.length > 0) {
      await db.insert(ingredients).values(
        data.ingredients.map((ing, index) => ({
          recipeId: id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          sortOrder: index,
        }))
      );
    }
  }

  // Update instructions if provided
  if (data.instructions) {
    // Delete existing instructions
    await db.delete(instructions).where(eq(instructions.recipeId, id));
    
    // Insert new instructions
    if (data.instructions.length > 0) {
      await db.insert(instructions).values(
        data.instructions.map((inst, index) => ({
          recipeId: id,
          stepNumber: index + 1,
          instruction: inst,
        }))
      );
    }
  }

  return true;
}

// Delete a recipe (cascade delete will handle ingredients and instructions)
export async function deleteRecipe(db: DB, id: number): Promise<boolean> {
  await db.delete(recipes).where(eq(recipes.id, id));
  return true;
}

// Get unique categories
export async function getCategories(db: DB): Promise<string[]> {
  const result = await db
    .selectDistinct({ category: recipes.category })
    .from(recipes)
    .where(eq(recipes.category, recipes.category));
  
  return result
    .map((r) => r.category)
    .filter((c): c is string => c !== null && c !== '');
}
