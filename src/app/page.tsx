"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";

export default function LandingPage() {
  const [authModal, setAuthModal] = useState({ 
    isOpen: false, 
    userType: 'client' as 'client' | 'consultant',
    mode: 'signin' as 'signin' | 'signup'
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const features = [
    "Verified consultants & architects",
    "Smart project matching",
    "Secure bidding system",
    "Portfolio showcase platform",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between p-6 lg:px-8"
      >
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Building2 className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold gradient-text">ConstrucTeam</span>
        </motion.div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            About
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            How it Works
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAuthModal({ isOpen: true, userType: 'client', mode: 'signin' })}
          >
            Sign In
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center"
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-8">
          <motion.h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">Connect.</span>{" "}
            <span className="gradient-text">Create.</span>{" "}
            <span className="gradient-text">Construct.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            India's premier matchmaking platform for the real estate and construction industry.
            Connect with verified architects, engineers, and specialized consultants through our
            beautiful, intuitive interface.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="glass" 
                size="xl" 
                className="group"
                onClick={() => setAuthModal({ isOpen: true, userType: 'client', mode: 'signup' })}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Post a Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button 
                variant="glassSecondary" 
                size="xl" 
                className="group"
                onClick={() => setAuthModal({ isOpen: true, userType: 'consultant', mode: 'signup' })}
              >
                <Users className="mr-2 h-5 w-5" />
                Join as Consultant
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="mt-32 max-w-6xl mx-auto"
        >
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 text-center hover:glass-strong transition-all duration-300"
              >
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium">{feature}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mt-32 glass-card p-8 lg:p-12 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold gradient-text mb-2"
              >
                500+
              </motion.div>
              <p className="text-muted-foreground">Verified Consultants</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold gradient-text mb-2"
              >
                1000+
              </motion.div>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
                className="text-4xl font-bold gradient-text mb-2"
              >
                50+
              </motion.div>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="relative z-10 border-t border-white/10 bg-background/50 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold">ConstrucTeam</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting India's construction ecosystem, one project at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Post Project</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Consultants</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Consultants</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Join Platform</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Projects</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ConstrucTeam. All rights reserved. Made with ❤️ for India's builders.</p>
          </div>
        </div>
      </motion.footer>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        defaultUserType={authModal.userType}
        defaultMode={authModal.mode}
      />
    </div>
  );
}
