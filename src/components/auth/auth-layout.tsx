"use client";

import { ReactNode, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthModal } from "./auth-modal";

interface AuthLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  className?: string;
}

export function AuthLayout({ children, requireAuth = false, className }: AuthLayoutProps) {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    userType: 'client' | 'consultant';
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    userType: 'client',
    mode: 'signin'
  });

  return (
    <AppLayout 
      showAuthButtons={!requireAuth}
      className={className}
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
