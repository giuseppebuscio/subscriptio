import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const RegisterPage = ({ onRegister, onBackToLogin, error, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  const handleBackToLogin = () => {
    onBackToLogin();
  };

  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && isPasswordValid && isConfirmPasswordValid;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl text-gray-800 dark:text-gray-200 mb-4">
              SUBSCRIPTIO
            </h1>
            
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Crea il tuo account ora.
            </p>
          </motion.div>

          {/* Features Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-1 mb-12"
          >
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Gestisci • Monitora • Analizza
            </div>
          </motion.div>

          {/* Register Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name Input */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-inter text-sm"
                    placeholder="Nome completo"
                    required
                  />
                  <label className="absolute -top-2 left-4 bg-white dark:bg-black px-2 text-xs text-gray-500 dark:text-gray-400">
                    Nome completo
                  </label>
                </div>
              </div>

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
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-inter text-sm"
                    placeholder="Password"
                    required
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
                {!isPasswordValid && formData.password && (
                  <p className="text-xs text-red-500 mt-1">
                    La password deve essere di almeno 6 caratteri
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white font-inter text-sm"
                    placeholder="Conferma password"
                    required
                  />
                  <label className="absolute -top-2 left-4 bg-white dark:bg-black px-2 text-xs text-gray-500 dark:text-gray-400">
                    Conferma password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isConfirmPasswordValid && formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Le password non coincidono
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}

              {/* Register Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!isFormValid || isLoading}
                className="w-full font-normal"
              >
                {isLoading ? 'Caricamento...' : 'Registrati'}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hai già un account?{' '}
                <button
                  onClick={handleBackToLogin}
                  className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  Accedi
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
};

export default RegisterPage;
