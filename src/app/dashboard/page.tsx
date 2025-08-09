"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Eye, 
 
  Calendar, 
  DollarSign,
  Building2,
  MapPin,
  Settings,
  Camera,
  Edit3,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ConsultantProfile } from "@/types";
import Link from "next/link";

// Mock data - In real app, this would come from Firebase
const mockBids = [
  {
    id: "1",
    projectTitle: "Modern 3BHK Apartment Interior",
    clientName: "Rajesh Kumar",
    amount: 350000,
    status: "pending" as const,
    submittedAt: new Date("2024-01-15"),
    location: "Gurgaon, Haryana"
  },
  {
    id: "2", 
    projectTitle: "Commercial Office Design",
    clientName: "TechCorp Ltd",
    amount: 1200000,
    status: "accepted" as const,
    submittedAt: new Date("2024-01-10"),
    location: "Mumbai, Maharashtra"
  },
  {
    id: "3",
    projectTitle: "Villa Landscape Design", 
    clientName: "Priya Sharma",
    amount: 80000,
    status: "rejected" as const,
    submittedAt: new Date("2024-01-08"),
    location: "Pune, Maharashtra"
  }
];

const mockRecentProjects = [
  {
    id: "1",
    title: "Corporate Office Renovation",
    client: "ABC Corp",
    completedAt: new Date("2023-12-20"),
    value: 1500000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
  },
  {
    id: "2", 
    title: "Luxury Apartment Interior",
    client: "John Doe",
    completedAt: new Date("2023-11-15"),
    value: 600000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
  }
];

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  if (!user || !userProfile || userProfile.userType !== "consultant") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            This page is only available for consultants
          </p>
          <Link href="/">
            <Button variant="glass">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalBids: mockBids.length,
    activeBids: mockBids.filter(b => b.status === "pending").length,
    successRate: ((mockBids.filter(b => b.status === "accepted").length / mockBids.length) * 100).toFixed(0),
    totalEarnings: mockRecentProjects.reduce((sum, p) => sum + p.value, 0),
    avgRating: (mockRecentProjects.reduce((sum, p) => sum + p.rating, 0) / mockRecentProjects.length).toFixed(1),
    completedProjects: mockRecentProjects.length
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "profile", label: "My Profile", icon: User },
    { id: "bids", label: "Bids", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Star },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 glass bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold gradient-text">ConstrucTeam</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/feed">
                <Button variant="ghost" size="sm">
                  Browse Projects
                </Button>
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                {userProfile.displayName?.[0] || userProfile.email[0].toUpperCase()}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' 
                      : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {userProfile.userType === 'consultant' && (userProfile as ConsultantProfile).useAlias && (userProfile as ConsultantProfile).aliasName ? (userProfile as ConsultantProfile).aliasName : userProfile.displayName}! 👋
                  </h2>
                  <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your consultancy business
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Today</div>
                  <div className="text-xl font-bold">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">
                    Total
                  </span>
                </div>
                <div className="text-2xl font-bold">{stats.totalBids}</div>
                <div className="text-sm text-muted-foreground">Total Bids</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-2xl font-bold">{stats.activeBids}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                    Rate
                  </span>
                </div>
                <div className="text-2xl font-bold">{stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-purple-500" />
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-500 rounded-full">
                    Total
                  </span>
                </div>
                <div className="text-2xl font-bold">₹{(stats.totalEarnings / 100000).toFixed(1)}L</div>
                <div className="text-sm text-muted-foreground">Earnings</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 text-orange-500" />
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-500 rounded-full">
                    Avg
                  </span>
                </div>
                <div className="text-2xl font-bold">{stats.avgRating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-4 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded-full">
                    Done
                  </span>
                </div>
                <div className="text-2xl font-bold">{stats.completedProjects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bids */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Bids
                </h3>
                <div className="space-y-4">
                  {mockBids.slice(0, 3).map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{bid.projectTitle}</h4>
                        <p className="text-xs text-muted-foreground">{bid.clientName} • {bid.location}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(bid.submittedAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatCurrency(bid.amount)}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          bid.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          bid.status === "accepted" ? "bg-green-500/20 text-green-500" :
                          "bg-red-500/20 text-red-500"
                        }`}>
                          {bid.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => setActiveTab("bids")}>
                  View All Bids
                </Button>
              </motion.div>

              {/* Recent Projects */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-orange-500" />
                  Recent Projects
                </h3>
                <div className="space-y-4">
                  {mockRecentProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                                    <div 
                style={{ backgroundImage: `url(${project.image})` }}
                className="w-12 h-12 rounded-lg bg-cover bg-center"
              />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{project.title}</h4>
                        <p className="text-xs text-muted-foreground">{project.client}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${
                                i < project.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`} />
                            ))}
                          </div>
                          <span className="text-xs font-medium">{formatCurrency(project.value)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => setActiveTab("projects")}>
                  View All Projects
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileTab userProfile={userProfile} isEditing={isEditing} setIsEditing={setIsEditing} />
        )}

        {activeTab === "bids" && (
          <BidsTab bids={mockBids} />
        )}

        {activeTab === "projects" && (
          <ProjectsTab projects={mockRecentProjects} />
        )}

        {activeTab === "settings" && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

function ProfileTab({ userProfile, isEditing, setIsEditing }: { 
  userProfile: {
    displayName?: string;
    email: string;
    useAlias?: boolean;
    aliasName?: string;
    specializations?: string[];
    location?: { city: string; state: string };
    experience?: number;
    rating?: number;
    completedProjects?: number;
    isVerified?: boolean;
    services?: string[];
    preferredProjectSize?: string;
  }; 
  isEditing: boolean; 
  setIsEditing: (editing: boolean) => void 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="glass"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                {userProfile.displayName?.[0] || userProfile.email[0].toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-1/2 transform translate-x-6 translate-y-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold mb-1">
              {userProfile.useAlias && userProfile.aliasName ? userProfile.aliasName : userProfile.displayName}
            </h3>
            
            {userProfile.specializations && userProfile.specializations.length > 0 && (
              <p className="text-muted-foreground mb-2">{userProfile.specializations[0]}</p>
            )}
            
            {userProfile.location && (
              <p className="text-sm text-muted-foreground flex items-center justify-center">
                <MapPin className="h-3 w-3 mr-1" />
                {userProfile.location.city}, {userProfile.location.state}
              </p>
            )}

            <div className="flex items-center justify-center mt-4 space-x-4">
              <div className="text-center">
                <div className="font-bold">{userProfile.experience || 0}</div>
                <div className="text-xs text-muted-foreground">Years Exp</div>
              </div>
              <div className="text-center">
                <div className="font-bold flex items-center">
                  {userProfile.rating || 0}
                  <Star className="h-3 w-3 ml-1 text-yellow-500" />
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{userProfile.completedProjects || 0}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>

            {userProfile.isVerified && (
              <div className="flex items-center justify-center mt-4">
                <Award className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-500 font-medium">Verified Consultant</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Services Offered</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userProfile.services?.map((service: string) => (
                    <span key={service} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">
                      {service.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Specializations</Label>
                <div className="mt-2">
                  {userProfile.specializations?.map((spec: string, index: number) => (
                    <div key={index} className="text-sm mb-1">{spec}</div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Preferred Project Size</Label>
                <div className="mt-2 text-sm capitalize">{userProfile.preferredProjectSize}</div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Experience</Label>
                <div className="mt-2 text-sm">{userProfile.experience} years</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BidsTab({ bids }: { 
  bids: Array<{
    id: string;
    projectTitle: string;
    clientName: string;
    amount: number;
    status: string;
    submittedAt: Date;
    location: string;
  }> 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Bids</h2>
      
      <div className="grid gap-4">
        {bids.map((bid) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{bid.projectTitle}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {bid.clientName}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {bid.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatRelativeTime(bid.submittedAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold mb-2">{formatCurrency(bid.amount)}</div>
                <div className={`text-xs px-3 py-1 rounded-full ${
                  bid.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                  bid.status === "accepted" ? "bg-green-500/20 text-green-500" :
                  "bg-red-500/20 text-red-500"
                }`}>
                  {bid.status.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Project
              </Button>
              {bid.status === "pending" && (
                <Button variant="outline" size="sm" className="glass">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Bid
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ projects }: { 
  projects: Array<{
    id: string;
    title: string;
    client: string;
    completedAt: Date;
    value: number;
    rating: number;
    image: string;
  }> 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button variant="glass" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card overflow-hidden hover:scale-105 transition-transform"
          >
            <div 
              style={{ backgroundImage: `url(${project.image})` }}
              className="w-full h-48 bg-cover bg-center"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Client: {project.client}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${
                      i < project.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`} />
                  ))}
                  <span className="text-sm ml-1">({project.rating})</span>
                </div>
                <div className="text-sm font-medium">{formatCurrency(project.value)}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Completed {formatRelativeTime(project.completedAt)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive notifications about new projects</div>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Receive SMS for urgent updates</div>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Profile Visibility</div>
                <div className="text-sm text-muted-foreground">Make your profile visible to clients</div>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Use Alias</div>
                <div className="text-sm text-muted-foreground">Display alias name instead of real name</div>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Hide Contact Info</div>
                <div className="text-sm text-muted-foreground">Only show contact info to accepted clients</div>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-red-500">Danger Zone</h3>
          <div className="space-y-4">
            <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Deactivate Account
            </Button>
            <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Delete Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
