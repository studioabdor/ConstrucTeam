"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2,
  MessageCircle,
  Star,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { ProjectSlip, type ProjectSlip as ProjectSlipType } from "@/components/projects/project-slip";

// Mock project slips data
const mockProjectSlips: ProjectSlipType[] = [
  {
    id: "1",
    title: "Modern 3BHK Apartment Interior Design",
    description: "Looking for a contemporary interior designer to transform our 1200 sq ft apartment. We prefer minimalist design with smart storage solutions and neutral color palette.",
    category: "Interior Design",
    location: {
      city: "Gurgaon",
      state: "Haryana", 
      pincode: "122001"
    },
    budget: {
      min: 200000,
      max: 500000,
      currency: "INR"
    },
    timeline: "2-3 months",
    requirements: [
      "Minimalist design approach",
      "Smart storage solutions", 
      "Neutral color palette",
      "Budget-friendly materials"
    ],
    clientName: "Rajesh Kumar",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    urgency: "medium",
    projectType: "residential",
    size: "1200 sq ft",
    slipNumber: "CTC240001A"
  },
  {
    id: "2",
    title: "Corporate Office Space Design",
    description: "Complete office design for a tech startup. Need open-plan layout with meeting rooms, collaborative spaces, and modern tech infrastructure.",
    category: "Architecture",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    },
    budget: {
      min: 800000,
      max: 1500000,
      currency: "INR"
    },
    timeline: "4-6 months",
    requirements: [
      "Open-plan design",
      "Modern tech infrastructure",
      "Collaborative spaces",
      "Energy efficient lighting"
    ],
    clientName: "TechCorp Pvt Ltd",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    urgency: "high",
    projectType: "commercial",
    size: "5000 sq ft",
    slipNumber: "CTC240002B"
  },
  {
    id: "3", 
    title: "Villa Landscape Design",
    description: "Beautiful landscape design for a 2-acre villa plot. Looking for sustainable gardening with water features and outdoor entertainment area.",
    category: "Landscaping",
    location: {
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001"
    },
    budget: {
      min: 300000,
      max: 600000,
      currency: "INR"
    },
    timeline: "3-4 months",
    requirements: [
      "Sustainable gardening",
      "Water features design",
      "Outdoor entertainment area",
      "Native plant species"
    ],
    clientName: "Priya Sharma",
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    urgency: "low",
    projectType: "residential",
    size: "2 acres",
    slipNumber: "CTC240003C"
  },
  {
    id: "4",
    title: "Factory Building Structural Design",
    description: "Industrial factory building design with heavy machinery support. Need structural engineer with industrial construction experience.",
    category: "Structural Engineering",
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001"
    },
    budget: {
      min: 2000000,
      max: 5000000,
      currency: "INR"
    },
    timeline: "6-8 months",
    requirements: [
      "Heavy machinery support",
      "Industrial construction experience",
      "Safety compliance",
      "Earthquake resistant design"
    ],
    clientName: "Industrial Solutions Ltd",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    urgency: "high",
    projectType: "industrial",
    size: "15000 sq ft",
    slipNumber: "CTC240004D"
  },
  {
    id: "5",
    title: "Cafe Interior Renovation",
    description: "Renovating an existing cafe space to create a cozy, Instagram-worthy ambiance. Looking for creative interior design with limited budget.",
    category: "Interior Design",
    location: {
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001"
    },
    budget: {
      min: 150000,
      max: 300000,
      currency: "INR"
    },
    timeline: "1-2 months",
    requirements: [
      "Instagram-worthy design",
      "Cozy ambiance",
      "Budget constraints",
      "Quick turnaround"
    ],
    clientName: "Cafe Dreams",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    urgency: "medium",
    projectType: "renovation", 
    size: "800 sq ft",
    slipNumber: "CTC240005E"
  },
  {
    id: "6",
    title: "Residential Electrical Wiring",
    description: "Complete electrical wiring for new 2-story house. Need licensed electrician with smart home automation experience.",
    category: "Electrical Work",
    location: {
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001"
    },
    budget: {
      min: 80000,
      max: 150000,
      currency: "INR"
    },
    timeline: "3-4 weeks",
    requirements: [
      "Licensed electrician",
      "Smart home automation",
      "Safety standards compliance",
      "Energy efficient solutions"
    ],
    clientName: "Amit Patel",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    urgency: "high",
    projectType: "residential",
    size: "2500 sq ft",
    slipNumber: "CTC240006F"
  }
];

