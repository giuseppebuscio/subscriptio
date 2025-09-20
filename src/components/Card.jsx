import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  hover = false, 
  className = '', 
  ...props 
}) => {
  const classes = [
    'card',
    hover && 'card-hover',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
