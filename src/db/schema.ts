import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

// Recipe table
export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  prepTime: integer('prep_time'),
  cookTime: integer('cook_time'),
  servings: integer('servings'),
  difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }),
  category: text('category'),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Ingredients table
export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  amount: text('amount').notNull(),
  unit: text('unit'),
  sortOrder: integer('sort_order').notNull().default(0),
});

// Instructions table
export const instructions = sqliteTable('instructions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  stepNumber: integer('step_number').notNull(),
  instruction: text('instruction').notNull(),
});

// Zod schemas for validation
export const insertRecipeSchema = createInsertSchema(recipes, {
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const selectRecipeSchema = createSelectSchema(recipes);

export const insertIngredientSchema = createInsertSchema(ingredients, {
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const insertInstructionSchema = createInsertSchema(instructions, {
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1, 'Instruction is required'),
});

// Complete recipe creation schema
export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  prepTime: z.number().int().positive().optional().nullable(),
  cookTime: z.number().int().positive().optional().nullable(),
  servings: z.number().int().positive().optional().nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().nullable(),
  category: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        amount: z.string().min(1),
        unit: z.string().optional().nullable(),
      })
    )
    .min(1, 'At least one ingredient is required'),
  instructions: z
    .array(z.string().min(1))
    .min(1, 'At least one instruction is required'),
});

export const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.number().int().positive(),
});

// Type exports
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
export type Instruction = typeof instructions.$inferSelect;
export type NewInstruction = typeof instructions.$inferInsert;

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  instructions: Instruction[];
};

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
