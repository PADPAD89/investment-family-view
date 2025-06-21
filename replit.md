# Local Investment Dashboard

## Overview

This is a full-stack investment tracking application built for managing family investment portfolios. The application allows users to track stocks and mutual funds across different family members, providing comprehensive dashboards with charts, tables, and investment analytics.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with custom data management
- **Routing**: React Router for client-side navigation
- **Data Fetching**: TanStack Query for server state management
- **Charts**: Recharts for investment visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: Hot reload with tsx and Vite middleware integration

### Project Structure
- **Monorepo Setup**: Shared schema and types between client and server
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common schema and types in `/shared` directory

## Key Components

### Data Models
- **Users**: Basic user authentication with username/password
- **Investment Types**: Support for Equity and Mutual Fund investments
- **Investment Properties**: Symbol, name, units, buy/current prices, dates
- **Member-based Organization**: Investments grouped by family members

### Frontend Components
- **MainDashboard**: Overview of all family investments with aggregate metrics
- **MemberDashboard**: Individual member portfolio views
- **InvestmentTable**: Sortable, filterable table with CRUD operations
- **InvestmentModal**: Form for adding/editing investments
- **InvestmentCharts**: Pie charts and bar charts for portfolio visualization

### Backend Services
- **Storage Interface**: Abstraction layer for data operations
- **Memory Storage**: Development implementation (easily replaceable with database)
- **Route System**: RESTful API structure ready for implementation
- **Middleware**: Request logging and error handling

## Data Flow

1. **Client State**: React components manage local UI state
2. **Data Layer**: Custom hooks provide data management and business logic
3. **API Communication**: TanStack Query handles server communication (prepared but not implemented)
4. **Server Processing**: Express routes process requests and interact with storage
5. **Data Persistence**: Drizzle ORM manages database operations

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router)
- Express.js for server framework
- Drizzle ORM for database operations
- Neon Database for PostgreSQL hosting

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for icons
- Class Variance Authority for component variants

### Development Tools
- Vite for build tooling and development server
- TypeScript for type safety
- ESBuild for production server bundling
- Replit integration plugins

### Data Visualization
- Recharts for charts and graphs
- Date-fns for date manipulation
- Embla Carousel for interactive components

## Deployment Strategy

### Development Environment
- **Replit Integration**: Optimized for Replit development environment
- **Hot Reload**: Vite dev server with Express middleware integration
- **Database**: PostgreSQL module configured in Replit
- **Port Configuration**: Server runs on port 5000 with external port 80

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit
- **Environment**: Production mode with optimized builds

### Database Configuration
- **Development**: PostgreSQL 16 module in Replit
- **Schema Management**: Drizzle migrations in `/migrations`
- **Connection**: Environment variable `DATABASE_URL` required

## Changelog
- June 21, 2025: Initial setup - migrated from Lovable to Replit
- June 21, 2025: Implemented dynamic state management with React Context
- June 21, 2025: Added portfolio calculation utilities
- June 21, 2025: Connected all UI components to use real data instead of mock data
- June 21, 2025: Fixed bar chart to display investment names instead of symbols
- June 21, 2025: Added automatic price updates every 15 minutes

## User Preferences

Preferred communication style: Simple, everyday language.