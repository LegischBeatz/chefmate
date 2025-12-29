
import { Recipe, Ingredient } from '../types';

// Helper to format numbers nicely (e.g. 1.5 instead of 1.50000)
const formatAmount = (num: number): string => {
  return parseFloat(num.toFixed(2)).toString();
};

// Parse a quantity string (handles fractions like "1/2" and ranges like "1-2")
const parseAmount = (amount: string): number | null => {
  if (!amount) return null;
  
  // Handle fractions
  if (amount.includes('/')) {
    const [num, den] = amount.split('/').map(Number);
    if (den !== 0) return num / den;
  }
  
  // Handle ranges (take average)
  if (amount.includes('-')) {
    const [min, max] = amount.split('-').map(parseFloat);
    return (min + max) / 2;
  }

  const parsed = parseFloat(amount);
  return isNaN(parsed) ? null : parsed;
};

export const scaleIngredients = (ingredients: Ingredient[], targetServings: number, baseServings: number = 2): Ingredient[] => {
  const factor = targetServings / baseServings;
  
  return ingredients.map(ing => {
    const baseAmount = parseAmount(ing.amount);
    
    if (baseAmount === null) {
      return ing; // Return original if we can't parse the amount
    }

    return {
      ...ing,
      amount: formatAmount(baseAmount * factor)
    };
  });
};

export const scaleRecipe = (recipe: Recipe, targetServings: number): Recipe => {
  return {
    ...recipe,
    servings: targetServings,
    ingredients: scaleIngredients(recipe.ingredients, targetServings)
  };
};
