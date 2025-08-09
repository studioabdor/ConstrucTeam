"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  DollarSign,
  Building2,
  Settings,
  Plus,
  BarChart3,
  Clock,
  Award,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { ConsultantProfile } from "@/types";
import { 
  DynamicBentoGrid, 
  BentoStat, 
  BentoProgress, 
  BentoPortfolio,
  type BentoItem 
} from "@/components/ui/dynamic-bento-grid";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Recommendations } from "@/components/dashboard/recommendations";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { PortfolioPanel } from "@/components/dashboard/portfolio-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

// Mock data - In real app, this would come from Firebase
const mockStats = {
  totalProjects: 24,
  activeProjects: 8,
  totalEarnings: 2850000,
  profileViews: 1250,
  averageRating: 4.8,
  completionRate: 95
};

const mockRecentProjects = [
  {
    id: "1",
    title: "Modern Villa Interior",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Luxury 4BHK villa with contemporary design elements",
    tags: ["Interior Design", "Luxury", "Villa"],
    status: "completed",
    client: "Sharma Family"
  },
  {
    id: "2", 
    title: "Corporate Office Space",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    description: "Open-plan office design for tech startup",
    tags: ["Commercial", "Modern", "Office"],
    status: "in-progress",
    client: "TechCorp Ltd"
  },
  {
    id: "3",
    title: "Boutique Hotel Lobby",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    description: "Elegant lobby design with local cultural elements",
    tags: ["Hospitality", "Cultural", "Luxury"],
    status: "completed",
    client: "Heritage Hotels"
  }
];

