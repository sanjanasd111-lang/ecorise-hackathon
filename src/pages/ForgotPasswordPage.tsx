import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-forest-900 border border-emerald-500/20 rounded-3xl p-8 shadow-xl">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>

        <h2 className="font-display font-black text-2xl text-gray-900 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Enter the email associated with your account and we'll send you recovery instructions.
        </p>

        {isSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-1">
              Reset Link Sent!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Check your inbox at <strong>{email}</strong> for instructions to reset your password.
            </p>
          </div>
        ) : (
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-forest-800 bg-gray-50 dark:bg-forest-800/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md transition-all"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
