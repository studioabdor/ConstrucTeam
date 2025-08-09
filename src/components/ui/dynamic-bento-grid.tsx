"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Define different bento box sizes and layouts
export type BentoSize = 
  | "small"      // 1x1 - Quick stats, notifications
  | "medium"     // 2x1 - Recent activities, small charts
  | "large"      // 2x2 - Portfolio showcase, detailed content
  | "wide"       // 3x1 - Progress bars, timeline
  | "tall"       // 1x2 - Navigation, quick actions
  | "xlarge";    // 3x2 - Main content, detailed views

export type BentoContentType = 
  | "stat"
  | "chart"
  | "portfolio"
  | "activity"
  | "progress"
  | "notification"
  | "profile"
  | "content";

export interface BentoItem {
  id: string;
  size: BentoSize;
  contentType: BentoContentType;
  priority: number; // Higher priority items get better positions
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}

interface DynamicBentoGridProps {
  items: BentoItem[];
  className?: string;
  maxColumns?: 3 | 4 | 6;
}

// CSS Grid class mappings for different sizes
const sizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1",
  large: "col-span-2 row-span-2",
  wide: "col-span-3 row-span-1",
  tall: "col-span-1 row-span-2",
  xlarge: "col-span-3 row-span-2",
};

// Responsive size classes for mobile
const responsiveSizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-2 row-span-1 md:col-span-2",
  large: "col-span-2 row-span-2 md:col-span-2",
  wide: "col-span-2 row-span-1 md:col-span-3",
  tall: "col-span-1 row-span-1 md:row-span-2",
  xlarge: "col-span-2 row-span-2 md:col-span-3",
};

// Content-based styling
const contentTypeStyles = {
  stat: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  chart: "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20",
  portfolio: "bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-500/20",
  activity: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20",
  progress: "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20",
  notification: "bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20",
  profile: "bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20",
  content: "bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-gray-500/20",
};

export function DynamicBentoGrid({ items, className, maxColumns = 6 }: DynamicBentoGridProps) {
  // Sort items by priority (higher priority first)
  const sortedItems = [...items].sort((a, b) => b.priority - a.priority);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid gap-4 auto-rows-[120px]", // Base row height
        maxColumns === 3 && "grid-cols-2 md:grid-cols-3",
        maxColumns === 4 && "grid-cols-2 md:grid-cols-4",
        maxColumns === 6 && "grid-cols-2 md:grid-cols-6",
        className
      )}
    >
      {sortedItems.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className={cn(
            "glass-card p-4 hover:glass-strong transition-all duration-300 rounded-xl group",
            responsiveSizeClasses[item.size],
            contentTypeStyles[item.contentType],
            item.isInteractive && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
            item.className
          )}
          onClick={item.onClick}
          whileHover={item.isInteractive ? { scale: 1.02 } : undefined}
          whileTap={item.isInteractive ? { scale: 0.98 } : undefined}
        >
          {item.children}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Pre-built bento components for common use cases
export function BentoStat({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon 
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}) {
  const changeColors = {
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-gray-500",
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className={cn("text-xs", changeColors[changeType])}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

export function BentoProgress({ 
  title, 
  progress, 
  total, 
  description 
}: {
  title: string;
  progress: number;
  total: number;
  description?: string;
}) {
  const percentage = (progress / total) * 100;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span>{progress}/{total}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

export function BentoPortfolio({ 
  title, 
  imageUrl, 
  description, 
  tags 
}: {
  title: string;
  imageUrl: string;
  description: string;
  tags: string[];
}) {
  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 rounded-lg bg-cover bg-center mb-3 min-h-[60px]"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div>
        <h3 className="font-semibold mb-1 text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function BentoActivity({ 
  activities 
}: {
  activities: Array<{
    id: string;
    action: string;
    time: string;
    icon?: ReactNode;
  }>;
}) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3 text-sm">Recent Activity</h3>
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-2">
              {activity.icon && (
                <div className="text-muted-foreground text-xs">{activity.icon}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
