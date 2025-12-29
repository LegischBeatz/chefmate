import React from 'react';
import { BrainCircuit, Filter, CalendarCheck } from 'lucide-react';

export const BentoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
      {/* Card 1 */}
      <div className="bg-chef-surface p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
          <BrainCircuit className="w-6 h-6 text-chef-black" />
        </div>
        <h3 className="text-xl font-bold text-chef-black mb-3">Decision Fatigue Helper</h3>
        <p className="text-chef-dark leading-relaxed">
          The average person spends 90 hours a year deciding what to eat. We cut that to zero.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-chef-black p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-transform duration-300 md:col-span-2 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Smart Constraints</h3>
          <p className="text-gray-400 leading-relaxed max-w-lg">
            "I have chicken, 15 minutes, and I want something spicy." <br/>
            Our engine thrives on your limitations. It doesn't just search; it invents the perfect solution for your specific context.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
          <Filter className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-green-50 border border-green-100 p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-transform duration-300 md:col-span-3">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
            <div className="w-12 h-12 bg-chef-green rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-chef-black mb-2">Weekly Autopilot</h3>
                <p className="text-chef-dark leading-relaxed">
                Like a playlist for your meals. Generate a full week's plan, including consolidated shopping lists and prep instructions, in one click.
                </p>
            </div>
            <div className="ml-auto hidden md:block">
                 <span className="inline-block px-4 py-2 bg-white rounded-full text-xs font-bold text-chef-green shadow-sm">
                    Beta Access
                 </span>
            </div>
        </div>
      </div>
    </div>
  );
};