// Mock activities removed - using ActivityFeed component instead

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "analytics" | "activity">("overview");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const isConsultant = userProfile?.userType === 'consultant';
  const consultantProfile = isConsultant ? (userProfile as ConsultantProfile) : null;

  // Dynamic bento items based on content and priority
  const bentoItems: BentoItem[] = [
    // High priority stats - small boxes
    {
      id: "total-projects",
      size: "small",
      contentType: "stat",
      priority: 10,
      children: (
        <BentoStat
          title="Total Projects"
          value={mockStats.totalProjects.toString()}
          change="+3 this month"
          changeType="positive"
          icon={<Briefcase className="h-4 w-4" />}
        />
      )
    },
    {
      id: "active-projects", 
      size: "small",
      contentType: "stat",
      priority: 9,
      children: (
        <BentoStat
          title="Active Projects"
          value={mockStats.activeProjects.toString()}
          icon={<Building2 className="h-4 w-4" />}
        />
      )
    },
    {
      id: "total-earnings",
      size: "medium",
      contentType: "stat", 
      priority: 8,
      children: (
        <BentoStat
          title="Total Earnings"
          value={formatCurrency(mockStats.totalEarnings)}
          change="+12% this quarter"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
      )
    },
    {
      id: "rating",
      size: "small",
      contentType: "stat",
      priority: 7,
      children: (
        <BentoStat
          title="Average Rating"
          value={`${mockStats.averageRating}/5`}
          icon={<Star className="h-4 w-4" />}
        />
      )
    },

    // Progress tracking - wide boxes
    {
      id: "completion-rate",
      size: "wide",
      contentType: "progress",
      priority: 6,
      children: (
        <BentoProgress
          title="Project Completion Rate"
          progress={mockStats.completionRate}
          total={100}
          description="Maintaining excellent delivery standards"
        />
      )
    },

    // Portfolio showcase - large boxes
    {
      id: "featured-project-1",
      size: "large", 
      contentType: "portfolio",
      priority: 5,
      isInteractive: true,
      children: (
        <BentoPortfolio
          title={mockRecentProjects[0].title}
          imageUrl={mockRecentProjects[0].imageUrl}
          description={mockRecentProjects[0].description}
          tags={mockRecentProjects[0].tags}
        />
      ),
      onClick: () => console.log("Open project details")
    },
    {
      id: "featured-project-2",
      size: "medium",
      contentType: "portfolio", 
      priority: 4,
      isInteractive: true,
      children: (
        <BentoPortfolio
          title={mockRecentProjects[1].title}
          imageUrl={mockRecentProjects[1].imageUrl}
          description={mockRecentProjects[1].description}
          tags={mockRecentProjects[1].tags}
        />
      ),
      onClick: () => console.log("Open project details")
    },

    // Activity feed - wide box for better visibility
    {
      id: "recent-activity",
      size: "wide",
      contentType: "activity",
      priority: 3,
      children: (
        <div className="h-full">
          <ActivityFeed limit={3} showHeader={false} />
            </div>
      )
    },

    // Quick actions - medium boxes
    {
      id: "create-post",
      size: "medium",
      contentType: "content",
      priority: 2,
      isInteractive: true,
      children: (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Plus className="h-8 w-8 text-emerald-500 mb-2" />
          <h3 className="font-semibold mb-1">Create New Post</h3>
          <p className="text-xs text-muted-foreground">Share your latest work</p>
              </div>
      ),
      onClick: () => console.log("Create new post")
    },
    {
      id: "view-analytics",
      size: "medium", 
      contentType: "chart",
      priority: 1,
      isInteractive: true,
      children: (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <BarChart3 className="h-8 w-8 text-amber-500 mb-2" />
          <h3 className="font-semibold mb-1">View Analytics</h3>
          <p className="text-xs text-muted-foreground">Track your performance</p>
            </div>
      ),
      onClick: () => setActiveTab("analytics")
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
    </>
  );

  const tabs = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: <BarChart3 className="h-4 w-4" />,
      active: activeTab === "overview",
      onClick: () => setActiveTab("overview")
    },
    { 
      id: "projects", 
      label: "Projects", 
      icon: <Briefcase className="h-4 w-4" />,
      active: activeTab === "projects", 
      onClick: () => setActiveTab("projects")
    },
    { 
      id: "analytics", 
      label: "Portfolio", 
      icon: <Award className="h-4 w-4" />,
      active: activeTab === "analytics",
      onClick: () => setActiveTab("analytics")
    },
    { 
      id: "activity", 
      label: "Activity", 
      icon: <Clock className="h-4 w-4" />,
      active: activeTab === "activity",
      onClick: () => setActiveTab("activity")
    }
  ];
              
              return (
    <AuthLayout requireAuth={true}>
      <PageHeader
        title={`Welcome back, ${consultantProfile?.useAlias && consultantProfile?.aliasName 
          ? consultantProfile.aliasName 
          : userProfile?.displayName || 'User'
        }!`}
        subtitle="Here's what's happening with your projects today."
        actions={headerActions}
        tabs={tabs}
      />

      <PageContainer>
        {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Main Content - Bento Grid */}
            <div className="lg:col-span-3">
              <DynamicBentoGrid 
                items={bentoItems}
                maxColumns={6}
                className="mb-8"
              />
                </div>

            {/* Right Sidebar - Recommendations */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Recommendations userType={userProfile?.userType || 'consultant'} />
                </div>
              </div>
            </motion.div>
        )}

        {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Projects Grid */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockRecentProjects.map((project) => (
                  <div key={project.id} className="glass-card p-6 hover:glass-strong transition-all duration-300">
                    <div 
                      className="w-full h-40 bg-cover bg-center rounded-lg mb-4"
                      style={{ backgroundImage: `url(${project.imageUrl})` }}
                    />
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-md"
                        >
                          {tag}
                    </span>
                  ))}
                </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400' 
                          : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}>
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
              <Button variant="ghost" size="sm">
                        View Details
        </Button>
              </div>
            </div>
        ))}
      </div>
    </div>

            {/* Progress Tracker Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ProgressTracker />
            </div>
          </div>
        </motion.div>
        )}

        {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PortfolioPanel editable={true} />
        </motion.div>
        )}

        {activeTab === "activity" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ActivityFeed />
        </motion.div>
        )}
      </PageContainer>
    </AuthLayout>
  );
}
