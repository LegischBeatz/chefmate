
export interface RecipeStats {
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  calories: number;
}

export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stats: RecipeStats;
  ingredients: Ingredient[];
  instructions: string[];
  servings?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: 'free' | 'pro';
}

export interface UserContextType {
  user: UserProfile | null;
  usage: {
    used: number;
    limit: number;
  };
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  incrementUsage: () => void;
}

export type ViewState = 'landing' | 'login' | 'signup' | 'settings' | 'saved' | 'plan' | 'inspire' | 'pricing' | 'impressum' | 'privacy' | 'terms' | 'about' | 'contact' | 'grocery';

export type NavigationItem = {
  label: string;
  view: ViewState;
};

export interface PendingIngredient extends Ingredient {
  id: string;
  source?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
}

export interface GroceryCategory {
  name: string;
  items: GroceryItem[];
}

export interface GroceryList {
  id: string;
  name: string;
  categories: GroceryCategory[];
  lastUpdated: string;
}
