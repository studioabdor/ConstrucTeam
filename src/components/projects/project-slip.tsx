"use client";

import { motion } from "framer-motion";
import { 
  MapPin, 
  DollarSign, 
  User, 
  Clock,
  Tag,
  FileText,
  Star,
  MessageCircle,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export interface ProjectSlip {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    city: string;
    state: string;
    pincode?: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  requirements: string[];
  clientName: string;
  postedAt: Date;
  urgency: "low" | "medium" | "high";
  projectType: "residential" | "commercial" | "industrial" | "renovation";
  size?: string;
  slipNumber: string;
}

interface ProjectSlipProps {
  project: ProjectSlip;
  onInterest?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

// Color schemes based on project type and urgency
const slipColors = {
  residential: {
    low: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800/50",
    medium: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-800/50", 
    high: "bg-gradient-to-br from-red-50 to-pink-50 border-red-200 dark:from-red-950/30 dark:to-pink-950/30 dark:border-red-800/50"
  },
  commercial: {
    low: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/30 dark:to-cyan-950/30 dark:border-blue-800/50",
    medium: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 dark:from-purple-950/30 dark:to-violet-950/30 dark:border-purple-800/50",
    high: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 dark:from-orange-950/30 dark:to-red-950/30 dark:border-orange-800/50"
  },
  industrial: {
    low: "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 dark:from-slate-950/30 dark:to-gray-950/30 dark:border-slate-800/50",
    medium: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-800/50",
    high: "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 dark:from-rose-950/30 dark:to-red-950/30 dark:border-rose-800/50"
  },
  renovation: {
    low: "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 dark:from-teal-950/30 dark:to-cyan-950/30 dark:border-teal-800/50",
    medium: "bg-gradient-to-br from-lime-50 to-green-50 border-lime-200 dark:from-lime-950/30 dark:to-green-950/30 dark:border-lime-800/50",
    high: "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 dark:from-pink-950/30 dark:to-rose-950/30 dark:border-pink-800/50"
  }
};

const urgencyIcons = {
  low: "🟢",
  medium: "🟡", 
  high: "🔴"
};

const projectTypeIcons = {
  residential: "🏠",
  commercial: "🏢",
  industrial: "🏭", 
  renovation: "🔨"
};

export function ProjectSlip({ 
  project, 
  onInterest, 
  onMessage, 
  onShare, 
  onClick,
  showActions = true,
  className = ""
}: ProjectSlipProps) {
  const slipColorClass = slipColors[project.projectType][project.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{ 
        y: -4, 
        rotate: 1,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-6 rounded-lg border-2 shadow-lg hover:shadow-xl 
        transition-all duration-300 max-w-sm w-full
        ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-amber-400/50' : ''}
        ${slipColorClass}
        ${className}
      `}
      style={{
        transform: `rotate(${Math.random() * 2 - 1}deg)`,
      }}
    >
      {/* Slip Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{projectTypeIcons[project.projectType]}</span>
          <span className="text-xs font-mono bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
            #{project.slipNumber}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm">{urgencyIcons[project.urgency]}</span>
          <span className="text-xs uppercase tracking-wide font-semibold opacity-70">
            {project.urgency}
          </span>
        </div>
      </div>

      {/* Project Title */}
      <h3 className="font-bold text-lg mb-2 line-clamp-2">
        {project.title}
      </h3>

      {/* Client Info */}
      <div className="flex items-center space-x-2 mb-3">
        <User className="h-4 w-4 opacity-60" />
        <span className="text-sm font-medium">{project.clientName}</span>
        <span className="text-xs opacity-60">
          {formatRelativeTime(project.postedAt)}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="h-4 w-4 opacity-60" />
        <span className="text-sm">
          {project.location.city}, {project.location.state}
        </span>
      </div>

      {/* Budget */}
      <div className="flex items-center space-x-2 mb-3">
        <DollarSign className="h-4 w-4 opacity-60" />
        <span className="text-sm font-semibold">
          {formatCurrency(project.budget.min)} - {formatCurrency(project.budget.max)}
        </span>
      </div>

      {/* Timeline */}
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="h-4 w-4 opacity-60" />
        <span className="text-sm">{project.timeline}</span>
      </div>

      {/* Category Tag */}
      <div className="flex items-center space-x-2 mb-4">
        <Tag className="h-4 w-4 opacity-60" />
        <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">
          {project.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm opacity-80 line-clamp-3 mb-4">
        {project.description}
      </p>

      {/* Requirements Preview */}
      {project.requirements.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-1 mb-2">
            <FileText className="h-3 w-3 opacity-60" />
            <span className="text-xs font-medium opacity-70">Requirements:</span>
          </div>
          <div className="text-xs opacity-70 space-y-1">
            {project.requirements.slice(0, 3).map((req, index) => (
              <div key={index} className="flex items-start space-x-1">
                <span>•</span>
                <span className="line-clamp-1">{req}</span>
              </div>
            ))}
            {project.requirements.length > 3 && (
              <span className="italic">+{project.requirements.length - 3} more...</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onInterest}
              className="text-xs hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Star className="h-3 w-3 mr-1" />
              Interest
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={onMessage}
              className="text-xs hover:bg-black/5 dark:hover:bg-white/5"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Message
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm" 
            onClick={onShare}
            className="text-xs hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Decorative slip perforation */}
      <div className="absolute -left-1 top-0 bottom-0 w-2 opacity-20">
        <div className="h-full bg-black dark:bg-white" style={{
          WebkitMask: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, black 3px, black 6px)",
          mask: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, black 3px, black 6px)"
        }} />
      </div>
    </motion.div>
  );
}
