import type { APIRoute } from 'astro';
import { RecipeService } from '../../services/recipe-service';
import { createRecipeSchema } from '../../db/schema';
import { ApiResponse } from '../../utils/api-response';
import { getZodErrorMessage, formatZodErrors } from '../../utils/validation';
import { ZodError } from 'zod';

export const GET: APIRoute = async ({ request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;

  if (!DB) {
    return ApiResponse.serviceUnavailable();
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;

  try {
    const service = new RecipeService(DB);
    const recipes = await service.listRecipes({ category, difficulty });
    return ApiResponse.success({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return ApiResponse.internalError('Failed to fetch recipes');
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;

  if (!DB) {
    return ApiResponse.serviceUnavailable();
  }

  try {
    const data = await request.json();
    const validated = createRecipeSchema.parse(data);

    const service = new RecipeService(DB);
    const recipeId = await service.createRecipe(validated);

    return ApiResponse.created({ success: true, recipeId });
  } catch (error) {
    console.error('Error creating recipe:', error);

    if (error instanceof ZodError) {
      return ApiResponse.badRequest(
        getZodErrorMessage(error),
        formatZodErrors(error)
      );
    }

    return ApiResponse.internalError('Failed to create recipe');
  }
};
