"use client";

import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

interface AppLayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
  className?: string;
}

export function AppLayout({ children, showAuthButtons = true, className }: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <Navbar 
        showAuthButtons={showAuthButtons}
        onAuthModalOpen={(authState) => {
          // This will be handled by individual pages that need auth modal
          console.log('Auth modal requested:', authState);
        }}
      />
      <main className="relative">
        {children}
      </main>
      <FloatingThemeToggle />
    </div>
  );
}
