import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'btn focus-ring';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
    info: 'btn-info'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '', // default size
    lg: 'btn-lg'
  };
  
  const widthClasses = fullWidth ? 'btn-full' : '';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className
  ].filter(Boolean).join(' ');
  
  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={classes}
      disabled={isDisabled}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <Loader2
          className="mr-2 h-4 w-4 animate-spin"
          size={16}
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
