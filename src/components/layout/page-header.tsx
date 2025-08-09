"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick?: () => void;
  }>;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  actions, 
  tabs, 
  className = "" 
}: PageHeaderProps) {
  return (
    <div className={`border-b border-white/10 bg-background/80 backdrop-blur-xl ${className}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-muted-foreground mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              {actions}
            </motion.div>
          )}
        </div>

        {/* Tabs Navigation */}
        {tabs && tabs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-1 mt-6"
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={tab.active ? "default" : "ghost"}
                size="sm"
                onClick={tab.onClick}
                className="flex items-center space-x-2"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
