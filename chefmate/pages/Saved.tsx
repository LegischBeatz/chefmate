
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Trash2, Clock, ChefHat, ArrowRight, X, 
  Utensils, Flame, Filter, BookOpen, Loader2, Plus
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { ViewState, Recipe } from '../types';
import { useUser } from '../hooks/useUser';
import { getSavedRecipes, deleteRecipe } from '../lib/api/recipes';
import { addIngredientsToPending } from '../lib/api/grocery';

interface SavedProps {
  onNavigate: (view: ViewState) => void;
}

export const Saved: React.FC<SavedProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getSavedRecipes(user?.id);
        setRecipes(data);
      } catch (e) {
        console.error("Failed to load recipes", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  // -- Filtering Logic --
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || (recipe.tags && recipe.tags.includes(activeFilter));
      return matchesSearch && matchesFilter;
    });
  }, [recipes, searchQuery, activeFilter]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setRecipes(prev => prev.filter(r => r.id !== id));
      await deleteRecipe(id, user?.id);
    } catch (err) {
      console.error("Failed to delete recipe", err);
      // Revert if needed (simplified here)
    }
  };

  const handleAddToGrocery = () => {
    if (viewingRecipe) {
        addIngredientsToPending(viewingRecipe.ingredients || [], viewingRecipe.title);
        setNotification("Ingredients added to Grocery Staging");
        setTimeout(() => setNotification(null), 3000);
    }
  };

  // -- Components --

  const RecipeModal = () => {
    if (!viewingRecipe) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" onClick={() => setViewingRecipe(null)}></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-white/50"
        >
           <button 
             onClick={() => setViewingRecipe(null)}
             className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
           >
             <X className="w-5 h-5 text-zinc-900" />
           </button>

           <div className="h-48 bg-zinc-50 relative flex items-center justify-center overflow-hidden border-b border-zinc-100">
              <div className="absolute inset-0 bg-noise opacity-[0.05]"></div>
              <ChefHat className="w-24 h-24 text-zinc-200" />
           </div>

           <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {viewingRecipe.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-wider">
                        {tag}
                    </span>
                ))}
              </div>
              
              <h2 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">{viewingRecipe.title}</h2>
              <div className="flex items-center text-zinc-500 mb-6 text-sm font-medium">
                 <Clock className="w-4 h-4 mr-2" />
                 {viewingRecipe.stats.prepTime + viewingRecipe.stats.cookTime} mins
                 <span className="mx-3">•</span>
                 <Flame className="w-4 h-4 mr-2 text-orange-500" />
                 {viewingRecipe.stats.calories} kcal
              </div>
              
              <p className="text-zinc-600 mb-8 leading-relaxed text-lg">{viewingRecipe.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div>
                    <h3 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2 uppercase tracking-wide text-xs">Ingredients</h3>
                    <ul className="space-y-3">
                       {viewingRecipe.ingredients?.map((ing, i) => (
                         <li key={i} className="text-sm text-zinc-600 flex items-center">
                           <div className="w-2 h-2 rounded-full bg-chef-green mr-3 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                           <span><b>{ing.amount} {ing.unit}</b> {ing.item}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-bold text-zinc-900 mb-4 border-b border-zinc-100 pb-2 uppercase tracking-wide text-xs">Instructions</h3>
                    <ol className="space-y-4">
                       {viewingRecipe.instructions?.map((step, i) => (
                         <li key={i} className="text-sm text-zinc-600 flex gap-4">
                           <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-50 text-chef-green font-bold text-xs flex items-center justify-center border border-zinc-200">
                             {i+1}
                           </span>
                           <span className="mt-0.5">{step}</span>
                         </li>
                       ))}
                    </ol>
                 </div>
              </div>

              <div className="flex gap-3">
                  <Button fullWidth onClick={handleAddToGrocery}>
                      <Plus className="w-4 h-4 mr-2" /> Add to Grocery List
                  </Button>
              </div>
           </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 relative pb-12">
      <Navbar currentView="saved" onNavigate={onNavigate} />

      {notification && (
        <div className="fixed bottom-8 right-8 z-50 bg-chef-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center animate-in slide-in-from-bottom-5">
            <Plus className="w-5 h-5 mr-3 text-chef-green" />
            {notification}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
             <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 tracking-tight">My Cookbook</h1>
             <p className="text-zinc-500 text-lg">
               {loading ? 'Loading recipes...' : `${recipes.length} curated recipes`}
             </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-chef-green transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search recipes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-chef-green/20 focus:border-chef-green w-full sm:w-64 transition-all shadow-sm"
                />
             </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Breakfast', 'Lunch', 'Dinner'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
                activeFilter === filter
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-105'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Layout Content */}
        <AnimatePresence mode="popLayout">
          {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-chef-green" />
             </div>
          ) : filteredRecipes.length > 0 ? (
            /* CSS Column Masonry */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="
                    break-inside-avoid
                    bg-white/70 backdrop-blur-xl border border-white/50 
                    ring-1 ring-zinc-900/5
                    rounded-2xl p-6 
                    shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                    hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.15)]
                    hover:-translate-y-1
                    transition-all duration-300 
                    group cursor-pointer relative
                  "
                  onClick={() => setViewingRecipe(recipe)}
                >
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={(e) => handleDelete(e, recipe.id)}
                       className="p-2 bg-white rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-zinc-100"
                       title="Remove from saved"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="flex items-start justify-between mb-4 pr-12">
                     <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-chef-green border border-zinc-100">
                        <Utensils className="w-5 h-5" />
                     </div>
                     <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-100 rounded-md text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                        {recipe.tags && recipe.tags[0] ? recipe.tags[0] : 'Recipe'}
                     </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-1 group-hover:text-chef-green transition-colors tracking-tight">
                    {recipe.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-dashed border-zinc-200 pt-4">
                     <div className="flex items-center text-xs font-bold text-zinc-400">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {recipe.stats.prepTime + recipe.stats.cookTime} min
                     </div>
                     <button className="text-sm font-bold text-chef-green flex items-center group-hover:translate-x-1 transition-transform">
                        View <ArrowRight className="w-3 h-3 ml-1" />
                     </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-20 text-center"
            >
               <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <BookOpen className="w-10 h-10 text-zinc-300" />
               </div>
               <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">No recipes found</h3>
               <p className="text-zinc-500 mb-8 max-w-sm">
                 {searchQuery 
                   ? `We couldn't find anything matching "${searchQuery}"` 
                   : "Your cookbook is empty. Start generating ideas to fill it up!"}
               </p>
               {!searchQuery && (
                  <Button onClick={() => onNavigate('inspire')} className="shadow-lg shadow-emerald-500/20">
                     Go to Inspire <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <RecipeModal />
    </div>
  );
};
