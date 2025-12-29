
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Zap, RefreshCw, X, Check, Utensils, ChefHat, Sparkles, 
  LayoutGrid, Coffee, Sun, Moon, CalendarDays, Clock, Flame, Users, ArrowRight, ShoppingBag,
  Heart, CheckCircle, Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { useUser } from '../hooks/useUser';
import { ViewState, Recipe, Ingredient } from '../types';
import { scaleRecipe } from '../lib/recipe-helpers';
import { saveRecipe } from '../lib/api/recipes';
import { addIngredientsToPending } from '../lib/api/grocery';

interface PlannerProps {
  onNavigate: (view: ViewState) => void;
}

// -- Mock Data Generator (Same as before) --
const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Quinoa Power Bowl',
    description: 'Packed with protein and fresh veggies.',
    tags: ['Healthy', 'Lunch'],
    stats: { prepTime: 15, cookTime: 0, calories: 450 },
    ingredients: [{ item: 'Quinoa', amount: '1', unit: 'cup' }, { item: 'Chickpeas', amount: '1', unit: 'can' }, { item: 'Spinach', amount: '2', unit: 'cups' }],
    instructions: ['Cook quinoa.', 'Chop veggies.', 'Mix.'],
    servings: 2
  },
  {
    id: 'r2',
    title: 'Chicken Pesto Pasta',
    description: 'Quick weeknight favorite with basil pesto.',
    tags: ['Italian', 'Dinner'],
    stats: { prepTime: 10, cookTime: 15, calories: 600 },
    ingredients: [{ item: 'Pasta', amount: '1', unit: 'box' }, { item: 'Chicken Breast', amount: '1', unit: 'lb' }, { item: 'Pesto', amount: '1', unit: 'jar' }],
    instructions: ['Boil pasta.', 'Cook chicken.', 'Toss with pesto.'],
    servings: 2
  },
  {
    id: 'r3',
    title: 'Veggie Stir Fry',
    description: 'Use up whatever vegetables you have.',
    tags: ['Vegan', 'Dinner'],
    stats: { prepTime: 20, cookTime: 10, calories: 350 },
    ingredients: [{ item: 'Mixed Veggies', amount: '4', unit: 'cups' }, { item: 'Soy Sauce', amount: '2', unit: 'tbsp' }, { item: 'Ginger', amount: '1', unit: 'tsp' }],
    instructions: ['Chop veggies.', 'Stir fry with sauce.', 'Serve over rice.'],
    servings: 2
  },
  {
    id: 'r4',
    title: 'Grilled Fish Tacos',
    description: 'Fresh flavors with a lime crema.',
    tags: ['Seafood', 'Dinner'],
    stats: { prepTime: 15, cookTime: 10, calories: 400 },
    ingredients: [{ item: 'White Fish', amount: '1', unit: 'lb' }, { item: 'Corn Tortillas', amount: '8', unit: 'small' }, { item: 'Cabbage Slaw', amount: '1', unit: 'bag' }],
    instructions: ['Season fish.', 'Grill.', 'Assemble tacos.'],
    servings: 2
  },
  {
    id: 'r5',
    title: 'Turkey Chili',
    description: 'Hearty and warming for colder nights.',
    tags: ['Comfort', 'Dinner'],
    stats: { prepTime: 15, cookTime: 45, calories: 500 },
    ingredients: [{ item: 'Ground Turkey', amount: '1', unit: 'lb' }, { item: 'Kidney Beans', amount: '1', unit: 'can' }, { item: 'Diced Tomatoes', amount: '1', unit: 'can' }],
    instructions: ['Brown meat.', 'Add beans and tomatoes.', 'Simmer.'],
    servings: 2
  },
  {
    id: 'r6',
    title: 'Avocado Toast',
    description: 'Classic breakfast with a twist.',
    tags: ['Breakfast', 'Quick'],
    stats: { prepTime: 5, cookTime: 5, calories: 300 },
    ingredients: [{ item: 'Bread', amount: '2', unit: 'slices' }, { item: 'Avocado', amount: '1', unit: 'ripe' }, { item: 'Red Pepper Flakes', amount: '1', unit: 'pinch' }],
    instructions: ['Toast bread.', 'Smash avocado.'],
    servings: 2
  },
  {
    id: 'r7',
    title: 'Oatmeal & Berries',
    description: 'Warm and comforting start to the day.',
    tags: ['Breakfast', 'Healthy'],
    stats: { prepTime: 5, cookTime: 10, calories: 250 },
    ingredients: [{ item: 'Oats', amount: '1', unit: 'cup' }, { item: 'Mixed Berries', amount: '1', unit: 'cup' }, { item: 'Honey', amount: '1', unit: 'tsp' }],
    instructions: ['Boil oats.', 'Add berries.'],
    servings: 2
  }
];

