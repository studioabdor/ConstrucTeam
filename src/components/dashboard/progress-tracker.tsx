"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  Pause,
  Calendar,
  User,
  MapPin,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  assignee?: string;
  progress: number;
  project: {
    name: string;
    client: string;
    location: string;
  };
}

const mockTasks: ProjectTask[] = [
  {
    id: "1",
    title: "Initial Site Survey",
    description: "Complete measurements and site analysis for villa project",
    status: "completed",
    priority: "high",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignee: "You",
    progress: 100,
    project: {
      name: "Luxury Villa Design",
      client: "Sharma Family",
      location: "Gurgaon"
    }
  },
  {
    id: "2",
    title: "3D Rendering Creation",
    description: "Create detailed 3D visualizations for client approval",
    status: "in_progress",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignee: "Design Team",
    progress: 65,
    project: {
      name: "Modern Office Interior",
      client: "TechCorp Ltd",
      location: "Mumbai"
    }
  },
  {
    id: "3",
    title: "Material Procurement",
    description: "Source and procure approved materials from vendors",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 0,
    project: {
      name: "Cafe Renovation",
      client: "Cafe Dreams",
      location: "Bangalore"
    }
  },
  {
    id: "4",
    title: "Structural Review",
    description: "Engineering review of proposed structural changes",
    status: "overdue",
    priority: "high",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignee: "Structural Engineer",
    progress: 30,
    project: {
      name: "Factory Renovation",
      client: "Industrial Solutions",
      location: "Chennai"
    }
  }
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Pending"
  },
  in_progress: {
    icon: Play,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10", 
    label: "In Progress"
  },
  completed: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Completed"
  },
  overdue: {
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Overdue"
  }
};

const priorityColors = {
  low: "border-l-green-500",
  medium: "border-l-amber-500",
  high: "border-l-red-500"
};

export function ProgressTracker() {
  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="glass-card p-6">
        <h3 className="font-heading text-lg mb-4">Progress Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {mockTasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {mockTasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">
              {mockTasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {mockTasks.filter(t => t.status === 'overdue').length}
            </div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg">Active Tasks</h3>
          <Button variant="outline" size="sm">
            View All Tasks
          </Button>
        </div>

        <div className="space-y-4">
          {mockTasks.map((task, index) => {
            const StatusIcon = statusConfig[task.status].icon;
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${priorityColors[task.priority]} bg-white/5 hover:bg-white/10 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${statusConfig[task.status].bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig[task.status].color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          {task.project.name} • {task.project.client}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 pl-11">
                      {task.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground pl-11">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.dueDate)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {task.project.location}
                      </span>
                      {task.assignee && (
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {task.assignee}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {task.status === 'in_progress' && (
                      <div className="mt-3 pl-11">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color}`}>
                      {statusConfig[task.status].label}
                    </span>
                    {task.status === 'in_progress' && (
                      <Button variant="ghost" size="sm">
                        <Pause className="h-3 w-3" />
                      </Button>
                    )}
                    {task.status === 'pending' && (
                      <Button variant="ghost" size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
