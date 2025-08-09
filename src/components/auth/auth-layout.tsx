"use client";

import { ReactNode, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthModal } from "./auth-modal";

interface AuthLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  className?: string;
  onAuthModalOpen?: (type: { isOpen: boolean; userType: 'client' | 'consultant'; mode: 'signin' | 'signup' }) => void;
}

export function AuthLayout({ children, requireAuth = false, className, onAuthModalOpen }: AuthLayoutProps) {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    userType: 'client' | 'consultant';
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    userType: 'client',
    mode: 'signin'
  });

  const handleAuthModalOpen = (type: { isOpen: boolean; userType: 'client' | 'consultant'; mode: 'signin' | 'signup' }) => {
    setAuthModal(type);
    onAuthModalOpen?.(type);
  };

  return (
    <AppLayout 
      showAuthButtons={!requireAuth}
      className={className}
      onAuthModalOpen={handleAuthModalOpen}
    >
      {children}
      
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        initialUserType={authModal.userType}
        initialMode={authModal.mode}
      />
    </AppLayout>
  );
}
