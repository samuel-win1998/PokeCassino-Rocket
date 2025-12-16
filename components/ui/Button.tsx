import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-violet-900/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/50",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-900/50",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};