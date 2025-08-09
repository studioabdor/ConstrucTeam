"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Bell,
  Search,
  Menu,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Removed ThemeToggle - now using FloatingThemeToggle
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  showAuthButtons?: boolean;
  onAuthModalOpen?: (type: { isOpen: boolean; userType: 'client' | 'consultant'; mode: 'signin' | 'signup' }) => void;
}

export function Navbar({ showAuthButtons = true, onAuthModalOpen }: NavbarProps) {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (user) {
      // Navigate based on user type
      if (userProfile?.userType === 'consultant') {
        router.push('/dashboard');
      } else {
        router.push('/feed');
      }
    } else {
      router.push('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={handleLogoClick}
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Building2 className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold gradient-text">ConstrucTeam</span>
          </motion.button>

          {/* Search Bar (only when authenticated) */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, consultants..."
                  className="w-full pl-10 pr-4 py-2 glass-card border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">

            {/* Authenticated User Menu */}
            {user ? (
              <>
                {/* Client Post Project Button */}
                {userProfile?.userType === 'client' && (
                  <Button
                    onClick={() => router.push('/project/post')}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 hidden md:flex"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Project
                  </Button>
                )}

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                {/* User Dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block font-medium">
                      {userProfile?.userType === 'consultant' && (userProfile as any)?.useAlias && (userProfile as any)?.aliasName 
                        ? (userProfile as any).aliasName 
                        : userProfile?.displayName || 'User'
                      }
                    </span>
                  </Button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 glass-card p-2 shadow-xl"
                    >
                      {/* User Info */}
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="font-medium">
                          {userProfile?.displayName || 'User'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {userProfile?.email}
                        </p>
                        <p className="text-xs text-blue-500 capitalize">
                          {userProfile?.userType}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              /* Unauthenticated Navigation */
              showAuthButtons && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden md:inline-flex"
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    About
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden md:inline-flex"
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    How it Works
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAuthModalOpen?.({ isOpen: true, userType: 'client', mode: 'signin' })}
                  >
                    Sign In
                  </Button>
                </>
              )
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 py-4"
          >
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/feed"
                  className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  How it Works
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
