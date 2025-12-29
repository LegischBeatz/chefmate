
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, Flame, Clock, ShoppingBag, RotateCcw, Heart, 
  Lock, Zap, ChefHat, Sparkles, CheckCircle, Users, Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { useUser } from '../hooks/useUser';
import { ViewState, Recipe } from '../types';
import { saveRecipe } from '../lib/api/recipes';
import { scaleRecipe } from '../lib/recipe-helpers';
import { addIngredientsToPending } from '../lib/api/grocery';

interface InspireProps {
  onNavigate: (view: ViewState) => void;
}

const GENERATED_RECIPE_DB: Recipe[] = [
  {
    id: 'gen-1',
    title: 'Lemon Herb Grilled Salmon',
    description: 'A light, zesty dinner option that comes together in under 20 minutes. The garlic butter sauce elevates the fresh salmon perfectly.',
    tags: ['High Protein', 'Gluten Free', 'Omega-3'],
    stats: { prepTime: 5, cookTime: 12, calories: 340 },
    ingredients: [
      { item: 'Salmon Fillet', amount: '6', unit: 'oz' },
      { item: 'Lemon', amount: '1', unit: 'whole' },
      { item: 'Garlic Cloves', amount: '2', unit: 'minced' },
      { item: 'Fresh Dill', amount: '1', unit: 'tbsp' },
      { item: 'Asparagus', amount: '1', unit: 'bunch' }
    ],
    instructions: [
      'Pat salmon dry and season generously with salt and pepper.',
      'Mix melted butter, minced garlic, lemon juice, and chopped dill in a small bowl.',
      'Grill salmon for 4-5 minutes per side. Brush with herb butter in the last minute.',
      'Serve immediately with steamed asparagus.'
    ],
    servings: 2
  },
  {
    id: 'gen-2',
    title: 'Spicy Peanut Noodles',
    description: 'Creamy, spicy, and packed with veggies. This 15-minute meal is better than takeout and completely customizable.',
    tags: ['Vegetarian', 'Quick', 'Spicy'],
    stats: { prepTime: 10, cookTime: 5, calories: 410 },
    ingredients: [
      { item: 'Rice Noodles', amount: '8', unit: 'oz' },
      { item: 'Peanut Butter', amount: '3', unit: 'tbsp' },
      { item: 'Soy Sauce', amount: '2', unit: 'tbsp' },
      { item: 'Chili Crisp', amount: '1', unit: 'tbsp' },
      { item: 'Cucumber', amount: '1/2', unit: 'sliced' }
    ],
    instructions: [
      'Boil noodles according to package instructions.',
      'Whisk peanut butter, soy sauce, chili crisp, and a splash of hot water until smooth.',
      'Toss hot noodles with the sauce.',
      'Top with sliced cucumber and crushed peanuts.'
    ],
    servings: 2
  }
];

