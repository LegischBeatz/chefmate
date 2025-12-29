
import React, { useState, useEffect } from 'react';
import { 
  User, CreditCard, Bell, Shield, Zap, CheckCircle2, 
  Settings as SettingsIcon, Loader2, Camera, Mail, 
  Lock, Smartphone, LogOut, FileText, AlertTriangle,
  ChevronRight, Laptop, Smartphone as PhoneIcon, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../hooks/useUser';
import { Navbar } from '../components/Navbar';
import { ViewState } from '../types';
import { createCheckoutSession } from '../lib/actions';

interface SettingsProps {
    onNavigate: (view: ViewState) => void;
}

// -- Sub-Components --

const Toggle = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) => (
  <button 
    onClick={() => !disabled && onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${checked ? 'bg-chef-green' : 'bg-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute left-1 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const SkeletonLine = ({ className }: { className: string }) => (
  <div className={`bg-gray-100 animate-pulse rounded ${className}`} />
);

const SectionHeading = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-chef-black mb-1">{title}</h2>
    <p className="text-chef-dark text-sm">{description}</p>
  </div>
);

// -- Mock Data --

const MOCK_INVOICES = [
  { id: 'inv_1', date: 'Oct 24, 2023', amount: '$5.00', status: 'Paid', pdf: '#' },
  { id: 'inv_2', date: 'Sep 24, 2023', amount: '$5.00', status: 'Paid', pdf: '#' },
  { id: 'inv_3', date: 'Aug 24, 2023', amount: '$5.00', status: 'Paid', pdf: '#' },
];

const MOCK_SESSIONS = [
  { id: 'ses_1', device: 'MacBook Pro', location: 'Zurich, CH', ip: '192.168.1.1', active: true, icon: Laptop },
  { id: 'ses_2', device: 'iPhone 14', location: 'Zurich, CH', ip: '192.168.1.45', active: false, lastActive: '2 days ago', icon: PhoneIcon },
];

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { user, usage, updateProfile, logout } = useUser();
  
  // -- State --
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'security'>('profile');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Profile State
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [emailVerified, setEmailVerified] = useState(true);
  
  // Billing State
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Notifications State
  const [notifPreferences, setNotifPreferences] = useState({
    weeklyPlan: true,
    newFeatures: true,
    marketing: false,
    securityAlerts: true,
    pushEnabled: false
  });

  // Security State
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // -- Effects --

  // Tab Sync Effect
  useEffect(() => {
    const handleTabChange = () => {
        const storedTab = localStorage.getItem('chefmate_settings_tab');
        if (storedTab && ['profile', 'billing', 'notifications', 'security'].includes(storedTab)) {
          setActiveTab(storedTab as any);
        }
    };

    // Run on mount
    handleTabChange();

    // Listen for events from navbar
    window.addEventListener('settings_tab_changed', handleTabChange);
    return () => window.removeEventListener('settings_tab_changed', handleTabChange);
  }, []);

  // Data Loading Effect
  useEffect(() => {
    // Simulate Initial Data Load
    setTimeout(() => {
      setProfileForm({
        name: user?.name || '',
        email: user?.email || ''
      });
      setIsLoading(false);
    }, 800);
  }, [user]);

  useEffect(() => {
    // Persist Tab Preference
    localStorage.setItem('chefmate_settings_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    // Handle Stripe Redirects
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        updateProfile({ tier: 'pro' });
        showToast("Subscription activated successfully!", 'success');
        
        // Clean URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('success');
        newUrl.searchParams.delete('demo');
        window.history.replaceState({}, '', newUrl);
        
        setActiveTab('billing');
    }
  }, []);

  // -- Handlers --

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProfileSave = () => {
    if (profileForm.email !== user?.email) {
      setEmailVerified(false); // Simulate need for re-verification
      showToast("Profile updated. Verification email sent.", 'success');
    } else {
      showToast("Profile updated successfully.", 'success');
    }
    updateProfile(profileForm);
  };

  const handleAvatarChange = () => {
    // Simulate file picker
    showToast("Avatar updated.", 'success');
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setIsUpgrading(true);
    try {
        const { url, error } = await createCheckoutSession(user.email);
        if (error) {
            showToast(error, 'error');
        } else if (url) {
            window.location.href = url;
        }
    } catch (e) {
        showToast("Something went wrong.", 'error');
    } finally {
        setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = () => {
    // Simulate API call
    updateProfile({ tier: 'free' });
    setShowCancelConfirm(false);
    showToast("Subscription canceled. You are now on the Free tier.", 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast("New passwords do not match.", 'error');
      return;
    }
    // Simulate API call
    setPasswordForm({ current: '', new: '', confirm: '' });
    showToast("Password updated successfully.", 'success');
  };

  const handleDeleteAccount = () => {
    logout();
    onNavigate('landing');
  };

  // -- Renderers --

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar currentView="settings" onNavigate={onNavigate} />
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center animate-in slide-in-from-right-10 duration-300 ${notification.type === 'success' ? 'bg-chef-green text-white' : 'bg-red-500 text-white'}`}>
            <CheckCircle2 className="w-5 h-5 mr-3" />
            <span className="font-semibold">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-80 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-chef-black mb-8 tracking-tight">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-1 sticky top-28">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeTab === item.id 
                    ? 'bg-white text-chef-green shadow-sm ring-1 ring-gray-200' 
                    : 'text-chef-dark hover:bg-white hover:text-chef-black hover:shadow-sm'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-chef-green' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-9 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[600px] p-6 md:p-10 relative overflow-hidden">
            
            {isLoading ? (
              // Loading Skeleton
              <div className="space-y-8 animate-in fade-in">
                <div className="space-y-4">
                  <SkeletonLine className="w-1/3 h-8" />
                  <SkeletonLine className="w-2/3 h-4" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <SkeletonLine className="w-32 h-4" />
                    <SkeletonLine className="w-48 h-4" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="space-y-2"><SkeletonLine className="w-24 h-4" /><SkeletonLine className="w-full h-12" /></div>
                  <div className="space-y-2"><SkeletonLine className="w-24 h-4" /><SkeletonLine className="w-full h-12" /></div>
                </div>
              </div>
            ) : (
              <>
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div className="animate-in fade-in duration-300">
                  <SectionHeading title="Public Profile" description="Manage your personal information and how you appear to others." />
                  
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-chef-green-light to-chef-green flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
                      </div>
                      <button 
                        onClick={handleAvatarChange}
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-chef-green transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-bold text-gray-900">Profile Picture</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs">Supports JPG, PNG or GIF. Max file size 5MB.</p>
                      <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                        <button onClick={handleAvatarChange} className="text-xs font-semibold text-chef-green hover:underline">Upload New</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="py-8 space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Display Name" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                      <div>
                        <Input 
                          label="Email Address" 
                          value={profileForm.email} 
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        />
                        {!emailVerified && (
                          <p className="text-xs text-amber-600 mt-2 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Pending verification
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleProfileSave}>Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* === BILLING TAB === */}
              {activeTab === 'billing' && (
                <div className="animate-in fade-in duration-300">
                   <SectionHeading title="Subscription & Billing" description="Manage your plan, billing details, and invoices." />

                   {/* Current Plan Card */}
                   <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 relative overflow-hidden">
                      {user?.tier === 'pro' && (
                        <div className="absolute top-0 right-0 bg-chef-green text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                          Active
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                          <h3 className="text-2xl font-extrabold text-chef-black capitalize">{user?.tier} Plan</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {user?.tier === 'pro' 
                              ? 'Renews on Nov 24, 2024 • $5.00/month' 
                              : 'Free forever • Basic features'}
                          </p>
                        </div>
                        {user?.tier === 'pro' ? (
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-chef-green shadow-sm">
                            <Zap className="w-6 h-6 fill-current" />
                          </div>
                        ) : (
                          <Button onClick={handleUpgrade} disabled={isUpgrading}>
                            {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade to Pro'}
                          </Button>
                        )}
                      </div>

                      {/* Usage Meter */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm relative z-10">
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span>Generations Usage</span>
                          {user?.tier === 'pro' ? (
                            <span className="text-chef-green flex items-center"><Zap className="w-3 h-3 mr-1" /> Unlimited</span>
                          ) : (
                            <span>{usage.used} / {usage.limit}</span>
                          )}
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${usage.used >= usage.limit ? 'bg-red-500' : 'bg-chef-green'}`} 
                            style={{ width: user?.tier === 'pro' ? '100%' : `${(usage.used / usage.limit) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Decor */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   </div>

                   {/* Actions & Invoices */}
                   {user?.tier === 'pro' && (
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-4">Invoice History</h3>
                          <div className="border border-gray-100 rounded-xl overflow-hidden">
                             {MOCK_INVOICES.map((inv, i) => (
                               <div key={inv.id} className={`flex items-center justify-between p-4 bg-white ${i !== MOCK_INVOICES.length -1 ? 'border-b border-gray-50' : ''}`}>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{inv.date}</p>
                                    <p className="text-xs text-gray-500">{inv.amount} • {inv.status}</p>
                                  </div>
                                  <a href={inv.pdf} className="text-xs font-medium text-chef-green hover:underline flex items-center">
                                    <FileText className="w-3 h-3 mr-1" /> PDF
                                  </a>
                               </div>
                             ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-4">Plan Management</h3>
                          <div className="space-y-3">
                             <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 flex justify-between items-center transition-colors">
                                Update Payment Method <ChevronRight className="w-4 h-4 text-gray-400" />
                             </button>
                             
                             {!showCancelConfirm ? (
                               <button 
                                 onClick={() => setShowCancelConfirm(true)}
                                 className="w-full text-left px-4 py-3 rounded-lg border border-red-100 text-red-600 text-sm font-medium hover:bg-red-50 flex justify-between items-center transition-colors"
                               >
                                  Cancel Subscription <ChevronRight className="w-4 h-4 text-red-300" />
                               </button>
                             ) : (
                               <div className="p-4 bg-red-50 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                                  <p className="text-sm font-bold text-red-800 mb-1">Are you sure?</p>
                                  <p className="text-xs text-red-600 mb-3">You will lose access to Pro features at the end of your billing period.</p>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="bg-white border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300" onClick={handleCancelSubscription}>Yes, Cancel</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setShowCancelConfirm(false)}>Keep Plan</Button>
                                  </div>
                               </div>
                             )}
                          </div>
                        </div>
                     </div>
                   )}
                </div>
              )}

              {/* === NOTIFICATIONS TAB === */}
              {activeTab === 'notifications' && (
                <div className="animate-in fade-in duration-300 max-w-2xl">
                   <SectionHeading title="Notifications" description="Choose how we communicate with you." />
                   
                   <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                           <h4 className="text-sm font-bold text-gray-900">Weekly Meal Plan</h4>
                           <p className="text-xs text-gray-500">Receive your generated plan every Sunday.</p>
                        </div>
                        <Toggle checked={notifPreferences.weeklyPlan} onChange={(v) => setNotifPreferences({...notifPreferences, weeklyPlan: v})} />
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                           <h4 className="text-sm font-bold text-gray-900">Product Updates</h4>
                           <p className="text-xs text-gray-500">New features and improvements to ChefMate.</p>
                        </div>
                        <Toggle checked={notifPreferences.newFeatures} onChange={(v) => setNotifPreferences({...notifPreferences, newFeatures: v})} />
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                           <h4 className="text-sm font-bold text-gray-900">Marketing Emails</h4>
                           <p className="text-xs text-gray-500">Tips, trends, and special offers.</p>
                        </div>
                        <Toggle checked={notifPreferences.marketing} onChange={(v) => setNotifPreferences({...notifPreferences, marketing: v})} />
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                           <h4 className="text-sm font-bold text-gray-900">Push Notifications</h4>
                           <p className="text-xs text-gray-500">Enable browser notifications for timely alerts.</p>
                        </div>
                        <Toggle 
                          checked={notifPreferences.pushEnabled} 
                          onChange={(v) => {
                             if(v) Notification.requestPermission();
                             setNotifPreferences({...notifPreferences, pushEnabled: v});
                          }} 
                        />
                      </div>
                   </div>

                   <div className="mt-8 flex justify-end">
                      <Button onClick={() => showToast("Preferences saved.", "success")}>Save Preferences</Button>
                   </div>
                </div>
              )}

              {/* === SECURITY TAB === */}
              {activeTab === 'security' && (
                 <div className="animate-in fade-in duration-300">
                    <SectionHeading title="Security & Login" description="Protect your account and manage active sessions." />

                    <div className="grid md:grid-cols-2 gap-12">
                       {/* Password Form */}
                       <div className="space-y-6">
                          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Change Password</h3>
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                             <Input 
                                type="password" 
                                label="Current Password" 
                                value={passwordForm.current}
                                onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                                placeholder="••••••••"
                             />
                             <Input 
                                type="password" 
                                label="New Password" 
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                                placeholder="••••••••"
                             />
                             <Input 
                                type="password" 
                                label="Confirm New Password" 
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                placeholder="••••••••"
                             />
                             <Button type="submit" variant="secondary" className="w-full">Update Password</Button>
                          </form>

                          <div className="pt-6">
                             <div className="flex items-center justify-between mb-2">
                                <div>
                                   <h4 className="text-sm font-bold text-gray-900">Two-Factor Authentication</h4>
                                   <p className="text-xs text-gray-500">Add an extra layer of security.</p>
                                </div>
                                <Toggle checked={false} onChange={() => {}} disabled />
                             </div>
                             <p className="text-[10px] text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">Coming Soon</p>
                          </div>
                       </div>

                       {/* Sessions & Danger Zone */}
                       <div className="space-y-8">
                          <div>
                             <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Active Sessions</h3>
                             <div className="space-y-3">
                                {MOCK_SESSIONS.map(session => (
                                   <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${session.active ? 'bg-green-100 text-chef-green' : 'bg-gray-200 text-gray-500'}`}>
                                            <session.icon className="w-4 h-4" />
                                         </div>
                                         <div>
                                            <p className="text-sm font-semibold text-gray-900">{session.device}</p>
                                            <p className="text-xs text-gray-500">{session.location} • {session.active ? 'Active Now' : session.lastActive}</p>
                                         </div>
                                      </div>
                                      {!session.active && (
                                         <button className="text-xs text-gray-400 hover:text-red-500">Revoke</button>
                                      )}
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                             <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Danger Zone
                             </h3>
                             <p className="text-xs text-red-700 mb-4">
                                Deleting your account is irreversible. All your recipes, plans, and data will be lost.
                             </p>
                             {!showDeleteConfirm ? (
                                <button 
                                  onClick={() => setShowDeleteConfirm(true)}
                                  className="text-xs font-bold text-red-600 hover:underline"
                                >
                                  Delete my account
                                </button>
                             ) : (
                                <div className="space-y-2">
                                   <Button fullWidth size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 border-red-700 text-white shadow-none" onClick={handleDeleteAccount}>
                                      Confirm Deletion
                                   </Button>
                                   <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-red-500 w-full text-center hover:underline">Cancel</button>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
