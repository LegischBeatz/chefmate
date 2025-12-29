
import React, { useState } from 'react';
import { ChefHat, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../hooks/useUser';
import { ViewState } from '../types';

interface LoginProps {
  onNavigate: (view: ViewState) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      onNavigate('landing');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chef-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-8 cursor-pointer" onClick={() => onNavigate('landing')}>
          <ChefHat className="h-8 w-8 text-chef-green mr-2" />
          <span className="font-extrabold text-2xl tracking-tight text-chef-black">
            ChefMate
          </span>
        </div>

        <h2 className="text-2xl font-bold text-center text-chef-black mb-2">Welcome back</h2>
        <p className="text-center text-chef-dark mb-8">Enter your details to access your meal plans.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button fullWidth size="lg" type="submit" className="mt-6" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <div className="my-8 flex items-center justify-center space-x-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <Button fullWidth variant="outline" className="flex items-center justify-center">
           <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-chef-dark mt-8">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="font-semibold text-chef-green hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
