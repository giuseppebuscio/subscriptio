import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Mail, Lock, Eye, EyeOff, Smartphone, Calendar, BarChart3 } from 'lucide-react';

const WelcomePage = React.memo(({ onLogin, onRegister, onGoogleLogin, onAppleLogin, error, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lastError, setLastError] = useState('');

  const triggerShake = useCallback(() => {
    if (!isShaking) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [isShaking]);

  // Attiva l'effetto shake quando c'è un errore e resetta i dati del form
  useEffect(() => {
    if (error && error !== lastError) {
      setLastError(error);
      triggerShake();
      // Reset form data when there's an error
      setFormData({
        email: '',
        password: ''
      });
    }
  }, [error, lastError, triggerShake]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onLogin(formData);
  }, [onLogin, formData]);

  const handleRegister = useCallback(() => {
    onRegister();
  }, [onRegister]);

  const handleGoogleLogin = useCallback(() => {
    onGoogleLogin();
  }, [onGoogleLogin]);

  const handleAppleLogin = useCallback(() => {
    onAppleLogin();
  }, [onAppleLogin]);

  const features = useMemo(() => [
    { text: "Gestisci", icon: Smartphone },
    { text: "Monitora", icon: Calendar },
    { text: "Analizza", icon: BarChart3 }
  ], []);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl text-gray-800 dark:text-gray-200 mb-4">
            SUBSCRIPTIO
          </h1>
          
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
            La piattaforma per gestire i tuoi abbonamenti.
          </p>

          {/* Features Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-1"
          >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              {feature.text}
              {index < features.length - 1 && (
                <span className="mx-2 text-gray-400 dark:text-gray-500">•</span>
              )}
            </motion.div>
          ))}
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Email Input */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-inter text-sm"
                  placeholder="Email"
                  required
                />
                <label className="absolute -top-2 left-4 bg-white dark:bg-black px-2 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </label>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-inter text-sm"
                  placeholder="Password"
                  required
                  animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                />
                <label className="absolute -top-2 left-4 bg-white dark:bg-black px-2 text-xs text-gray-500 dark:text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-[rgb(34,34,34)] hover:bg-[rgb(25,25,25)] text-white font-normal rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Caricamento...' : 'Accedi'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">oppure</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 font-normal rounded-2xl"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Accedi con Google
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-2 font-normal rounded-2xl"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Accedi con Apple
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Non hai ancora un account?{' '}
              <button
                onClick={handleRegister}
                className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
              >
                Registrati
              </button>
            </p>
          </div>
        </motion.div>

        </div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-center py-6 text-gray-500 dark:text-gray-400"
      >
        <p>&copy; 2025 Subscriptio. Tutti i diritti riservati.</p>
      </motion.div>
    </div>
  );
});

export default WelcomePage;
