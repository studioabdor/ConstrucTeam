# 🏗️ ConstrucTeam

<div align="center">

![ConstrucTeam Logo](https://img.shields.io/badge/ConstrucTeam-Connect%20Create%20Construct-blue?style=for-the-badge&logo=building&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-pink?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**Connect. Create. Construct.**

*A modern, curated consultant-client matchmaking platform for the real estate and construction industry in India. Built with cutting-edge technology and stunning glassmorphic UI design.*

[🚀 Live Demo](https://constructeam.vercel.app) • [📖 Documentation](#-getting-started) • [🎨 Design System](#-design-philosophy)

</div>

---

## ✨ Features

### 🎨 **Beautiful Design**
- **Glassmorphic UI** with dark/light theme support
- **Pinterest-style masonry feed** for projects and portfolios
- **Bento-box dashboard** with floating animations
- **Apple-inspired floating tab navigation**
- **Smooth transitions** powered by Framer Motion

### 👥 **Dual User Experience**
- **Clients**: Post project requirements, browse consultants, manage requests
- **Consultants**: Showcase portfolios, bid on projects, manage business

### 🔐 **Authentication & Privacy**
- Firebase Authentication with Google OAuth
- Optional alias profiles for privacy
- Secure user profiles and data management

### 📱 **Core Functionality**
- **Project Request System**: Multi-step form with glassmorphic cards
- **Consultant Onboarding**: Interactive questionnaire with progressive disclosure
- **Pinterest-style Feed**: Browse projects and portfolios with masonry layout
- **Bidding System**: Consultants can propose and bid on projects
- **Dashboard**: Comprehensive business management for consultants

## 🛠️ Tech Stack

### **Frontend (Hosted on Vercel)**
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom glassmorphic utilities
- **Framer Motion** for smooth animations
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Next Themes** for dark/light mode

### **Backend (Firebase)**
- **Firebase Auth** (Email/Password + Google OAuth)
- **Firestore** for real-time data storage
- **Firebase Storage** for image uploads
- **Firebase Functions** for serverless logic

### **UI Components**
- Custom glassmorphic design system
- Responsive masonry grid layout
- Interactive form components
- Animated modal systems

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd synerbuild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
synerbuild/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/              # Authentication flow
│   │   ├── dashboard/         # Consultant dashboard
│   │   ├── feed/              # Pinterest-style feed
│   │   ├── project/           # Project creation flow
│   │   ├── globals.css        # Global styles with glassmorphic utilities
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components  
│   │   ├── feed/              # Feed components
│   │   └── ui/                # Base UI components
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.ts         # Authentication hook
│   ├── lib/                   # Utility libraries
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── utils.ts           # Helper functions
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # All application types
├── public/                    # Static assets
└── package.json
```

## 🎨 Key Features Implemented

### 1. **Landing Page**
- Stunning glassmorphic hero section
- Animated background elements
- Call-to-action buttons for both user types
- Feature showcase with floating cards
- Responsive design with dark/light theme

### 2. **Authentication System**
- Beautiful modal-based auth flow
- Email/password and Google OAuth
- User type selection (Client/Consultant)
- Profile creation and management

### 3. **Project Request Flow**
- Multi-step form with progress indicator
- Category selection with visual icons
- Location picker with Indian states
- Budget and timeline configuration
- Requirements and tags management

### 4. **Consultant Onboarding**
- Interactive questionnaire
- Service category selection
- Expertise and experience input
- Location and preferences setup
- Privacy options with alias support

### 5. **Pinterest-style Feed**
- Masonry grid layout for projects and portfolios
- Real-time search and filtering
- Tab-based navigation (Projects/Consultants/Activity)
- Detailed modal views for projects
- Like and interaction features

### 6. **Consultant Dashboard**
- Bento-box style layout with animated cards
- Comprehensive statistics overview
- Bid management system
- Project portfolio showcase
- Profile editing capabilities
- Settings and privacy controls

## 🎯 Target Users

### **Clients**
- Homeowners planning construction/renovation
- Real estate developers
- Corporate entities needing space design
- Government projects requiring consultants

### **Consultants**
- Architects and interior designers
- Structural and MEP engineers
- Landscape architects
- Project managers and contractors
- Urban planners and sustainability consultants

## 🔄 Future Enhancements

- **Real-time messaging** between clients and consultants
- **Payment integration** with Razorpay
- **Advanced filtering** and AI-powered matching
- **Mobile app** for iOS and Android
- **Video consultations** and virtual meetings
- **Review and rating system** expansion
- **Multi-language support** for Indian regional languages

## 🌟 Design Philosophy

ConstrucTeam follows Apple's design principles with:
- **Clarity**: Clean, purposeful interface design
- **Deference**: Content takes precedence over chrome
- **Depth**: Meaningful motion and beautiful transitions
- **Glassmorphism**: Modern, translucent design elements
- **Accessibility**: Inclusive design for all users

## 🤝 Contributing

This is an MVP built for demonstration. For production deployment:

1. Set up proper Firebase security rules
2. Implement comprehensive error handling
3. Add proper loading states and offline support
4. Set up monitoring and analytics
5. Add comprehensive testing suite

## 📄 License

This project is built as a demonstration of modern web development practices.

## 🌟 **Star the Repository**

If you found this project helpful, please give it a ⭐️ on GitHub!

## 📞 **Connect With Us**

- **GitHub**: [@studioabdor](https://github.com/studioabdor)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/your-profile)
- **Twitter**: [@your_twitter](https://twitter.com/your_twitter)

## 📈 **Project Stats**

![GitHub Repo stars](https://img.shields.io/github/stars/studioabdor/ConstrucTeam?style=social)
![GitHub forks](https://img.shields.io/github/forks/studioabdor/ConstrucTeam?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/studioabdor/ConstrucTeam?style=social)

---

<div align="center">

**Made with ❤️ for India's builders**

*ConstrucTeam Team • 2024*

</div>