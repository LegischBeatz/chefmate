
import { supabase } from '../supabase';
import { isSupabaseConfigured } from '../config';
import { Recipe } from '../../types';

const LOCAL_STORAGE_KEY = 'chefmate_saved_recipes';

// Seed data for local storage demo
const MOCK_SAVED_RECIPES: Recipe[] = [
  {
    id: 's1',
    title: 'Avocado Toast & Poached Egg',
    description: 'A classic breakfast staple. Creamy avocado on sourdough topped with a perfectly poached egg and chili flakes.',
    tags: ['Breakfast', 'Vegetarian', 'Quick'],
    stats: { prepTime: 5, cookTime: 5, calories: 320 },
    ingredients: [
      { item: 'Sourdough Bread', amount: '2', unit: 'slices' },
      { item: 'Avocado', amount: '1', unit: 'whole' },
      { item: 'Eggs', amount: '2', unit: 'large' }
    ],
    instructions: ['Toast bread.', 'Mash avocado with lime.', 'Poach eggs.', 'Assemble.'],
    servings: 2
  },
  {
    id: 's2',
    title: 'Grilled Chicken Caesar Salad',
    description: 'Crisp romaine lettuce tossed with homemade caesar dressing, crunchy croutons, and tender grilled chicken breast.',
    tags: ['Lunch', 'High Protein', 'Healthy'],
    stats: { prepTime: 15, cookTime: 10, calories: 450 },
    ingredients: [
      { item: 'Chicken Breast', amount: '1', unit: 'lb' },
      { item: 'Romaine Lettuce', amount: '2', unit: 'heads' },
      { item: 'Parmesan', amount: '1/2', unit: 'cup' }
    ],
    instructions: ['Grill chicken.', 'Chop lettuce.', 'Toss with dressing and cheese.'],
    servings: 2
  },
  {
    id: 's3',
    title: 'Pan-Seared Ribeye Steak',
    description: 'Restaurant-quality steak at home. Butter-basted with garlic and rosemary for an incredible crust.',
    tags: ['Dinner', 'Keto', 'Fancy'],
    stats: { prepTime: 5, cookTime: 15, calories: 850 },
    ingredients: [
      { item: 'Ribeye Steak', amount: '1', unit: '12oz' },
      { item: 'Butter', amount: '3', unit: 'tbsp' },
      { item: 'Rosemary', amount: '2', unit: 'sprigs' }
    ],
    instructions: ['Sear steak in hot pan.', 'Add butter and herbs.', 'Baste until cooked.'],
    servings: 2
  },
  {
    id: 's4',
    title: 'Blueberry Oatmeal',
    description: 'Warm, comforting oats packed with antioxidants. A healthy way to start the day.',
    tags: ['Breakfast', 'Healthy', 'Vegan'],
    stats: { prepTime: 2, cookTime: 8, calories: 280 },
    ingredients: [
      { item: 'Rolled Oats', amount: '1', unit: 'cup' },
      { item: 'Blueberries', amount: '1/2', unit: 'cup' },
      { item: 'Almond Milk', amount: '2', unit: 'cups' }
    ],
    instructions: ['Simmer oats in milk.', 'Stir in blueberries.', 'Serve warm.'],
    servings: 1
  },
  {
    id: 's5',
    title: 'Spicy Tuna Poke Bowl',
    description: 'Fresh raw tuna marinated in soy and sesame oil, served over sushi rice with toppings.',
    tags: ['Lunch', 'Seafood', 'Fresh'],
    stats: { prepTime: 20, cookTime: 0, calories: 500 },
    ingredients: [
      { item: 'Sushi Grade Tuna', amount: '0.5', unit: 'lb' },
      { item: 'Sushi Rice', amount: '1', unit: 'cup' },
      { item: 'Soy Sauce', amount: '2', unit: 'tbsp' }
    ],
    instructions: ['Cook rice.', 'Cube tuna and marinate.', 'Assemble bowl with toppings.'],
    servings: 1
  },
  {
    id: 's6',
    title: 'Mushroom Risotto',
    description: 'Creamy Italian rice dish cooked slowly with white wine, parmesan, and earthy mushrooms.',
    tags: ['Dinner', 'Vegetarian', 'Comfort'],
    stats: { prepTime: 10, cookTime: 35, calories: 600 },
    ingredients: [
      { item: 'Arborio Rice', amount: '1.5', unit: 'cups' },
      { item: 'Mushrooms', amount: '8', unit: 'oz' },
      { item: 'Vegetable Broth', amount: '4', unit: 'cups' }
    ],
    instructions: ['Sauté mushrooms.', 'Toast rice.', 'Add broth gradually while stirring.'],
    servings: 4
  }
];

// Helper to access local storage safely
const getLocalRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  // If empty, seed with mock data for demo experience
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_SAVED_RECIPES));
  return MOCK_SAVED_RECIPES;
};

export const getSavedRecipes = async (userId?: string): Promise<Recipe[]> => {
  // 1. Supabase Path
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        // Fallback to local if cloud fetch fails
        return getLocalRecipes();
      }
      return data as Recipe[] || [];
    } catch (e) {
      console.warn('Supabase connection failed, falling back to local.', e);
      return getLocalRecipes();
    }
  }

  // 2. LocalStorage Path
  return getLocalRecipes();
};

export const saveRecipe = async (recipe: Recipe, userId?: string): Promise<void> => {
  // 1. Supabase Path
  if (isSupabaseConfigured && supabase && userId) {
    const { error } = await supabase
      .from('recipes')
      .insert([
        { 
          // Spread recipe fields to match schema
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          tags: recipe.tags,
          stats: recipe.stats,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          servings: recipe.servings || 2, // Default to 2 if undefined
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) throw new Error(error.message);
    return;
  }

  // 2. LocalStorage Path
  const current = getLocalRecipes();
  // Prevent duplicates based on ID
  if (!current.some(r => r.id === recipe.id)) {
    const updated = [recipe, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
};

export const deleteRecipe = async (recipeId: string, userId?: string): Promise<void> => {
  // 1. Supabase Path
  if (isSupabaseConfigured && supabase && userId) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);
      
    if (error) throw new Error(error.message);
  }

  // 2. LocalStorage Path (always sync local state too for hybrid feel)
  const current = getLocalRecipes();
  const updated = current.filter(r => r.id !== recipeId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};
