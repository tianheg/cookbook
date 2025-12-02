import type { APIRoute } from 'astro';
import type { Recipe, Ingredient, Instruction, RecipeWithDetails } from '../../../types';

export const GET: APIRoute = async ({ params, locals }) => {
  const DB = locals.runtime?.env?.DB as D1Database | undefined;
  const { id } = params;

  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch recipe
    const recipe = await DB.prepare('SELECT * FROM recipes WHERE id = ?')
      .bind(id)
      .first<Recipe>();

    if (!recipe) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch ingredients
    const { results: ingredients } = await DB.prepare(
      'SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order'
    )
      .bind(id)
      .all<Ingredient>();

    // Fetch instructions
    const { results: instructions } = await DB.prepare(
      'SELECT * FROM instructions WHERE recipe_id = ? ORDER BY step_number'
    )
      .bind(id)
      .all<Instruction>();

    const recipeWithDetails: RecipeWithDetails = {
      ...recipe,
      ingredients: ingredients || [],
      instructions: instructions || [],
    };

    return new Response(JSON.stringify({ recipe: recipeWithDetails }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const DB = locals.runtime?.env?.DB as D1Database | undefined;
  const { id } = params;

  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: 'Recipe ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await DB.prepare('DELETE FROM recipes WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
