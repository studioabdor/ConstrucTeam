"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Star, 
  MapPin, 
  Briefcase, 
  MessageCircle, 
  UserPlus,
  TrendingUp,
  Award,
  Eye,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendedClient {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  projectsCount: number;
  averageBudget: string;
  rating: number;
  lastActive: string;
  mutualConnections: number;
  recentProject?: string;
}

interface RecommendedConsultant {
  id: string;
  name: string;
  specialization: string;
  location: string;
  avatar?: string;
  rating: number;
  projectsCompleted: number;
  responseTime: string;
  hourlyRate: string;
  skills: string[];
  mutualConnections: number;
}

const mockRecommendedClients: RecommendedClient[] = [
  {
    id: "1",
    name: "Rajesh Sharma",
    location: "Mumbai, Maharashtra",
    projectsCount: 3,
    averageBudget: "₹5-12L",
    rating: 4.8,
    lastActive: "2 hours ago",
    mutualConnections: 5,
    recentProject: "Luxury Villa Interior"
  },
  {
    id: "2", 
    name: "Priya Construction Ltd",
    location: "Bangalore, Karnataka",
    projectsCount: 8,
    averageBudget: "₹15-50L",
    rating: 4.9,
    lastActive: "1 day ago",
    mutualConnections: 12,
    recentProject: "Commercial Office Complex"
  },
  {
    id: "3",
    name: "Amit Patel",
    location: "Pune, Maharashtra", 
    projectsCount: 2,
    averageBudget: "₹3-8L",
    rating: 4.6,
    lastActive: "3 hours ago",
    mutualConnections: 3,
    recentProject: "Apartment Renovation"
  }
];

const mockRecommendedConsultants: RecommendedConsultant[] = [
  {
    id: "1",
    name: "Dr. Anita Desai",
    specialization: "Structural Engineer",
    location: "Delhi, India",
    rating: 4.9,
    projectsCompleted: 45,
    responseTime: "< 2 hours",
    hourlyRate: "₹2,500/hr",
    skills: ["Earthquake Design", "Steel Structures", "Foundation"],
    mutualConnections: 8
  },
  {
    id: "2",
    name: "Vikram Singh",
    specialization: "Interior Designer", 
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    projectsCompleted: 67,
    responseTime: "< 4 hours",
    hourlyRate: "₹1,800/hr",
    skills: ["Modern Design", "Space Planning", "3D Visualization"],
    mutualConnections: 15
  }
];

interface RecommendationsProps {
  userType: 'client' | 'consultant';
}

export function Recommendations({ userType }: RecommendationsProps) {
  return (
    <div className="space-y-6">
      {userType === 'consultant' ? (
        /* Recommendations for Consultants */
        <>
          {/* Recommended Clients */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg">Potential Clients</h3>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockRecommendedClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{client.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {client.location}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {client.projectsCount} projects
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {client.rating}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {client.mutualConnections} mutual
                          </span>
                        </div>
                        {client.recentProject && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Recent: {client.recentProject}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {client.averageBudget}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {client.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trending Projects */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg">Trending in Your Area</h3>
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Sustainable Architecture</span>
                <span className="text-emerald-500">+23%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Smart Home Integration</span>
                <span className="text-emerald-500">+18%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Modular Construction</span>
                <span className="text-emerald-500">+15%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Recommendations for Clients */
        <>
          {/* Recommended Consultants */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg">Recommended for You</h3>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockRecommendedConsultants.map((consultant, index) => (
                <motion.div
                  key={consultant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{consultant.name}</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                          {consultant.specialization}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {consultant.location}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {consultant.projectsCompleted} completed
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {consultant.rating}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {consultant.mutualConnections} mutual
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {consultant.skills.slice(0, 2).map((skill) => (
                            <span 
                              key={skill}
                              className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {consultant.skills.length > 2 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{consultant.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {consultant.hourlyRate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Responds {consultant.responseTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="font-heading text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Post a New Project
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Browse Consultants
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Check Messages
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
