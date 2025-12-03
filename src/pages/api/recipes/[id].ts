import type { APIRoute } from 'astro';
import { getDB } from '../../../db/client';
import { getRecipeWithDetails, deleteRecipe, updateRecipe } from '../../../db/queries';
import { createRecipeSchema } from '../../../db/schema';
import { ZodError } from 'zod';

export const GET: APIRoute = async ({ params, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;
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
    const db = getDB(DB);
    const recipe = await getRecipeWithDetails(db, parseInt(id));

    if (!recipe) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ recipe }), {
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

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;
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
    const data = await request.json();
    
    // Validate input with Zod (partial validation for updates)
    const validated = createRecipeSchema.partial().parse(data);
    
    const db = getDB(DB);
    const success = await updateRecipe(db, parseInt(id), validated);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    
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
    
    return new Response(JSON.stringify({ error: 'Failed to update recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const DB = (locals.runtime as any)?.env?.DB as D1Database | undefined;
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
    const db = getDB(DB);
    const success = await deleteRecipe(db, parseInt(id));

    if (!success) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
