-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  unit TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Create instructions table
CREATE TABLE IF NOT EXISTS instructions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_instructions_recipe_id ON instructions(recipe_id);

-- Insert sample data
INSERT INTO recipes (title, description, prep_time, cook_time, servings, difficulty, category) 
VALUES 
  ('Classic Spaghetti Carbonara', 'A traditional Italian pasta dish with eggs, cheese, and bacon', 10, 15, 4, 'easy', 'Italian'),
  ('Chicken Tikka Masala', 'Creamy and flavorful Indian curry with tender chicken', 30, 40, 6, 'medium', 'Indian'),
  ('Chocolate Chip Cookies', 'Soft and chewy homemade cookies', 15, 12, 24, 'easy', 'Dessert');

INSERT INTO ingredients (recipe_id, name, amount, unit, sort_order) 
VALUES 
  (1, 'Spaghetti', '400', 'g', 1),
  (1, 'Eggs', '4', 'large', 2),
  (1, 'Parmesan cheese', '100', 'g', 3),
  (1, 'Pancetta or bacon', '200', 'g', 4),
  (1, 'Black pepper', 'to taste', '', 5),
  (2, 'Chicken breast', '800', 'g', 1),
  (2, 'Yogurt', '200', 'ml', 2),
  (2, 'Tomato sauce', '400', 'g', 3),
  (2, 'Heavy cream', '200', 'ml', 4),
  (2, 'Garam masala', '2', 'tbsp', 5),
  (3, 'All-purpose flour', '280', 'g', 1),
  (3, 'Butter', '200', 'g', 2),
  (3, 'Brown sugar', '200', 'g', 3),
  (3, 'Chocolate chips', '300', 'g', 4),
  (3, 'Eggs', '2', 'large', 5);

INSERT INTO instructions (recipe_id, step_number, instruction) 
VALUES 
  (1, 1, 'Bring a large pot of salted water to boil and cook spaghetti according to package directions'),
  (1, 2, 'While pasta cooks, dice the pancetta and fry until crispy'),
  (1, 3, 'Beat eggs with grated parmesan cheese and black pepper'),
  (1, 4, 'Drain pasta, reserving 1 cup of pasta water'),
  (1, 5, 'Toss hot pasta with pancetta, then remove from heat and stir in egg mixture quickly'),
  (1, 6, 'Add pasta water as needed to create a creamy sauce'),
  (2, 1, 'Cut chicken into bite-sized pieces and marinate in yogurt with spices for 30 minutes'),
  (2, 2, 'Heat oil in a large pan and cook marinated chicken until browned'),
  (2, 3, 'Remove chicken and sauté onions, garlic, and ginger in the same pan'),
  (2, 4, 'Add tomato sauce and spices, simmer for 10 minutes'),
  (2, 5, 'Return chicken to pan, add cream, and simmer for 15-20 minutes'),
  (2, 6, 'Garnish with fresh cilantro and serve with rice or naan'),
  (3, 1, 'Preheat oven to 180°C (350°F)'),
  (3, 2, 'Cream together softened butter and brown sugar until fluffy'),
  (3, 3, 'Beat in eggs one at a time'),
  (3, 4, 'Mix in flour, baking soda, and salt until just combined'),
  (3, 5, 'Fold in chocolate chips'),
  (3, 6, 'Drop spoonfuls onto baking sheet and bake for 10-12 minutes');
