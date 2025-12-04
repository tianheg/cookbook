/**
 * Application-wide constants
 */

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const DIFFICULTY_COLORS = {
  easy: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  medium: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  hard: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
} as const;

export const FILE_CONSTRAINTS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    acceptString: 'image/jpeg,image/png,image/webp',
  },
} as const;

export const ROUTES = {
  home: '/',
  recipes: {
    list: '/recipes',
    new: '/recipes/new',
    detail: (id: number | string) => `/recipes/${id}`,
    edit: (id: number | string) => `/recipes/${id}?edit=true`,
  },
  api: {
    recipes: '/api/recipes',
    upload: '/api/upload',
  },
} as const;
