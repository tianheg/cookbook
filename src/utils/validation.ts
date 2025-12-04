/**
 * Validation utilities and error handling
 */

import { ZodError } from 'zod';

export function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

export function getZodErrorMessage(error: ZodError): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message || 'Validation failed';
}

export function validateEnvironmentVar(value: any, name: string): boolean {
  if (!value) {
    console.error(`Missing environment variable: ${name}`);
    return false;
  }
  return true;
}
