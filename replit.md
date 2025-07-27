# Veekend - Venue Discovery Web App

## Overview

Veekend is a modern, single-page web application built with React and Vite that helps users discover amazing venues near them using real-time Google Places data. The app features location-based search, comprehensive filtering, and detailed venue information to help users find restaurants, entertainment spots, and other points of interest.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global state management (auth and venue data)
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session store using connect-pg-simple
- **API Structure**: RESTful API with `/api` prefix for all backend routes

### Authentication System
- **Provider**: Firebase Authentication with Google OAuth
- **Frontend Integration**: Firebase SDK with Zustand store for auth state
- **Backend Integration**: Firebase Admin SDK for token verification
- **Session Management**: Server-side sessions stored in PostgreSQL

## Key Components

### Location & Search System
- **Google Places Integration**: Real-time venue discovery using Google Places API
- **Location Input**: Smart autocomplete search with Google Places Autocomplete
- **Geolocation**: Browser-based location detection for proximity-based results
- **Search Filters**: Category, distance, rating, and price level filtering

### Venue Management
- **Venue Display**: Card-based grid layout with responsive design
- **Venue Details**: Modal and dedicated page views with comprehensive information
- **Wishlist System**: User-specific venue saving functionality
- **Photo Integration**: Google Places photo API integration with proper attribution

### UI/UX Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Skeleton loading and spinner overlays
- **Error Handling**: Toast notifications and error boundaries
- **Dark Mode**: Built-in theme switching support

## Data Flow

### Search Flow
1. User enters location or uses geolocation
2. Location coordinates are resolved via Google Places Geocoding
3. Venues are fetched using Google Places Nearby Search API
4. Results are filtered based on user preferences
5. Venue cards are rendered with lazy-loaded images

### Authentication Flow
1. User initiates Google OAuth via Firebase
2. Firebase returns user credentials and ID token
3. Frontend stores user state in Zustand
4. Backend verifies tokens and manages sessions
5. Protected routes and features are unlocked

### Data Storage
- **User Data**: Stored in PostgreSQL users table
- **Wishlists**: User-venue relationships stored in wishlists table
- **Session Data**: Server-side sessions in PostgreSQL
- **Venue Data**: Fetched in real-time from Google Places API (not cached)

## External Dependencies

### Google Services
- **Google Places API**: Core venue data and search functionality
- **Google Maps JavaScript API**: Location services and geocoding
- **Required API Keys**: Places API, Maps JavaScript API, Geocoding API

### Firebase
- **Firebase Authentication**: User authentication and OAuth
- **Firebase Admin SDK**: Server-side token verification
- **Configuration**: Requires Firebase project setup with Google OAuth enabled

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Uses DATABASE_URL environment variable
- **Migrations**: Managed via Drizzle Kit

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Server bundling for production
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: Express server with tsx for TypeScript execution
- **Database**: Drizzle push for schema synchronization
- **Environment**: NODE_ENV=development

### Production Build
1. **Frontend Build**: Vite builds client to `dist/public`
2. **Backend Build**: ESBuild bundles server to `dist/index.js`
3. **Static Serving**: Express serves built frontend assets
4. **Database**: Production PostgreSQL connection via DATABASE_URL

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps/Places API key
- `VITE_FIREBASE_*`: Firebase configuration variables
- `NODE_ENV`: Environment specification

### Hosting Considerations
- **Static Assets**: Frontend builds to standard web-servable files
- **API Routes**: Express server handles `/api/*` routes
- **Database**: Requires PostgreSQL-compatible hosting
- **Environment**: Node.js runtime required for server