
import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { ViewState } from '../types';

interface PricingSectionProps {
  onNavigate: (view: ViewState) => void;
  showHeader?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate, showHeader = true }) => {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: '/mo',
      description: 'For the casual home cook.',
      features: ['2 Daily Generations', 'Basic Recipe Saves', 'Standard Support'],
      cta: 'Current Plan',
      variant: 'ghost' as const,
      popular: false
    },
    {
      name: 'Inspire Plus',
      price: '$3',
      period: '/mo',
      description: 'Unlock unlimited creativity.',
      features: ['Unlimited Generations', 'Full Recipe History', 'Ad-free Experience', 'Priority Support'],
      cta: 'Upgrade to Plus',
      variant: 'outline' as const,
      popular: false
    },
    {
      name: 'Planner Pro',
      price: '$5',
      period: '/mo',
      description: 'Put your kitchen on autopilot.',
      features: ['Everything in Plus', 'Weekly Meal Planner', 'Smart Shopping List', 'Macro Tracking', 'Exclusive Recipes'],
      cta: 'Get Planner Pro',
      variant: 'primary' as const,
      popular: true
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[500px] bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-chef-black mb-6 tracking-tight">
              Invest in your <span className="text-chef-green">free time.</span>
            </h2>
            <p className="text-lg text-chef-dark">
              Unlock unlimited decision-making power for less than the cost of a fancy coffee.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`
                relative p-8 rounded-3xl transition-all duration-300
                ${tier.popular 
                  ? 'bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 md:scale-105 z-10' 
                  : 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl hover:bg-white/80'
                }
              `}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> Best Value
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-chef-black mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-extrabold text-chef-black tracking-tight">{tier.price}</span>
                  <span className="text-chef-dark ml-1">{tier.period}</span>
                </div>
                <p className="text-sm text-chef-dark">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start text-sm">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-chef-dark font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.variant} 
                fullWidth 
                size={tier.popular ? 'lg' : 'md'}
                onClick={() => onNavigate(tier.name === 'Starter' ? 'landing' : 'signup')}
                className={tier.popular ? 'shadow-emerald-500/20' : ''}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
