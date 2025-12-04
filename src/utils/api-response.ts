/**
 * Standard API response helpers to reduce duplication across routes
 */

export const ApiResponse = {
  success: (data: any, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),

  error: (message: string, status = 400, details?: any) =>
    new Response(
      JSON.stringify({
        error: message,
        ...(details && { details }),
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    ),

  created: (data: any) =>
    ApiResponse.success(data, 201),

  notFound: () =>
    ApiResponse.error('Not found', 404),

  unauthorized: () =>
    ApiResponse.error('Unauthorized', 401),

  badRequest: (message: string, details?: any) =>
    ApiResponse.error(message, 400, details),

  internalError: (message = 'Internal server error') =>
    ApiResponse.error(message, 500),

  serviceUnavailable: () =>
    ApiResponse.error('Service unavailable', 503),
};
