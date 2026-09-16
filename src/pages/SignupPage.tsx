import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

interface SignupPageProps {
  onSuccess: () => void;
  onGoToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, onGoToLogin }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the EcoRise terms to continue.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(email, password, fullName, city || 'Local Community');
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white">
            Create Eco Account
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Join the community and embark on weekly climate challenges.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, Berlin, Singapore"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400">
              I agree to the EcoRise terms and SDG 13 principles.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 transition-all mt-2"
          >
            <span>{isSubmitting ? 'Creating account...' : 'Create Eco Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={onGoToLogin}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
