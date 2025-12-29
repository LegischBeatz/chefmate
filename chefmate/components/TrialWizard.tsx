
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, Save, Utensils, Flame, Clock, ShoppingBag, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Recipe } from '../types';
import { scaleRecipe } from '../lib/recipe-helpers';

interface TrialWizardProps {
  onSave: () => void;
}

const SELECTIONS = {
  mood: ['Comfort', 'Healthy', 'Fancy', 'Lazy'],
  meal: ['Dinner', 'Lunch', 'Breakfast', 'Snack'],
  time: ['< 15 min', '30 min', '1 hr+']
};

const PEOPLE_OPTIONS = [1, 2, 3, 4];

const MOCK_GENERATED_RECIPE: Recipe = {
  id: 'gen-1',
  title: 'Garlic Butter Steak Bites & Zucchini',
  description: 'Seared to perfection with a rich garlic butter sauce. A low-carb, high-protein winner that feels indulgent but comes together in minutes.',
  tags: ['Keto-Friendly', 'High Protein', 'Gluten Free'],
  stats: { prepTime: 10, cookTime: 10, calories: 420 },
  ingredients: [
    { item: 'Sirloin Steak', amount: '1', unit: 'lb' },
    { item: 'Zucchini', amount: '2', unit: 'medium' },
    { item: 'Garlic', amount: '4', unit: 'cloves' },
    { item: 'Butter', amount: '3', unit: 'tbsp' },
    { item: 'Parsley', amount: '1', unit: 'tbsp' }
  ],
  instructions: []
};

