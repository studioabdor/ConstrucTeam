"use client";

import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Heart, 
  Star, 
  Eye, 
  Share2, 
  Award, 
  TrendingUp, 
  UserPlus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
  MapPin,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'like' | 'comment' | 'project_update' | 'new_follower' | 'project_completion' | 'review' | 'milestone' | 'inquiry';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
    type: 'client' | 'consultant';
  };
  project?: {
    name: string;
    imageUrl?: string;
  };
  metadata?: {
    rating?: number;
    amount?: number;
    location?: string;
  };
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "inquiry",
    title: "New Project Inquiry",
    description: "Priya Sharma is interested in your villa design services",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    user: {
      name: "Priya Sharma",
      type: "client"
    },
    project: {
      name: "Luxury Villa Design",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
    },
    metadata: {
      amount: 2500000,
      location: "Gurgaon"
    },
    isRead: false,
    priority: "high"
  },
  {
    id: "2",
    type: "review",
    title: "New 5-Star Review",
    description: "Rajesh Kumar left an excellent review for your office design project",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: {
      name: "Rajesh Kumar",
      type: "client"
    },
    project: {
      name: "Corporate Office Interior"
    },
    metadata: {
      rating: 5
    },
    isRead: false,
    priority: "medium"
  },
  {
    id: "3",
    type: "project_completion",
    title: "Project Completed",
    description: "Boutique Hotel Renovation has been marked as completed",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    project: {
      name: "Boutique Hotel Renovation",
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
    },
    isRead: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "milestone",
    title: "Milestone Achieved",
    description: "You've completed 50 projects! Congratulations on this achievement.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    priority: "low"
  },
  {
    id: "5",
    type: "like",
    title: "Portfolio Liked",
    description: "15 people liked your Modern Villa Interior design",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    project: {
      name: "Modern Villa Interior",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
    },
    isRead: true,
    priority: "low"
  },
  {
    id: "6",
    type: "new_follower",
    title: "New Connection",
    description: "Amit Patel started following your work",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    user: {
      name: "Amit Patel",
      type: "consultant"
    },
    isRead: true,
    priority: "low"
  }
];

const activityIcons = {
  like: Heart,
  comment: MessageCircle,
  project_update: FileText,
  new_follower: UserPlus,
  project_completion: CheckCircle,
  review: Star,
  milestone: Award,
  inquiry: AlertCircle
};

const activityColors = {
  like: "text-red-500 bg-red-500/10",
  comment: "text-blue-500 bg-blue-500/10",
  project_update: "text-amber-500 bg-amber-500/10",
  new_follower: "text-emerald-500 bg-emerald-500/10",
  project_completion: "text-green-500 bg-green-500/10",
  review: "text-yellow-500 bg-yellow-500/10",
  milestone: "text-purple-500 bg-purple-500/10",
  inquiry: "text-orange-500 bg-orange-500/10"
};

const priorityIndicators = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-gray-300 dark:border-l-gray-600"
};

interface ActivityFeedProps {
  limit?: number;
  showHeader?: boolean;
}

export function ActivityFeed({ limit, showHeader = true }: ActivityFeedProps) {
  const displayActivities = limit ? mockActivities.slice(0, limit) : mockActivities;
  const unreadCount = mockActivities.filter(activity => !activity.isRead).length;

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-heading text-lg">Recent Activity</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Mark All Read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {displayActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClasses = activityColors[activity.type];
          const priorityClass = priorityIndicators[activity.priority];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-lg border-l-4 transition-all duration-300
                ${priorityClass}
                ${activity.isRead 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-amber-500/5 hover:bg-amber-500/10 ring-1 ring-amber-500/20'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {/* Activity Icon */}
                <div className={`p-2 rounded-full ${colorClasses} flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${!activity.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                          {activity.metadata.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{activity.metadata.rating}/5</span>
                            </div>
                          )}
                          {activity.metadata.amount && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>₹{(activity.metadata.amount / 100000).toFixed(1)}L</span>
                            </div>
                          )}
                          {activity.metadata.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.metadata.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* User Info */}
                      {activity.user && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {activity.user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {activity.user.name}
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            activity.user.type === 'client' 
                              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {activity.user.type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Thumbnail */}
                    {activity.project?.imageUrl && (
                      <div 
                        className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0 ml-3"
                        style={{ backgroundImage: `url(${activity.project.imageUrl})` }}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatRelativeTime(activity.timestamp)}</span>
                    </div>

                    {activity.type === 'inquiry' && !activity.isRead && (
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    )}

                    {activity.type === 'review' && (
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Review
                      </Button>
                    )}
                  </div>
                </div>

                {/* Unread Indicator */}
                {!activity.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full"></div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      {limit && mockActivities.length > limit && (
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View All Activity ({mockActivities.length - limit} more)
          </Button>
        </div>
      )}
    </div>
  );
}
