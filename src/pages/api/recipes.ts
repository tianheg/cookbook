import type { APIRoute } from 'astro';
import type { Recipe } from '../../types';

export const GET: APIRoute = async ({ request, locals }) => {
  const DB = locals.runtime?.env?.DB as D1Database | undefined;
  
  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  try {
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params: string[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY created_at DESC';

    const { results } = await DB.prepare(query).bind(...params).all<Recipe>();

    return new Response(JSON.stringify({ recipes: results }), {
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
  const DB = locals.runtime?.env?.DB as D1Database | undefined;

  if (!DB) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const { title, description, prep_time, cook_time, servings, difficulty, category, ingredients, instructions } = data;

    // Start a transaction-like operation
    const recipeResult = await DB.prepare(
      `INSERT INTO recipes (title, description, prep_time, cook_time, servings, difficulty, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`
    )
      .bind(title, description, prep_time, cook_time, servings, difficulty, category)
      .first<{ id: number }>();

    if (!recipeResult) {
      throw new Error('Failed to create recipe');
    }

    const recipeId = recipeResult.id;

    // Insert ingredients
    if (ingredients && Array.isArray(ingredients)) {
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        await DB.prepare(
          'INSERT INTO ingredients (recipe_id, name, amount, unit, sort_order) VALUES (?, ?, ?, ?, ?)'
        ).bind(recipeId, ing.name, ing.amount, ing.unit || null, i).run();
      }
    }

    // Insert instructions
    if (instructions && Array.isArray(instructions)) {
      for (let i = 0; i < instructions.length; i++) {
        const inst = instructions[i];
        await DB.prepare(
          'INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)'
        ).bind(recipeId, i + 1, inst).run();
      }
    }

    return new Response(JSON.stringify({ success: true, recipeId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return new Response(JSON.stringify({ error: 'Failed to create recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
