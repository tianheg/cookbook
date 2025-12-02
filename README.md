# Cookbook App with Cloudflare D1

A recipe management application built with Astro and Cloudflare D1 as the database.

## Features

- 📖 Browse recipes with categories and difficulty levels
- ➕ Add new recipes with ingredients and step-by-step instructions
- 🔍 View detailed recipe pages
- 🗑️ Delete recipes
- 🎨 Beautiful UI with DaisyUI and Tailwind CSS
- ⚡ Fast and deployed on Cloudflare Workers

## Setup Instructions

### 1. Create D1 Database

First, create a D1 database:

```bash
npx wrangler d1 create cookbook-db
```

Copy the database ID from the output and update `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "cookbook-db",
    "database_id": "YOUR_DATABASE_ID_HERE"
  }
]
```

### 2. Initialize Database Schema

Run the schema migration to create tables and insert sample data:

```bash
npx wrangler d1 execute cookbook-db --remote --file=./schema.sql
```

For local development:

```bash
npx wrangler d1 execute cookbook-db --local --file=./schema.sql
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:4321`

### 5. Deploy

Build and deploy to Cloudflare:

```bash
pnpm deploy
```

## Database Schema

### Tables

- **recipes**: Main recipe information (title, description, times, difficulty, category)
- **ingredients**: Recipe ingredients with amounts and units
- **instructions**: Step-by-step cooking instructions

## API Endpoints

- `GET /api/recipes` - List all recipes (supports ?category and ?difficulty filters)
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/[id]` - Get recipe details
- `DELETE /api/recipes/[id]` - Delete a recipe

## Tech Stack

- **Framework**: Astro
- **Database**: Cloudflare D1 (SQLite)
- **Styling**: Tailwind CSS + DaisyUI
- **Hosting**: Cloudflare Workers
- **TypeScript**: Full type safety

## Project Structure

```
src/
├── pages/
│   ├── index.astro           # Recipe list page
│   ├── recipes/
│   │   ├── [id].astro        # Recipe detail page
│   │   └── new.astro         # Add recipe form
│   └── api/
│       ├── recipes.ts        # List & create recipes
│       └── recipes/[id].ts   # Get & delete recipe
├── layouts/
│   └── Layout.astro          # Base layout
└── types.ts                  # TypeScript types

schema.sql                     # Database schema & sample data
wrangler.jsonc                 # Cloudflare configuration
```

## Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm deploy` - Deploy to Cloudflare
- `pnpm cf-typegen` - Generate Cloudflare types

Enjoy cooking! 👨‍🍳
