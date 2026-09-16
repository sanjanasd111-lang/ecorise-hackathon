import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onGoToSignup: () => void;
  onForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToSignup, onForgotPassword }) => {
  const { signIn, signInWithGoogle, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
            Welcome Back to EcoRise
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Sign in to track your weekly challenges and evolve EcoByte.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-forest-800"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-forest-900 text-[11px] text-gray-400 uppercase tracking-wider font-bold">
            Or
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Quick 1-Click Demo Login */}
          <button
            type="button"
            onClick={async () => {
              await signIn('pioneer@ecorise.org', 'password123');
              onSuccess();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <span>⚡</span>
            <span>1-Click Demo Login (Instant Access)</span>
          </button>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 hover:bg-gray-50 dark:hover:bg-forest-800 text-gray-700 dark:text-gray-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={onGoToSignup}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
