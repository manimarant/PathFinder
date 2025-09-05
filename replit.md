# replit.md

## Overview

This is an AI-powered educational assessment and recommendation platform built for universities. The application helps prospective students discover suitable academic programs through an interactive questionnaire that captures their educational background, career goals, and learning preferences. Using OpenAI integration, it provides personalized program recommendations with detailed insights including enrollment data, completion rates, career projections, and financial information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack Query for server state and local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the stack
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot module replacement via Vite middleware in development
- **Error Handling**: Centralized error middleware with structured responses

### Database and Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless database adapter
- **Schema Management**: Drizzle Kit for migrations
- **Development Storage**: In-memory storage fallback for development
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### AI Integration
- **Provider**: OpenAI API for generating personalized recommendations
- **Processing**: Server-side AI calls to ensure API key security
- **Response Structure**: Structured recommendation objects with program insights, career projections, and financial information
- **Fallback**: Demo key support for development environments

### Authentication and Security
- **Session Storage**: Server-side session management
- **API Security**: Server-side OpenAI API key handling
- **Environment Variables**: Secure configuration management for database and API credentials

### Component Architecture
- **Design System**: Shadcn/ui component library with consistent theming
- **Layout**: Responsive design with mobile-first approach
- **Accessibility**: ARIA-compliant components from Radix UI
- **Reusability**: Modular component structure with shared UI primitives

### Development and Build
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Strict type checking across client and server
- **Code Organization**: Monorepo structure with shared schemas between frontend and backend
- **Asset Management**: Static asset handling with Vite

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database
- **AI Service**: OpenAI API for recommendation generation
- **UI Framework**: Radix UI primitives for accessible components
- **Build Tools**: Vite development server and build system

### Development Tools
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation and type safety
- **HTTP Client**: Fetch API with TanStack Query for caching
- **CSS Framework**: Tailwind CSS for utility-first styling

### Third-party Services
- **Font Provider**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Banner**: Replit development environment integration
- **Error Monitoring**: Replit runtime error modal for development

### Package Management
- **Runtime**: ESM modules with Node.js
- **Dependencies**: Comprehensive UI component library, form handling, and database integration
- **Development**: TypeScript compilation, hot reload, and development tooling