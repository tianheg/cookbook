import type { APIRoute } from 'astro';
import { uploadImageToR2 } from '../../db/r2';

export const POST: APIRoute = async ({ request, locals }) => {
  const bucket = (locals.runtime as any)?.env?.RECIPES_BUCKET as R2Bucket | undefined;

  if (!bucket) {
    return new Response(JSON.stringify({ error: 'R2 bucket not available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const recipeName = formData.get('recipeName') as string | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'File is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!recipeName) {
      return new Response(
        JSON.stringify({ error: 'Recipe name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Upload to R2
    const imageUrl = await uploadImageToR2(bucket, file, recipeName);

    return new Response(
      JSON.stringify({ success: true, imageUrl }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Upload error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
