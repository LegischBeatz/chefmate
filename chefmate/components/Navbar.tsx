
import React, { useState } from 'react';
import { Menu, X, User, ChefHat, LogOut, Settings as SettingsIcon, CreditCard, ShoppingCart } from 'lucide-react';
import { Button } from './ui/Button';
import { useUser } from '../hooks/useUser';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // If user is logged in, Inspire goes to the app view. If anon, it goes to landing.
  const inspireView: ViewState = user ? 'inspire' : 'landing';

  const navLinks: { label: string; view: ViewState }[] = [
    { label: 'Inspire', view: inspireView },
    { label: 'Weekly Plan', view: 'plan' },
    { label: 'Saved', view: 'saved' },
    { label: 'Grocery', view: 'grocery' },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('landing');
    setIsUserDropdownOpen(false);
  };

  const handleSettingsClick = (tab: 'profile' | 'billing') => {
    localStorage.setItem('chefmate_settings_tab', tab);
    // Dispatch event so Settings page can react if already mounted
    window.dispatchEvent(new Event('settings_tab_changed'));
    onNavigate('settings');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onNavigate(user ? 'inspire' : 'landing')}
          >
            <ChefHat className="h-8 w-8 text-chef-green mr-2" />
            <span className="font-extrabold text-2xl tracking-tight text-chef-black">
              ChefMate
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === link.view 
                    ? 'text-chef-green font-bold' 
                    : 'text-chef-dark hover:text-chef-green'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-chef-black group-hover:text-chef-green transition-colors">{user.name}</p>
                    <p className="text-xs text-chef-dark capitalize">{user.tier} Plan</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-chef-surface flex items-center justify-center ring-2 ring-transparent group-hover:ring-chef-green transition-all overflow-hidden">
                    <User className="h-5 w-5 text-chef-dark" />
                  </div>
                </button>

                {/* Dropdown */}
                {isUserDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-sm font-bold text-chef-black truncate">{user.name}</p>
                        <p className="text-xs text-chef-dark truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => handleSettingsClick('profile')}
                        className="w-full text-left px-4 py-2 text-sm text-chef-dark hover:bg-chef-surface hover:text-chef-green flex items-center"
                      >
                        <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                      </button>
                      <button 
                         onClick={() => handleSettingsClick('billing')}
                        className="w-full text-left px-4 py-2 text-sm text-chef-dark hover:bg-chef-surface hover:text-chef-green flex items-center"
                      >
                         <CreditCard className="w-4 h-4 mr-2" /> Subscription
                      </button>
                      <button 
                         onClick={() => { onNavigate('grocery'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-chef-dark hover:bg-chef-surface hover:text-chef-green flex items-center"
                      >
                         <ShoppingCart className="w-4 h-4 mr-2" /> Grocery List
                      </button>
                      <div className="border-t border-gray-100 my-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => onNavigate('login')}>Log in</Button>
                <Button onClick={() => onNavigate('signup')}>Sign up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-chef-black hover:text-chef-green transition-colors p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-20 shadow-lg h-screen">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.view); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-4 rounded-xl text-base font-semibold text-chef-black hover:bg-chef-surface hover:text-chef-green transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 mt-2 space-y-3">
              {user ? (
                 <div className="px-3">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-chef-surface flex items-center justify-center">
                        <User className="h-5 w-5 text-chef-dark" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-chef-black">{user.name}</p>
                        <p className="text-xs text-chef-dark">{user.email}</p>
                      </div>
                    </div>
                    <Button fullWidth variant="secondary" className="mb-2" onClick={() => handleSettingsClick('profile')}>
                       Settings
                    </Button>
                    <Button fullWidth variant="secondary" className="mb-2" onClick={() => handleSettingsClick('billing')}>
                       Subscription
                    </Button>
                    <Button fullWidth variant="outline" onClick={handleLogout}>
                      Log out
                    </Button>
                 </div>
              ) : (
                <div className="flex flex-col space-y-3 px-3">
                   <Button variant="ghost" fullWidth onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}>Log in</Button>
                   <Button fullWidth onClick={() => { onNavigate('signup'); setIsMobileMenuOpen(false); }}>Sign up free</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
