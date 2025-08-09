"use client";

import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

interface AppLayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
  className?: string;
  onAuthModalOpen?: (type: { isOpen: boolean; userType: 'client' | 'consultant'; mode: 'signin' | 'signup' }) => void;
}

export function AppLayout({ children, showAuthButtons = true, className, onAuthModalOpen }: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <Navbar 
        showAuthButtons={showAuthButtons}
        onAuthModalOpen={onAuthModalOpen}
      />
      <main className="relative">
        {children}
      </main>
      <FloatingThemeToggle />
    </div>
  );
}
