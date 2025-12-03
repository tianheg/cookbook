import type { APIRoute } from 'astro';
import { getDB } from '../../db/client';
import { getRecipes, createRecipe } from '../../db/queries';
import { createRecipeSchema } from '../../db/schema';
import { ZodError } from 'zod';

export const GET: APIRoute = async ({ request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;
  
  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const difficulty = searchParams.get('difficulty') || undefined;

  try {
    const db = getDB(DB);
    const recipes = await getRecipes(db, { category, difficulty });

    return new Response(JSON.stringify({ recipes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch recipes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;

  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    
    // Validate input with Zod
    const validated = createRecipeSchema.parse(data);
    
    const db = getDB(DB);
    const recipeId = await createRecipe(db, validated);

    return new Response(JSON.stringify({ success: true, recipeId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation error', 
          details: error.issues 
        }), 
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(JSON.stringify({ error: 'Failed to create recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
