import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'outline' | 'solid';
  children: React.ReactNode;
  showArrow?: boolean;
}

export default function Button({ 
  href, 
  variant = 'outline', 
  children, 
  showArrow = true,
  className = '',
  type = 'button',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center uppercase font-bold tracking-widest text-xs py-4 px-8 border transition-colors duration-200";
  
  const variants = {
    outline: "border-divider text-foreground hover:border-foreground",
    solid: "bg-foreground border-foreground text-background hover:bg-brand hover:border-brand"
  };

  const content = (
    <>
      {children}
      {showArrow && <span className="ml-4 font-normal">→</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {content}
    </button>
  );
}
