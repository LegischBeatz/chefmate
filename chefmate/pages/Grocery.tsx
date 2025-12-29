
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, Wand2, CheckCircle2, ArrowRight, 
  ShoppingCart, AlertCircle, Plus, Sparkles, X, ChevronRight, RefreshCw,
  Loader2, Calendar, CheckSquare, ArrowLeft, Save
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ViewState, PendingIngredient, GroceryList } from '../types';
import { 
  getPendingIngredients, removePendingIngredient, clearPendingIngredients, 
  getSavedLists, saveList, deleteList, toggleItemInList 
} from '../lib/api/grocery';
import { GoogleGenAI, Type } from "@google/genai";

interface GroceryProps {
  onNavigate: (view: ViewState) => void;
}

export const Grocery: React.FC<GroceryProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'staging' | 'lists'>('staging');
  
  // Data State
  const [pendingItems, setPendingItems] = useState<PendingIngredient[]>([]);
  const [savedLists, setSavedLists] = useState<GroceryList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedListTemp, setGeneratedListTemp] = useState<GroceryList | null>(null); // Temp hold before naming
  const [newListName, setNewListName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPendingItems(getPendingIngredients());
    setSavedLists(getSavedLists());
  };

  const handleRemovePending = (id: string) => {
    removePendingIngredient(id);
    setPendingItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearStaging = () => {
    clearPendingIngredients();
    setPendingItems([]);
  };

  const handleDeleteList = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this list?")) {
        deleteList(id);
        refreshData();
        if (selectedListId === id) setSelectedListId(null);
    }
  };

  const handleToggleItem = (listId: string, category: string, itemId: string) => {
    toggleItemInList(listId, category, itemId);
    // Optimistic UI update or refresh
    refreshData();
  };

  const generateOptimizedList = async () => {
    if (pendingItems.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("Missing API Key");
      }

      const ai = new GoogleGenAI({ apiKey });

      // Clean payload
      const ingredientsPayload = pendingItems.map(p => `${p.amount} ${p.unit} ${p.item}`).join(", ");

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Consolidate this list of ingredients into a shopping list organized by typical grocery store aisles. 
        Merge duplicate items and sum their quantities (e.g. 2 onions + 1 onion = 3 onions).
        Output strictly valid JSON.
        
        Ingredients: ${ingredientsPayload}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              categories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Category Name like Produce, Dairy" },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          amount: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error("Empty response from AI");

      const parsed = JSON.parse(jsonStr);
      const categories = Array.isArray(parsed.categories) ? parsed.categories : [];

      const tempId = Math.random().toString(36).substr(2, 9);
      const newList: GroceryList = {
        id: tempId,
        name: "", // To be filled by user
        lastUpdated: new Date().toISOString(),
        categories: categories.map((cat: any) => ({
          name: cat.name || 'Uncategorized',
          items: (Array.isArray(cat.items) ? cat.items : []).map((item: any) => ({
             id: Math.random().toString(36).substr(2, 9),
             name: item.name,
             amount: item.amount,
             checked: false
          }))
        }))
      };

      setGeneratedListTemp(newList);
      setNewListName(`Shopping List ${new Date().toLocaleDateString()}`);
      setShowNameModal(true);

    } catch (err: any) {
      console.error(err);
      setError("Failed to generate list. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const finalizeListSave = () => {
    if (generatedListTemp) {
        const finalList = { ...generatedListTemp, name: newListName || "Untitled List" };
        saveList(finalList);
        clearPendingIngredients();
        refreshData();
        
        setShowNameModal(false);
        setGeneratedListTemp(null);
        setActiveTab('lists');
        setSelectedListId(finalList.id);
    }
  };

  // Helper to calculate progress
  const getListProgress = (list: GroceryList) => {
    let total = 0;
    let checked = 0;
    list.categories.forEach(c => {
        c.items.forEach(i => {
            total++;
            if (i.checked) checked++;
        });
    });
    return { total, checked, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
  };

  const activeList = savedLists.find(l => l.id === selectedListId);

  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="grocery" onNavigate={onNavigate} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Grocery</h1>
              <p className="text-zinc-500">Manage your shopping lists.</p>
           </div>
           
           <div className="bg-white p-1 rounded-xl shadow-sm border border-zinc-200 flex">
              <button
                onClick={() => { setActiveTab('staging'); setSelectedListId(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'staging' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Staging ({pendingItems.length})
              </button>
              <button
                onClick={() => { setActiveTab('lists'); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lists' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                My Lists ({savedLists.length})
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STAGING TAB */}
          {activeTab === 'staging' && (
            <motion.div
              key="staging"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-zinc-900 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2 text-chef-green" />
                        Items to Consolidate
                     </h2>
                     {pendingItems.length > 0 && (
                        <button onClick={handleClearStaging} className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline">
                           Clear All
                        </button>
                     )}
                  </div>

                  {pendingItems.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-100 rounded-xl">
                       <ShoppingCart className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                       <h3 className="text-zinc-900 font-bold mb-1">Staging area is empty</h3>
                       <p className="text-zinc-500 text-sm mb-6">Add ingredients from your Saved Recipes or Weekly Plan.</p>
                       <Button variant="outline" onClick={() => onNavigate('saved')}>Browse Recipes</Button>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-8 max-h-[500px] overflow-y-auto pr-2">
                       {pendingItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group">
                             <div>
                                <span className="font-bold text-zinc-900 mr-2">{item.amount} {item.unit}</span>
                                <span className="text-zinc-700">{item.item}</span>
                                {item.source && <span className="text-xs text-zinc-400 ml-2 block sm:inline">• from {item.source}</span>}
                             </div>
                             <button onClick={() => handleRemovePending(item.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                                <X className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center">
                       <AlertCircle className="w-4 h-4 mr-2" /> {error}
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-100">
                     <Button 
                        fullWidth 
                        size="lg" 
                        disabled={pendingItems.length === 0 || isGenerating}
                        onClick={generateOptimizedList}
                        className="shadow-lg shadow-emerald-500/20"
                     >
                        {isGenerating ? (
                           <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Consolidating...</>
                        ) : (
                           <><Wand2 className="w-5 h-5 mr-2" /> Generate & Save List</>
                        )}
                     </Button>
                     <p className="text-center text-xs text-zinc-400 mt-3">
                        AI will merge duplicates and organize by aisle.
                     </p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* LISTS TAB */}
          {activeTab === 'lists' && (
             <motion.div
               key="lists"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
                {!selectedListId ? (
                   /* LISTS INDEX VIEW */
                   <div className="space-y-4">
                      {savedLists.length === 0 ? (
                         <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                               <CheckSquare className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">No Saved Lists</h3>
                            <p className="text-zinc-500 mb-6">Create a list from Staging to see it here.</p>
                            <Button onClick={() => setActiveTab('staging')}>Go to Staging</Button>
                         </div>
                      ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedLists.map(list => {
                               const progress = getListProgress(list);
                               return (
                                   <div 
                                     key={list.id}
                                     onClick={() => setSelectedListId(list.id)}
                                     className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group relative"
                                   >
                                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button 
                                            onClick={(e) => handleDeleteList(e, list.id)}
                                            className="p-2 bg-white rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 border border-zinc-100 shadow-sm"
                                         >
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                      </div>

                                      <div className="flex items-center mb-4">
                                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-chef-green mr-4">
                                            <ShoppingBag className="w-5 h-5" />
                                         </div>
                                         <div>
                                            <h3 className="font-bold text-zinc-900 text-lg leading-tight group-hover:text-chef-green transition-colors">{list.name}</h3>
                                            <p className="text-xs text-zinc-400 flex items-center mt-1">
                                               <Calendar className="w-3 h-3 mr-1" />
                                               {new Date(list.lastUpdated).toLocaleDateString()}
                                            </p>
                                         </div>
                                      </div>

                                      <div className="space-y-2">
                                         <div className="flex justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                            <span>Progress</span>
                                            <span>{progress.checked}/{progress.total} Items</span>
                                         </div>
                                         <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                            <div 
                                               className="h-full bg-chef-green transition-all duration-500"
                                               style={{ width: `${progress.percent}%` }}
                                            />
                                         </div>
                                      </div>
                                   </div>
                               );
                            })}
                         </div>
                      )}
                   </div>
                ) : activeList ? (
                   /* ACTIVE LIST DETAIL VIEW */
                   <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/60 overflow-hidden">
                      <div className="bg-zinc-900 text-white p-6 sticky top-0 z-20">
                         <div className="flex items-center gap-4 mb-4">
                            <button 
                                onClick={() => setSelectedListId(null)}
                                className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold">{activeList.name}</h2>
                                <p className="text-zinc-400 text-xs">Last updated {new Date(activeList.lastUpdated).toLocaleString()}</p>
                            </div>
                         </div>
                         
                         {/* Progress Bar in Header */}
                         <div className="bg-white/10 rounded-full h-1.5 w-full overflow-hidden">
                            <div 
                                className="bg-emerald-400 h-full transition-all duration-300"
                                style={{ width: `${getListProgress(activeList).percent}%` }}
                            />
                         </div>
                      </div>

                      <div className="p-6 md:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                         {activeList.categories?.map((category) => (
                            <div key={category.name}>
                               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 border-b border-zinc-100 pb-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10">
                                  {category.name}
                               </h3>
                               <div className="space-y-2">
                                  {category.items?.map((item) => (
                                     <div 
                                       key={item.id} 
                                       onClick={() => handleToggleItem(activeList.id, category.name, item.id)}
                                       className={`
                                          flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none
                                          ${item.checked 
                                             ? 'bg-zinc-50 border-transparent opacity-60' 
                                             : 'bg-white border-zinc-200 hover:border-emerald-400 shadow-sm'
                                          }
                                       `}
                                     >
                                        <div className={`
                                           w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors flex-shrink-0
                                           ${item.checked 
                                             ? 'bg-emerald-500 border-emerald-500 text-white' 
                                             : 'border-zinc-300 text-transparent'
                                           }
                                        `}>
                                           <CheckCircle2 className="w-4 h-4 fill-current" />
                                        </div>
                                        <div>
                                           <span className={`font-medium ${item.checked ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                                              {item.name}
                                           </span>
                                           <span className={`ml-2 text-sm ${item.checked ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                              {item.amount}
                                           </span>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         ))}
                      </div>
                      
                      <div className="bg-zinc-50 p-4 flex justify-between items-center border-t border-zinc-100">
                         <span className="text-xs text-zinc-400">
                             {getListProgress(activeList).checked} / {getListProgress(activeList).total} items
                         </span>
                         <button 
                            onClick={(e) => handleDeleteList(e, activeList.id)}
                            className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                         >
                            Delete List
                         </button>
                      </div>
                   </div>
                ) : (
                    // Fallback if list not found
                    <div className="text-center py-20">
                        <p>List not found.</p>
                        <Button onClick={() => setSelectedListId(null)}>Back to Lists</Button>
                    </div>
                )}
             </motion.div>
          )}

        </AnimatePresence>

        {/* Name Input Modal */}
        <AnimatePresence>
            {showNameModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowNameModal(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-sm relative z-10 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-zinc-900 mb-4">Name your list</h2>
                        <Input 
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="e.g. Weekly Shop"
                            autoFocus
                        />
                        <div className="flex gap-3 mt-6">
                            <Button fullWidth variant="secondary" onClick={() => setShowNameModal(false)}>Cancel</Button>
                            <Button fullWidth onClick={finalizeListSave}>
                                <Save className="w-4 h-4 mr-2" /> Save List
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </main>
    </div>
  );
};