export const TrialWizard: React.FC<TrialWizardProps> = ({ onSave }) => {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [selections, setSelections] = useState({
    mood: 'Comfort',
    meal: 'Dinner',
    time: '30 min',
    servings: 2
  });
  const [loadingText, setLoadingText] = useState('Analyzing tastes...');
  const [displayRecipe, setDisplayRecipe] = useState<Recipe>(MOCK_GENERATED_RECIPE);

  const handleGenerate = () => {
    setStep('loading');
    
    // Simulate AI loading steps
    setTimeout(() => setLoadingText('Consulting the pantry...'), 1000);
    setTimeout(() => setLoadingText('Calculating macros...'), 2000);
    setTimeout(() => {
        setDisplayRecipe(scaleRecipe(MOCK_GENERATED_RECIPE, selections.servings));
        setStep('result');
    }, 3000);
  };

  const SelectionRow = ({ label, options, category }: { label: string, options: string[], category: keyof typeof selections }) => (
    <div className="mb-6">
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const isActive = selections[category] === opt;
            return (
              <button
                key={opt}
                onClick={() => setSelections(prev => ({ ...prev, [category]: opt }))}
                className={`
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 
                    ${isActive 
                        ? 'bg-gradient-to-b from-chef-green-light to-chef-green text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-600/20 border-t border-white/20' 
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:scale-105 hover:border-zinc-300 shadow-sm'
                    }
                `}
              >
                {opt}
              </button>
            )
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto min-h-[450px] relative">
      <AnimatePresence mode="wait">
        
        {/* INPUT STEP */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="
                backdrop-blur-xl bg-white/70 
                border border-white/50 ring-1 ring-zinc-900/5 
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                rounded-3xl p-8
            "
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">What are we eating?</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                 <Wand2 className="w-5 h-5 text-chef-green" />
              </div>
            </div>

            <SelectionRow label="I'm feeling..." options={SELECTIONS.mood} category="mood" />
            <SelectionRow label="For..." options={SELECTIONS.meal} category="meal" />
            
            {/* Split row for Time and People */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">
                        Ready in...
                    </label>
                    <div className="flex flex-col gap-2">
                        {SELECTIONS.time.map((opt) => {
                           const isActive = selections.time === opt;
                           return (
                            <button
                                key={opt}
                                onClick={() => setSelections(prev => ({ ...prev, time: opt }))}
                                className={`
                                    px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-center
                                    ${isActive 
                                        ? 'bg-gradient-to-b from-chef-green-light to-chef-green text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-600/20 border-t border-white/20' 
                                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm'
                                    }
                                `}
                            >
                                {opt}
                            </button>
                           )
                        })}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 pl-1">
                        People
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {PEOPLE_OPTIONS.map((num) => {
                            const isActive = selections.servings === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => setSelections(prev => ({ ...prev, servings: num }))}
                                    className={`
                                        py-2 rounded-xl text-sm font-bold transition-all duration-200 
                                        ${isActive 
                                            ? 'bg-gradient-to-b from-chef-green-light to-chef-green text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-600/20 border-t border-white/20' 
                                            : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm'
                                        }
                                    `}
                                >
                                    {num}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-10">
              <Button fullWidth size="lg" onClick={handleGenerate} className="shadow-lg shadow-emerald-500/20">
                Generate Idea
              </Button>
            </div>
          </motion.div>
        )}

        {/* LOADING STEP */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="
                backdrop-blur-xl bg-white/70 
                border border-white/50 ring-1 ring-zinc-900/5 
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                rounded-3xl p-8 flex flex-col items-center justify-center h-[550px]
            "
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-zinc-100 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-t-chef-green border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-chef-green animate-pulse" />
              </div>
            </div>
            <p className="text-zinc-600 font-medium animate-pulse tracking-tight">{loadingText}</p>
          </motion.div>
        )}

        {/* RESULT STEP */}
        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
                backdrop-blur-xl bg-white/80 
                border border-white/60 ring-1 ring-zinc-900/5 
                shadow-2xl shadow-emerald-500/10
                rounded-3xl overflow-hidden
            "
          >
            {/* Result Header */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-transparent p-4 flex items-center justify-between border-b border-zinc-100">
              <span className="text-xs font-bold text-chef-green uppercase tracking-wider flex items-center">
                <Wand2 className="w-3 h-3 mr-2" />
                Perfect Match
              </span>
              <button 
                onClick={() => setStep('input')}
                className="text-xs font-semibold text-zinc-500 hover:text-chef-black transition-colors"
              >
                Start Over
              </button>
            </div>

            <div className="p-8">
               {/* Recipe Content */}
               <div className="flex justify-between items-start mb-6">
                  <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                    <Users className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">{selections.servings} People</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm font-bold text-orange-600 bg-orange-50/80 border border-orange-100 px-3 py-1.5 rounded-full">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{displayRecipe.stats.calories} kcal</span>
                  </div>
               </div>

              <h2 className="text-2xl font-extrabold text-zinc-900 mb-4 leading-tight tracking-tight text-balance">
                {displayRecipe.title}
              </h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                {displayRecipe.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-sm font-medium text-zinc-600">
                  <Clock className="w-4 h-4 mr-2 text-chef-green" />
                  {displayRecipe.stats.prepTime + displayRecipe.stats.cookTime} min total
                </div>
                <div className="flex items-center text-sm font-medium text-zinc-600">
                   <ShoppingBag className="w-4 h-4 mr-2 text-chef-green" />
                   {displayRecipe.ingredients.length} ingredients
                </div>
              </div>

               {/* Ingredients Preview */}
               <div className="mb-8 p-5 bg-zinc-50/50 rounded-2xl border border-zinc-100/50">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Shopping List Preview</p>
                  <ul className="space-y-3">
                     {displayRecipe.ingredients.slice(0, 3).map((ing, i) => (
                       <li key={i} className="text-sm text-zinc-700 flex items-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-chef-green mr-3 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                         <span className="font-semibold mr-1 text-zinc-900">{ing.amount} {ing.unit}</span> {ing.item}
                       </li>
                     ))}
                     {displayRecipe.ingredients.length > 3 && (
                        <li className="text-xs text-zinc-400 pl-4 italic pt-1">
                           + {displayRecipe.ingredients.length - 3} more items...
                        </li>
                     )}
                  </ul>
               </div>

              <Button fullWidth size="lg" onClick={onSave} className="group shadow-lg shadow-emerald-500/20">
                <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Save & Shop This
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
