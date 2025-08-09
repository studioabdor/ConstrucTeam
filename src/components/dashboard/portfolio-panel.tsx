"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit3, 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  location: string;
  completedDate: Date;
  client: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  projectValue?: string;
  duration?: string;
}

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Modern Luxury Villa",
    description: "Complete architectural design and interior planning for a 4000 sq ft luxury villa with sustainable features and contemporary aesthetics.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    category: "Architecture",
    location: "Gurgaon, Haryana",
    completedDate: new Date("2024-01-15"),
    client: "Sharma Family",
    tags: ["Luxury", "Sustainable", "Modern", "Villa"],
    views: 1247,
    likes: 89,
    comments: 12,
    featured: true,
    projectValue: "₹2.5 Cr",
    duration: "8 months"
  },
  {
    id: "2",
    title: "Corporate Office Interior",
    description: "Open-plan office design for a tech startup featuring collaborative spaces, modern amenities, and biophilic design elements.",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    category: "Interior Design",
    location: "Mumbai, Maharashtra",
    completedDate: new Date("2023-11-20"),
    client: "TechCorp Ltd",
    tags: ["Corporate", "Modern", "Biophilic", "Tech"],
    views: 892,
    likes: 67,
    comments: 8,
    featured: false,
    projectValue: "₹1.2 Cr",
    duration: "5 months"
  },
  {
    id: "3",
    title: "Boutique Hotel Renovation",
    description: "Heritage building restoration and conversion into a boutique hotel preserving architectural character while adding modern amenities.",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    category: "Renovation",
    location: "Jaipur, Rajasthan",
    completedDate: new Date("2023-09-10"),
    client: "Heritage Hotels",
    tags: ["Heritage", "Renovation", "Hospitality", "Cultural"],
    views: 1567,
    likes: 134,
    comments: 23,
    featured: true,
    projectValue: "₹3.8 Cr",
    duration: "12 months"
  }
];

interface PortfolioPanelProps {
  editable?: boolean;
}

export function PortfolioPanel({ editable = true }: PortfolioPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ["all", "Architecture", "Interior Design", "Renovation", "Structural"];

  const filteredItems = selectedCategory === "all" 
    ? mockPortfolioItems 
    : mockPortfolioItems.filter(item => item.category === selectedCategory);

  const totalViews = mockPortfolioItems.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = mockPortfolioItems.reduce((sum, item) => sum + item.likes, 0);
  const featuredCount = mockPortfolioItems.filter(item => item.featured).length;

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg">Portfolio Overview</h3>
          {editable && (
            <Button
              onClick={() => setShowAddModal(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {mockPortfolioItems.length}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {totalLikes}
            </div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {featuredCount}
            </div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </div>
        </div>
      </div>

      {/* Portfolio Controls */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current h-1 rounded"></div>
                <div className="bg-current h-1 rounded"></div>
                <div className="bg-current h-1 rounded"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Items */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden hover:glass-strong transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                  {item.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  {editable && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold mb-2 line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{item.completedDate.getFullYear()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {item.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {item.comments}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:glass-strong transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{item.location}</span>
                          <span className="mx-2">•</span>
                          <span>{item.client}</span>
                          <span className="mx-2">•</span>
                          <span>{item.projectValue}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {item.likes}
                        </span>
                        {editable && (
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-heading text-xl mb-4">Add New Project</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input id="project-title" placeholder="Enter project title" />
                </div>
                
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <textarea
                    id="project-description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe your project..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-category">Category</Label>
                    <select
                      id="project-category"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Architecture</option>
                      <option>Interior Design</option>
                      <option>Renovation</option>
                      <option>Structural</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="project-location">Location</Label>
                    <Input id="project-location" placeholder="City, State" />
                  </div>
                </div>

                <div>
                  <Label>Project Images</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop images or click to upload
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Add Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
