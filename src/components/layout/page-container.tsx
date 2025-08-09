"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  animate?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "7xl": "max-w-7xl",
  full: "max-w-full"
};

const paddingClasses = {
  none: "",
  sm: "px-4 py-4",
  md: "px-4 lg:px-6 py-6",
  lg: "px-4 lg:px-8 py-8"
};

export function PageContainer({ 
  children, 
  className = "", 
  maxWidth = "7xl",
  padding = "md",
  animate = true 
}: PageContainerProps) {
  const containerClasses = `
    ${maxWidthClasses[maxWidth]} 
    ${paddingClasses[padding]} 
    mx-auto 
    ${className}
  `.trim();

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={containerClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
