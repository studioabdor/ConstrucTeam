"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Building2,
  Heart,
  MessageCircle,
  ExternalLink,
  X,
  Star,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ProjectRequest, PortfolioItem, FeedItem } from "@/types";
import { formatCurrency, formatRelativeTime, truncateText } from "@/lib/utils";
import Link from "next/link";

// Mock data - In real app, this would come from Firebase
const mockProjects: ProjectRequest[] = [
  {
    id: "1",
    clientId: "client1",
    title: "Modern 3BHK Apartment Interior Design",
    description: "Looking for a contemporary interior designer to transform our 1200 sq ft apartment. We prefer minimalist design with smart storage solutions.",
    category: "interior",
    location: {
      address: "Sector 15",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122001"
    },
    budgetRange: {
      min: 200000,
      max: 500000,
      currency: "INR"
    },
    timeline: {
      expectedDuration: 45,
      isFlexible: true
    },
    requirements: ["3D visualization", "Modular furniture", "Lighting design"],
    tags: ["modern", "minimalist", "smart-home"],
    status: "open",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    bids: []
  },
  {
    id: "2", 
    clientId: "client2",
    title: "Commercial Office Space Design",
    description: "Need complete interior design for our 5000 sq ft office space. Looking for a professional yet vibrant atmosphere.",
    category: "commercial",
    location: {
      address: "Bandra West",
      city: "Mumbai", 
      state: "Maharashtra",
      pincode: "400050"
    },
    budgetRange: {
      min: 800000,
      max: 1500000,
      currency: "INR"
    },
    timeline: {
      expectedDuration: 60,
      isFlexible: false
    },
    requirements: ["Open workspace design", "Meeting rooms", "Reception area"],
    tags: ["office", "corporate", "vibrant"],
    status: "open",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    bids: []
  }
];

const mockPortfolios: PortfolioItem[] = [
  {
    id: "p1",
    consultantId: "consultant1",
    title: "Luxury Villa Living Room",
    description: "Complete transformation of a 2000 sq ft living area with premium finishes and custom furniture.",
    category: "residential",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
    completionDate: new Date("2023-12-20"),
    projectValue: 800000,
    tags: ["luxury", "villa", "living-room"],
    isPublic: true,
    createdAt: new Date("2024-01-01")
  },
  {
    id: "p2",
    consultantId: "consultant2", 
    title: "Modern Restaurant Interior",
    description: "Contemporary restaurant design with industrial elements and warm lighting.",
    category: "commercial",
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"],
    completionDate: new Date("2023-11-15"),
    projectValue: 1200000,
    tags: ["restaurant", "modern", "industrial"],
    isPublic: true,
    createdAt: new Date("2023-12-15")
  }
];

