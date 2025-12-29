
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-full tracking-tight active:scale-[0.98]";
  
  const variants = {
    // Linear Style: Gradient + Inner Highlight (border-t) + Soft Shadow
    primary: "bg-gradient-to-b from-chef-green-light to-chef-green text-white shadow-[0px_4px_10px_rgba(16,185,129,0.3),0px_1px_0px_rgba(255,255,255,0.3)_inset] border-t border-white/20 hover:shadow-[0px_6px_20px_rgba(16,185,129,0.4),0px_1px_0px_rgba(255,255,255,0.3)_inset] hover:-translate-y-[1px]",
    
    // Surface Style: Subtle glass feel
    secondary: "bg-white text-chef-black border border-zinc-200/80 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md",
    
    // Ghost: Clean text only
    ghost: "bg-transparent text-chef-dark hover:text-chef-green hover:bg-chef-green/5",
    
    // Outline: Stronger border
    outline: "bg-transparent border border-zinc-200 text-chef-black hover:border-chef-green hover:text-chef-green"
  };

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-8 py-3.5"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