export default function FeedPage() {
  const { } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "residential" | "commercial" | "industrial" | "renovation">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    urgency: "all",
    budget: "all",
    location: "all"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter projects based on active tab and search
  const filteredProjects = mockProjectSlips.filter((project) => {
    const matchesTab = activeTab === "all" || project.projectType === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleInterest = (projectId: string) => {
    console.log("Showing interest in project:", projectId);
    // Here you would implement the interest functionality
  };

  const handleMessage = (projectId: string) => {
    console.log("Opening message for project:", projectId);
    // Here you would implement messaging functionality
  };

  const handleShare = (projectId: string) => {
    console.log("Sharing project:", projectId);
    // Here you would implement sharing functionality
  };

  const tabs = [
    { 
      id: "all", 
      label: "All Projects", 
      icon: <Grid3X3 className="h-4 w-4" />,
      active: activeTab === "all",
      onClick: () => setActiveTab("all")
    },
    { 
      id: "residential", 
      label: "🏠 Residential", 
      active: activeTab === "residential",
      onClick: () => setActiveTab("residential")
    },
    { 
      id: "commercial", 
      label: "🏢 Commercial",
      active: activeTab === "commercial", 
      onClick: () => setActiveTab("commercial")
    },
    { 
      id: "industrial", 
      label: "🏭 Industrial",
      active: activeTab === "industrial",
      onClick: () => setActiveTab("industrial")
    },
    { 
      id: "renovation", 
      label: "🔨 Renovation",
      active: activeTab === "renovation",
      onClick: () => setActiveTab("renovation")
    }
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <AuthLayout>
      <PageHeader
        title="Project Feed"
        subtitle={`Discover ${filteredProjects.length} active projects from clients across India`}
        actions={headerActions}
        tabs={tabs}
      />

      <PageContainer>
        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Urgency</label>
                    <select
                      value={filters.urgency}
                      onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="all">All Urgency Levels</option>
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget Range</label>
                    <select
                      value={filters.budget}
                      onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="all">All Budgets</option>
                      <option value="low">Under ₹2L</option>
                      <option value="medium">₹2L - ₹10L</option>
                      <option value="high">Above ₹10L</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value="all">All Locations</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi NCR</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Project Slips Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectSlip
                    project={project}
                    onInterest={() => handleInterest(project.id)}
                    onMessage={() => handleMessage(project.id)}
                    onShare={() => handleShare(project.id)}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 hover:glass-strong transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {project.projectType === "residential" && "🏠"}
                          {project.projectType === "commercial" && "🏢"}
                          {project.projectType === "industrial" && "🏭"}
                          {project.projectType === "renovation" && "🔨"}
                        </span>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.urgency === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          project.urgency === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}>
                          {project.urgency === "high" ? "🔴 High" : project.urgency === "medium" ? "🟡 Medium" : "🟢 Low"}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 opacity-60" />
                          <span>{project.location.city}, {project.location.state}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 opacity-60" />
                          <span>₹{(project.budget.min / 100000).toFixed(1)}L - ₹{(project.budget.max / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 opacity-60" />
                          <span>{project.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 opacity-60" />
                          <span>{project.clientName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInterest(project.id)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Interest
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessage(project.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later for new projects.
            </p>
            <Button onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </motion.div>
        )}
      </PageContainer>
    </AuthLayout>
  );
}