const tabs = [
  { id: "projects", label: "Projects", icon: Building2 },
  { id: "consultants", label: "Consultants", icon: User },
  { id: "activity", label: "My Activity", icon: Star }
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    // Combine projects and portfolios into feed items
    const projectItems: FeedItem[] = mockProjects.map(project => ({
      id: project.id,
      type: "project",
      data: project,
      priority: 1
    }));

    const portfolioItems: FeedItem[] = mockPortfolios.map(portfolio => ({
      id: portfolio.id,
      type: "portfolio", 
      data: portfolio,
      priority: 2
    }));

    setFeedItems([...projectItems, ...portfolioItems]);
  }, []);

  const filteredItems = feedItems.filter(item => {
    if (activeTab === "projects") return item.type === "project";
    if (activeTab === "consultants") return item.type === "portfolio";
    return true; // activity tab shows all
  }).filter(item => {
    if (!searchQuery) return true;
    
    const data = item.data;
    const searchLower = searchQuery.toLowerCase();
    
    if (item.type === "project") {
      const project = data as ProjectRequest;
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.category.toLowerCase().includes(searchLower) ||
        project.location.city.toLowerCase().includes(searchLower)
      );
    } else {
      const portfolio = data as PortfolioItem;
      return (
        portfolio.title.toLowerCase().includes(searchLower) ||
        portfolio.description.toLowerCase().includes(searchLower) ||
        portfolio.category.toLowerCase().includes(searchLower)
      );
    }
  });

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join ConstrucTeam</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to browse projects and showcase your work
          </p>
          <Link href="/">
            <Button variant="glass">Get Started</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 glass bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold gradient-text">ConstrucTeam</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, consultants..."
                  className="pl-10 w-80 glass"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              {userProfile?.userType === "client" && (
                <Link href="/project/new">
                  <Button variant="glass" size="sm">
                    Post Project
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1">
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

      {/* Feed */}
      <div className="max-w-7xl mx-auto p-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
              onClick={() => setSelectedItem(item)}
            >
              {item.type === "project" ? (
                <ProjectCard project={item.data as ProjectRequest} />
              ) : (
                <PortfolioCard portfolio={item.data as PortfolioItem} />
              )}
            </motion.div>
          ))}
        </Masonry>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'Be the first to post!'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRequest }) {
  return (
    <div className="glass-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-500 transition-colors">
              {truncateText(project.title, 50)}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {project.location.city}, {project.location.state}
            </div>
          </div>
          <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full">
            {project.category}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {truncateText(project.description, 120)}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <DollarSign className="h-3 w-3 mr-2 text-green-500" />
            <span className="font-medium">
              {formatCurrency(project.budgetRange.min)} - {formatCurrency(project.budgetRange.max)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" />
            {project.timeline.expectedDuration} days
            {project.timeline.isFlexible && " (flexible)"}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-500/20 rounded text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(project.createdAt)}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MessageCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ portfolio }: { portfolio: PortfolioItem }) {
  return (
    <div className="glass-card overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group">
      {portfolio.images[0] && (
        <div className="relative h-48 overflow-hidden">
          <div 
            style={{ backgroundImage: `url(${portfolio.images[0]})` }}
            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <div className="text-xs px-2 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
              {portfolio.category}
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-500 transition-colors">
          {truncateText(portfolio.title, 50)}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          {truncateText(portfolio.description, 100)}
        </p>

        {portfolio.projectValue && (
          <div className="flex items-center text-sm mb-4">
            <DollarSign className="h-3 w-3 mr-2 text-green-500" />
            <span className="font-medium">
              {formatCurrency(portfolio.projectValue)}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {portfolio.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-500/20 rounded text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Completed {formatRelativeTime(portfolio.completionDate)}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-8">
          {item.type === "project" ? (
            <ProjectDetails project={item.data as ProjectRequest} />
          ) : (
            <PortfolioDetails portfolio={item.data as PortfolioItem} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectDetails({ project }: { project: ProjectRequest }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              {project.location.address}, {project.location.city}, {project.location.state} - {project.location.pincode}
            </div>
          </div>
          <div className="text-sm px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full">
            {project.category}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" />
              Budget Range
            </h3>
            <p className="text-lg font-medium">
              {formatCurrency(project.budgetRange.min)} - {formatCurrency(project.budgetRange.max)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Timeline
            </h3>
            <p>
              {project.timeline.expectedDuration} days
              {project.timeline.isFlexible && " (flexible)"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Requirements
            </h3>
            <ul className="space-y-1">
              {project.requirements.map((req, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-sm px-3 py-1 bg-gray-500/20 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        <span className="text-sm text-muted-foreground">
          Posted {formatRelativeTime(project.createdAt)}
        </span>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="glass">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="glass">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Proposal
          </Button>
        </div>
      </div>
    </div>
  );
}

function PortfolioDetails({ portfolio }: { portfolio: PortfolioItem }) {
  return (
    <div className="space-y-6">
      {portfolio.images[0] && (
        <div className="relative h-80 rounded-lg overflow-hidden">
          <div 
            style={{ backgroundImage: `url(${portfolio.images[0]})` }}
            className="w-full h-full bg-cover bg-center"
          />
        </div>
      )}

      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{portfolio.title}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Completed {formatRelativeTime(portfolio.completionDate)}
            </div>
          </div>
          <div className="text-sm px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full">
            {portfolio.category}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {portfolio.description}
        </p>
      </div>

      {portfolio.projectValue && (
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            Project Value
          </h3>
          <p className="text-lg font-medium">
            {formatCurrency(portfolio.projectValue)}
          </p>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {portfolio.tags.map((tag) => (
            <span key={tag} className="text-sm px-3 py-1 bg-gray-500/20 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        <span className="text-sm text-muted-foreground">
          Added {formatRelativeTime(portfolio.createdAt)}
        </span>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="glass">
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="glass">
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
