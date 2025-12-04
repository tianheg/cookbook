import type { APIRoute } from 'astro';
import { RecipeService } from '../../services/recipe-service';
import { ApiResponse } from '../../utils/api-response';

export const GET: APIRoute = async ({ request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;

  if (!DB) {
    return ApiResponse.serviceUnavailable();
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;
  const searchType = searchParams.get('type') || 'all'; // 'all', 'ingredients', 'instructions'

  try {
    const service = new RecipeService(DB);
    let recipes;

    if (searchType === 'ingredients') {
      recipes = await service.searchByIngredients(query);
    } else if (searchType === 'instructions') {
      recipes = await service.searchByInstructions(query);
    } else {
      // Default: search in title, description, category, difficulty
      recipes = await service.searchRecipes(query, { category, difficulty });
    }

    return ApiResponse.success({ success: true, data: { recipes, count: recipes.length } });
  } catch (error) {
    console.error('Error searching recipes:', error);
    return ApiResponse.internalError('Failed to search recipes');
  }
};