export const Inspire: React.FC<InspireProps> = ({ onNavigate }) => {
  const { user, usage, incrementUsage } = useUser();
  const [viewState, setViewState] = useState<'wizard' | 'loading' | 'result' | 'limit'>('wizard');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [loadingText, setLoadingText] = useState('Analyzing pantry...');
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [selections, setSelections] = useState({
    mood: 'Comfort',
    meal: 'Dinner',
    diet: 'None',
    servings: 2
  });

  // Narrative Loader Animation
  useEffect(() => {
    if (viewState === 'loading') {
      const texts = [
        'Analyzing flavor profile...',
        'Checking nutritional constraints...',
        'Consulting the chef...',
        'Plating up...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [viewState]);

  const handleGenerate = () => {
    // Check Limits
    if (user?.tier === 'free' && usage.used >= usage.limit) {
      setViewState('limit');
      return;
    }

    // Start Generation
    incrementUsage();
    setViewState('loading');
    setIsSaved(false);
    
    // Simulate API delay
    setTimeout(() => {
      // Pick a random recipe
      const baseRecipe = GENERATED_RECIPE_DB[Math.floor(Math.random() * GENERATED_RECIPE_DB.length)];
      // Scale it
      const scaledRecipe = scaleRecipe(baseRecipe, selections.servings);
      // Ensure unique ID for saving multiple times in one session
      const finalRecipe = { ...scaledRecipe, id: `gen-${Date.now()}` }; 
      
      setCurrentRecipe(finalRecipe);
      setViewState('result');
    }, 3500);
  };

  const handleSave = async () => {
    if (currentRecipe && !isSaved) {
      await saveRecipe(currentRecipe, user?.id);
      setIsSaved(true);
    }
  };

  const handleAddToGrocery = () => {
    if (currentRecipe) {
        addIngredientsToPending(currentRecipe.ingredients || [], currentRecipe.title);
        setNotification("Ingredients added to Grocery Staging");
        setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleReset = () => {
    setViewState('wizard');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const ConfigSection = ({ title, options, selected, onSelect, variants, isNumber = false }: any) => (
    <motion.div variants={variants} className="mb-2">
      <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4 ml-1">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((opt: any) => {
           const isActive = selected === opt;
           return (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`
                    relative rounded-xl text-sm font-medium transition-all duration-200 outline-none
                    ${isNumber ? 'w-12 h-12 flex items-center justify-center text-lg' : 'px-6 py-3'}
                    ${isActive 
                        ? 'bg-gradient-to-b from-chef-green-light to-chef-green text-white shadow-md shadow-emerald-500/20 scale-105 ring-1 ring-emerald-600/20 border-t border-white/20' 
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:scale-105 hover:border-zinc-300 shadow-sm'
                    }
                `}
            >
                {opt}
            </button>
           );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100/40 via-zinc-50/0 to-transparent blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      </div>

      <div className="relative z-10">
        <Navbar currentView="inspire" onNavigate={onNavigate} />

        {notification && (
            <div className="fixed bottom-8 right-8 z-50 bg-chef-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center animate-in slide-in-from-bottom-5">
                <Plus className="w-5 h-5 mr-3 text-chef-green" />
                {notification}
            </div>
        )}

        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          
          <div className="mb-10 text-center md:text-left">
            <AnimatePresence mode="wait">
              {viewState === 'wizard' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 text-balance">
                      Cooking for {user?.name.split(' ')[0] || 'Chef'}
                  </h1>
                  <p className="text-zinc-500 mt-3 text-lg font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                      Configure your preferences and let our culinary engine design the perfect meal.
                  </p>
                </motion.div>
              )}
              {viewState === 'result' && (
                 <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900"
                  >
                    Bon Appétit!
                 </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* WIZARD STATE */}
              {(viewState === 'wizard' || viewState === 'limit') && (
                <motion.div
                  key="wizard"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="
                      backdrop-blur-xl bg-white/70 
                      border border-white/50 ring-1 ring-zinc-900/5 
                      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                      rounded-3xl p-8 md:p-12 relative
                  "
                >
                  <div className={`space-y-10 ${viewState === 'limit' ? 'blur-sm select-none pointer-events-none' : ''}`}>
                    <ConfigSection 
                      title="People (Servings)"
                      options={[1, 2, 3, 4, 5, 6, 7, 8]}
                      selected={selections.servings}
                      onSelect={(v: number) => setSelections(s => ({...s, servings: v}))}
                      variants={itemVariants}
                      isNumber
                    />
                    <ConfigSection 
                      title="I'M FEELING..."
                      options={['Comfort', 'Healthy', 'Fancy', 'Quick', 'Surprise Me']}
                      selected={selections.mood}
                      onSelect={(v: string) => setSelections(s => ({...s, mood: v}))}
                      variants={itemVariants}
                    />
                    <ConfigSection 
                      title="MEAL TYPE"
                      options={['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']}
                      selected={selections.meal}
                      onSelect={(v: string) => setSelections(s => ({...s, meal: v}))}
                      variants={itemVariants}
                    />
                    <ConfigSection 
                      title="DIETARY FOCUS"
                      options={['None', 'Keto', 'Vegan', 'Paleo', 'Gluten Free']}
                      selected={selections.diet}
                      onSelect={(v: string) => setSelections(s => ({...s, diet: v}))}
                      variants={itemVariants}
                    />
                  </div>

                  <motion.div variants={itemVariants} className={`mt-14 flex justify-end ${viewState === 'limit' ? 'blur-sm select-none pointer-events-none' : ''}`}>
                     <Button 
                        size="lg" 
                        onClick={handleGenerate} 
                        className="
                            w-full md:w-auto text-lg px-12 h-14
                            bg-zinc-900 text-white border border-zinc-800
                            hover:bg-zinc-800
                            shadow-lg shadow-emerald-500/10
                            hover:shadow-emerald-500/20
                            hover:-translate-y-0.5
                            transition-all duration-300
                            rounded-full
                        "
                      >
                        <Sparkles className="w-5 h-5 mr-2 animate-pulse text-emerald-400" />
                        Generate Plan
                     </Button>
                  </motion.div>

                  {/* LIMIT MODAL OVERLAY */}
                  {viewState === 'limit' && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/30 backdrop-blur-sm rounded-3xl"
                     >
                       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100 ring-4 ring-black/5">
                          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Lock className="w-8 h-8 text-red-500" />
                          </div>
                          <h2 className="text-xl font-bold text-chef-black mb-2">You're out of ideas.</h2>
                          <p className="text-sm text-chef-dark mb-6">
                            You've hit your daily limit of 5 generations. Upgrade to unlimited and never run out of inspiration.
                          </p>
                          <Button fullWidth onClick={() => onNavigate('pricing')} className="mb-3">
                             Unlock Unlimited ($3/mo)
                          </Button>
                          <button onClick={() => setViewState('wizard')} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                            Go back
                          </button>
                       </div>
                     </motion.div>
                  )}
                </motion.div>
              )}

              {/* LOADING STATE */}
              {viewState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="
                    absolute inset-0 
                    backdrop-blur-xl bg-white/40
                    rounded-3xl flex flex-col items-center justify-center z-10
                  "
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-white/50 rounded-full shadow-inner"></div>
                    <div className="w-24 h-24 border-4 border-t-chef-green border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <ChefHat className="w-8 h-8 text-chef-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 animate-pulse">{loadingText}</h3>
                </motion.div>
              )}

              {/* RESULT STATE */}
              {viewState === 'result' && currentRecipe && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 ring-1 ring-zinc-900/5"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Quick Stats & Header */}
                    <div className="md:w-1/3 bg-zinc-50/80 p-8 flex flex-col justify-between border-r border-zinc-100">
                       <div>
                          <div className="flex justify-start items-center mb-6">
                              <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                                <Users className="w-3 h-3 text-zinc-500" />
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{currentRecipe.servings} People</span>
                              </div>
                          </div>
                          <h2 className="text-3xl font-extrabold text-zinc-900 mb-4 leading-tight text-balance">
                            {currentRecipe.title}
                          </h2>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {currentRecipe.tags?.map(tag => (
                               <span key={tag} className="text-xs font-semibold text-zinc-600 bg-white border border-zinc-200 px-2.5 py-1 rounded-md">
                                 {tag}
                               </span>
                            ))}
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex items-center text-zinc-600">
                             <Clock className="w-5 h-5 mr-3 text-chef-green" />
                             <span className="font-medium">{currentRecipe.stats.prepTime + currentRecipe.stats.cookTime} mins total</span>
                          </div>
                          <div className="flex items-center text-zinc-600">
                             <Flame className="w-5 h-5 mr-3 text-orange-500" />
                             <span className="font-medium">{currentRecipe.stats.calories} kcal</span>
                          </div>
                          <div className="flex items-center text-zinc-600">
                             <ShoppingBag className="w-5 h-5 mr-3 text-blue-500" />
                             <span className="font-medium">{currentRecipe.ingredients?.length || 0} ingredients</span>
                          </div>
                       </div>
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-2/3 p-8 bg-white">
                       <p className="text-lg text-zinc-600 mb-10 leading-relaxed font-medium">
                         {currentRecipe.description}
                       </p>
                       
                       <div className="mb-8">
                          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-2">Ingredients <span className="text-zinc-400 font-normal normal-case ml-1">(Scaled for {currentRecipe.servings})</span></h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {currentRecipe.ingredients?.map((ing, i) => (
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
                             {currentRecipe.instructions?.map((step, i) => (
                               <li key={i} className="flex gap-4 text-zinc-700 text-sm">
                                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-50 text-chef-green font-bold text-xs flex items-center justify-center border border-zinc-200">
                                   {i + 1}
                                 </span>
                                 <span className="mt-0.5 leading-relaxed">{step}</span>
                               </li>
                             ))}
                          </ol>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-100 flex-wrap">
                          <Button 
                            fullWidth 
                            className={`group transition-all ${isSaved ? 'bg-green-100 text-chef-green border-green-200 shadow-none' : ''}`}
                            onClick={handleSave}
                            disabled={isSaved}
                          >
                             {isSaved ? (
                               <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Saved to Library
                               </>
                             ) : (
                               <>
                                <Heart className="w-4 h-4 mr-2 group-hover:fill-current transition-colors" />
                                Save to Library
                               </>
                             )}
                          </Button>
                          <Button fullWidth onClick={handleAddToGrocery} className="bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 shadow-lg shadow-emerald-500/10">
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Grocery
                          </Button>
                          <Button fullWidth variant="secondary" onClick={handleGenerate}>
                             <RotateCcw className="w-4 h-4 mr-2" />
                             Regenerate
                          </Button>
                          <Button fullWidth variant="ghost" onClick={handleReset}>
                             Back
                          </Button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
