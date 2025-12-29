
import { PendingIngredient, GroceryList, Ingredient } from '../../types';

const PENDING_KEY = 'chefmate_pending_grocery';
const LISTS_KEY = 'chefmate_saved_grocery_lists';

export const getPendingIngredients = (): PendingIngredient[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PENDING_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addIngredientsToPending = (ingredients: Ingredient[], source: string) => {
  const current = getPendingIngredients();
  const newItems: PendingIngredient[] = ingredients.map(ing => ({
    ...ing,
    id: Math.random().toString(36).substr(2, 9),
    source
  }));
  localStorage.setItem(PENDING_KEY, JSON.stringify([...current, ...newItems]));
};

export const removePendingIngredient = (id: string) => {
  const current = getPendingIngredients();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
};

export const clearPendingIngredients = () => {
  localStorage.removeItem(PENDING_KEY);
};

// --- Multi-List Management ---

export const getSavedLists = (): GroceryList[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LISTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveList = (list: GroceryList) => {
  const currentLists = getSavedLists();
  const index = currentLists.findIndex(l => l.id === list.id);
  
  if (index >= 0) {
    // Update existing
    currentLists[index] = list;
  } else {
    // Add new (to top)
    currentLists.unshift(list);
  }
  
  localStorage.setItem(LISTS_KEY, JSON.stringify(currentLists));
};

export const deleteList = (id: string) => {
  const currentLists = getSavedLists();
  const updated = currentLists.filter(l => l.id !== id);
  localStorage.setItem(LISTS_KEY, JSON.stringify(updated));
};

export const toggleItemInList = (listId: string, categoryName: string, itemId: string) => {
  const lists = getSavedLists();
  const listIndex = lists.findIndex(l => l.id === listId);
  
  if (listIndex === -1) return;

  const list = lists[listIndex];
  const category = list.categories.find(c => c.name === categoryName);
  
  if (category) {
    const item = category.items.find(i => i.id === itemId);
    if (item) {
      item.checked = !item.checked;
      list.lastUpdated = new Date().toISOString();
      saveList(list);
    }
  }
};
