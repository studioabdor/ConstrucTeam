// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  userType: 'client' | 'consultant';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProfile extends User {
  userType: 'client';
  companyName?: string;
  phone?: string;
  location?: Location;
}

export interface ConsultantProfile extends User {
  userType: 'consultant';
  services: string[];
  specializations: string[];
  experience: number; // years
  location?: Location;
  portfolio: PortfolioItem[];
  preferredProjectSize: 'small' | 'medium' | 'large' | 'any';
  isVerified: boolean;
  rating: number;
  completedProjects: number;
  useAlias: boolean;
  aliasName?: string;
}

// Project Types
export interface ProjectRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  subcategory?: string;
  location: Location;
  budgetRange: BudgetRange;
  timeline: Timeline;
  requirements: string[];
  images?: string[];
  tags: string[];
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  bids: Bid[];
}

export interface Bid {
  id: string;
  consultantId: string;
  projectId: string;
  amount: number;
  proposedTimeline: number; // days
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  consultantId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  images: string[];
  completionDate: Date;
  projectValue?: number;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
}

// Location Types
export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Utility Types
export interface BudgetRange {
  min: number;
  max: number;
  currency: 'INR';
}

export interface Timeline {
  startDate?: Date;
  expectedDuration: number; // days
  isFlexible: boolean;
}

export type ProjectCategory = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'infrastructure'
  | 'interior'
  | 'landscape'
  | 'structural'
  | 'mep' // Mechanical, Electrical, Plumbing
  | 'consultation';

// Theme Types
export type Theme = 'light' | 'dark';

// Feed Types
export interface FeedItem {
  id: string;
  type: 'project' | 'portfolio';
  data: ProjectRequest | PortfolioItem;
  priority: number;
}

// Form Types
export interface ProjectRequestForm {
  title: string;
  description: string;
  category: ProjectCategory;
  subcategory?: string;
  location: Partial<Location>;
  budgetRange: Partial<BudgetRange>;
  timeline: Partial<Timeline>;
  requirements: string[];
  images?: File[];
  tags: string[];
}

export interface ConsultantOnboardingForm {
  services: string[];
  specializations: string[];
  experience: number;
  location: Partial<Location>;
  portfolioLinks: string[];
  preferredProjectSize: 'small' | 'medium' | 'large' | 'any';
  useAlias: boolean;
  aliasName?: string;
}