const MEAL_TYPES = [
  { id: 'Breakfast', icon: Coffee, label: 'Breakfast' },
  { id: 'Lunch', icon: Sun, label: 'Lunch' },
  { id: 'Dinner', icon: Moon, label: 'Dinner' },
];

const DURATIONS = [3, 5, 7];
const SERVINGS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const getUpcomingDates = (count: number) => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
};

const formatDate = (date: Date, index: number) => {
  if (index === 0) return "Tomorrow";
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

interface DayPlan {
  date: Date;
  dateLabel: string;
  meals: Record<string, Recipe>; // 'Breakfast': Recipe, etc.
}

export const Planner: React.FC<PlannerProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const [plannerState, setPlannerState] = useState<'setup' | 'grid'>('setup');
  
  // Configuration State
  const [planDuration, setPlanDuration] = useState<number>(3);
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['Lunch', 'Dinner']);
  const [servings, setServings] = useState<number>(2);
  
  // Result State
  const [generatedPlan, setGeneratedPlan] = useState<DayPlan[]>([]);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [isViewingRecipeSaved, setIsViewingRecipeSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleMealSelection = (mealId: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(m => m !== mealId)
        : [...prev, mealId]
    );
  };

  const getRandomRecipe = () => {
    const base = MOCK_RECIPES[Math.floor(Math.random() * MOCK_RECIPES.length)];
    return scaleRecipe(base, servings);
  };

  const generatePlan = () => {
    if (selectedMeals.length === 0) return; 

    const dates = getUpcomingDates(planDuration);
    const newPlan: DayPlan[] = dates.map((date, index) => {
      const dayMeals: Record<string, Recipe> = {};
      selectedMeals.forEach(mealType => {
        dayMeals[mealType] = getRandomRecipe();
      });

      return {
        date: date,
        dateLabel: formatDate(date, index),
        meals: dayMeals
      };
    });

    setGeneratedPlan(newPlan);
    setPlannerState('grid');
  };

  const regenerateMeal = (dayIndex: number, mealType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayIndex].meals[mealType] = getRandomRecipe();
      return newPlan;
    });
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setViewingRecipe(recipe);
    setIsViewingRecipeSaved(false);
  };

  const handleSaveRecipe = async () => {
    if (viewingRecipe && user) {
        setIsViewingRecipeSaved(true);
        await saveRecipe(viewingRecipe, user.id);
    }
  };

  const handleAddPlanToGrocery = () => {
      const allIngredients: Ingredient[] = [];
      generatedPlan.forEach(day => {
          if (day.meals) {
              Object.values(day.meals).forEach((meal: Recipe) => {
                  if (meal && meal.ingredients) {
                    allIngredients.push(...meal.ingredients);
                  }
              });
          }
      });
      addIngredientsToPending(allIngredients, "Weekly Plan");
      setNotification("All ingredients added to Grocery Staging");
      setTimeout(() => setNotification(null), 3000);
  };

  // -- Components --

  const LockedView = () => (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col items-center justify-center text-center p-6">
       <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg border border-white relative z-10">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
             <Lock className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 mb-3 tracking-tight">Unlock Weekly Autopilot</h2>
          <p className="text-zinc-600 mb-8 text-lg">
            Stop planning meal by meal. Pro users can generate full upcoming schedules, tailored to their diet, in one click.
          </p>
          <div className="space-y-3">
             <Button fullWidth size="lg" className="shadow-xl shadow-emerald-500/20" onClick={() => onNavigate('pricing')}>
               <Zap className="w-4 h-4 mr-2 fill-current text-yellow-300" />
               Upgrade to Pro - $5/mo
             </Button>
             <Button fullWidth variant="ghost" onClick={() => onNavigate('inspire')}>
               Back to Daily Generator
             </Button>
          </div>
       </div>
    </div>
  );

  const SetupWizard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 px-4 relative z-10"
    >
      <div className="
        backdrop-blur-xl bg-white/70 
        border border-white/50 ring-1 ring-zinc-900/5 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        rounded-3xl p-8 md:p-12
      ">
        <div className="flex items-center space-x-3 mb-10">
           <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-zinc-900" />
           </div>
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Plan your upcoming days</h1>
        </div>

        <div className="space-y-10">
          
          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4 ml-1">Duration</label>
            <div className="grid grid-cols-3 gap-4">
              {DURATIONS.map(num => {
                 const isActive = planDuration === num;
                 return (
                  <motion.button
                    key={num}
                    onClick={() => setPlanDuration(num)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center justify-center py-6 rounded-2xl font-bold text-lg transition-all duration-300 ease-out outline-none border
                      ${isActive
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300'
                      }
                    `}
                  >
                    <span className="text-3xl mb-1 tracking-tight">{num}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-emerald-100' : 'text-zinc-400'}`}>Days</span>
                  </motion.button>
                 );
              })}
            </div>
          </div>

          {/* People Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4 ml-1">People</label>
            <div className="flex flex-wrap gap-2">
              {SERVINGS_OPTIONS.map((num) => {
                 const isActive = servings === num;
                 return (
                  <motion.button
                    key={num}
                    onClick={() => setServings(num)}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ease-out outline-none border
                      ${isActive
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300'
                      }
                    `}
                  >
                    {num}
                  </motion.button>
                 );
              })}
            </div>
          </div>

          {/* Meal Types Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-4 ml-1">Included Meals</label>
            <div className="grid grid-cols-3 gap-3">
              {MEAL_TYPES.map((type) => {
                 const isSelected = selectedMeals.includes(type.id);
                 const Icon = type.icon;
                 return (
                  <motion.button
                    key={type.id}
                    onClick={() => toggleMealSelection(type.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center justify-center px-4 py-4 rounded-xl text-sm font-bold transition-all duration-300 ease-out outline-none border
                      ${isSelected
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/20'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    {type.label}
                  </motion.button>
                 );
              })}
            </div>
            {selectedMeals.length === 0 && (
              <p className="text-xs text-red-500 mt-2">Please select at least one meal type.</p>
            )}
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button 
               fullWidth 
               size="lg" 
               onClick={generatePlan}
               disabled={selectedMeals.length === 0}
               className="h-14 text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
               <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
               Generate Plan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const RecipeModal = () => {
    if (!viewingRecipe) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" onClick={() => setViewingRecipe(null)}></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl border border-white/50 flex flex-col md:flex-row"
        >
           <button 
             onClick={() => setViewingRecipe(null)}
             className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-20 border border-zinc-200 shadow-sm"
           >
             <X className="w-5 h-5 text-zinc-900" />
           </button>

           {/* Left Panel - Stats & Header */}
           <div className="md:w-1/3 bg-zinc-50/80 p-8 flex flex-col justify-between border-r border-zinc-100 overflow-y-auto">
               <div>
                  <div className="flex justify-start items-center mb-6">
                      <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                        <Users className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{viewingRecipe.servings || servings} People</span>
                      </div>
                  </div>
                  <h2 className="text-3xl font-extrabold text-zinc-900 mb-4 leading-tight text-balance">
                    {viewingRecipe.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {viewingRecipe.tags?.map(tag => (
                       <span key={tag} className="text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 px-2.5 py-1 rounded-md">
                         {tag}
                       </span>
                    ))}
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center text-zinc-600">
                     <Clock className="w-5 h-5 mr-3 text-chef-green" />
                     <span className="font-medium">{viewingRecipe.stats.prepTime + viewingRecipe.stats.cookTime} mins total</span>
                  </div>
                  <div className="flex items-center text-zinc-600">
                     <Flame className="w-5 h-5 mr-3 text-orange-500" />
                     <span className="font-medium">{viewingRecipe.stats.calories} kcal</span>
                  </div>
                  <div className="flex items-center text-zinc-600">
                     <ShoppingBag className="w-5 h-5 mr-3 text-blue-500" />
                     <span className="font-medium">{viewingRecipe.ingredients?.length || 0} ingredients</span>
                  </div>
               </div>
           </div>

           {/* Right Panel - Content */}
           <div className="md:w-2/3 bg-white flex flex-col overflow-hidden">
               <div className="p-8 overflow-y-auto flex-1">
                   <p className="text-lg text-zinc-600 mb-10 leading-relaxed font-medium">
                     {viewingRecipe.description}
                   </p>
                   
                   <div className="mb-8">
                      <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-2">Ingredients <span className="text-zinc-400 font-normal normal-case ml-1">(Scaled for {viewingRecipe.servings || servings})</span></h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {viewingRecipe.ingredients?.map((ing, i) => (
                           <li key={i} className="flex items-center text-zinc-700 text-sm">
                             <div className="w-1.5 h-1.5 rounded-full bg-chef-green mr-2.5"></div>
                             <span><span className="font-semibold text-zinc-900">{ing.amount} {ing.unit}</span> {ing.item}</span>
                           </li>
                         ))}
                      </ul>
                   </div>

                   <div className="mb-8">
                      <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-2">Instructions</h3>
                      <ol className="space-y-4">
                         {viewingRecipe.instructions?.map((step, i) => (
                           <li key={i} className="flex gap-4 text-zinc-700 text-sm">
                             <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-50 text-chef-green font-bold text-xs flex items-center justify-center border border-zinc-200">
                               {i + 1}
                             </span>
                             <span className="mt-0.5 leading-relaxed">{step}</span>
                           </li>
                         ))}
                      </ol>
                   </div>
               </div>
               
               <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                   <Button 
                        variant="secondary"
                        onClick={handleSaveRecipe}
                        disabled={isViewingRecipeSaved}
                        className={isViewingRecipeSaved ? "text-chef-green border-chef-green/20 bg-emerald-50" : "hover:text-chef-green hover:border-chef-green"}
                    >
                        {isViewingRecipeSaved ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Heart className="w-4 h-4 mr-2" />
                                Save Recipe
                            </>
                        )}
                    </Button>
                  <Button onClick={() => setViewingRecipe(null)}>Close</Button>
               </div>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 relative overflow-hidden">
      <div className="relative z-10">
        <Navbar currentView="plan" onNavigate={onNavigate} />

        {notification && (
            <div className="fixed bottom-8 right-8 z-50 bg-chef-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center animate-in slide-in-from-bottom-5">
                <Plus className="w-5 h-5 mr-3 text-chef-green" />
                {notification}
            </div>
        )}
        
        {(!user || user.tier === 'free') ? (
            <LockedView />
        ) : (
          <>
            {plannerState === 'setup' ? (
              <SetupWizard />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-[1400px] mx-auto py-8"
              >
                <div className="px-4 md:px-8 flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                      <h1 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">Upcoming Plan</h1>
                      <p className="text-zinc-500">
                        {planDuration} Days • {selectedMeals.join(', ')} • {servings} People
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <Button variant="secondary" onClick={() => setPlannerState('setup')}>
                        New Settings
                      </Button>
                      <Button onClick={handleAddPlanToGrocery} className="shadow-lg shadow-emerald-500/20">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Plan to Grocery List
                      </Button>
                    </div>
                </div>

                {/* Horizontal Scroll Grid */}
                <div className="w-full overflow-x-auto pb-12 px-4 md:px-8 hide-scrollbar">
                    <div className="flex space-x-6">
                        {generatedPlan.map((day, dayIdx) => (
                        <div key={dayIdx} className="min-w-[300px] w-[320px] flex-shrink-0 flex flex-col space-y-4">
                            
                            {/* Column Header */}
                            <div className="flex justify-between items-center px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/50 shadow-sm">
                                <span className="font-bold text-zinc-900 text-sm">{day.dateLabel}</span>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            </div>

                            {/* Stack of Meals */}
                            <div className="space-y-4">
                            {MEAL_TYPES.filter(t => selectedMeals.includes(t.id)).map((type) => {
                                const meal = day.meals[type.id];
                                if (!meal) return null;

                                const firstInstruction = meal.instructions?.[0]?.endsWith('.') 
                                ? meal.instructions[0].slice(0, -1) 
                                : meal.instructions?.[0] || 'No instructions';
                                const ingredientsList = meal.ingredients?.slice(0, 3).map(i => i.item).join(', ') || 'No ingredients';
                                const summary = `${firstInstruction} with ${ingredientsList}.`;

                                return (
                                <motion.div 
                                    key={type.id}
                                    whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.15)" }}
                                    onClick={() => handleRecipeClick(meal)}
                                    className="
                                        bg-white/80 backdrop-blur-sm border border-white/60 p-5 rounded-2xl shadow-sm 
                                        transition-all duration-300 cursor-pointer group relative flex flex-col
                                        ring-1 ring-zinc-900/5
                                    "
                                >
                                    {/* Regenerate Button */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button 
                                            onClick={(e) => regenerateMeal(dayIdx, type.id, e)}
                                            className="p-2 bg-white border border-zinc-100 shadow-sm hover:bg-emerald-500 hover:text-white rounded-full transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="flex items-start justify-between mb-3">
                                        <span className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                            {type.label}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-zinc-900 text-sm mb-3 line-clamp-2 leading-snug min-h-[2.5em] tracking-tight">
                                        {meal.title}
                                    </h3>
                                    
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="flex items-center text-xs text-zinc-500 bg-zinc-50/80 px-2 py-1 rounded-md border border-zinc-100/50">
                                            <Clock className="w-3 h-3 mr-1.5 text-chef-green" />
                                            {meal.stats.prepTime + meal.stats.cookTime}m
                                        </div>
                                        <div className="flex items-center text-xs text-zinc-500 bg-zinc-50/80 px-2 py-1 rounded-md border border-zinc-100/50">
                                            <Flame className="w-3 h-3 mr-1.5 text-orange-400" />
                                            {meal.stats.calories}
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-50 pt-3 mt-auto line-clamp-2">
                                        {summary}
                                    </p>
                                </motion.div>
                                );
                            })}
                            </div>
                        </div>
                        ))}
                        
                        {/* Spacer for scroll padding */}
                        <div className="w-8 flex-shrink-0" />
                    </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <RecipeModal />
    </div>
  );
};
