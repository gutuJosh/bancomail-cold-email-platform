# Woodpecker Email Client

## Overview
A comprehensive email campaign management application built with Next.js, TypeScript, Redux, and Sass. This app integrates with the Woodpecker API to provide a complete email marketing solution.

## Tech Stack
- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit with React Redux
- **Styling**: Sass (SCSS) with modular architecture
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **CSV Parsing**: PapaParse

## Project Structure
```
src/
├── app/                      # Next.js app router pages
│   ├── api/                  # API routes (backend endpoints)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── campaigns/       # Campaign management
│   │   ├── prospects/       # Prospect management
│   │   ├── email-accounts/  # Email account management
│   │   └── stats/           # Statistics endpoints
│   ├── campaigns/           # Campaign pages
│   ├── prospects/           # Prospect pages
│   ├── email-accounts/      # Email account pages
│   ├── stats/               # Statistics page
│   └── dashboard/           # Dashboard page
├── components/              # Reusable React components
│   ├── Navbar/
│   └── Login/
├── store/                   # Redux store configuration
│   ├── slices/             # Redux slices
│   │   ├── authSlice.ts
│   │   ├── campaignsSlice.ts
│   │   ├── prospectsSlice.ts
│   │   ├── statsSlice.ts
│   │   └── emailAccountsSlice.ts
│   ├── hooks.ts            # Redux hooks
│   └── index.ts            # Store configuration
├── services/               # API service layer
│   └── api.ts
├── styles/                 # Global styles and Sass utilities
│   ├── globals.scss
│   ├── _variables.scss
│   └── _mixins.scss
└── utils/                  # Utility functions
    └── csvParser.ts
```

## Features
1. **Authentication System**
   - Login with Woodpecker API key
   - Session management with cookies
   - Protected routes

2. **Campaign Management**
   - Create, edit, and delete campaigns
   - Start and pause campaigns
   - Campaign status tracking (draft, active, paused, completed)

3. **Prospect Management**
   - Upload prospects via CSV
   - CSV validation
   - View all prospects with status

4. **Email Account Management**
   - Add and manage email sending accounts
   - Support for Gmail, Outlook, and custom SMTP
   - Account status tracking

5. **Statistics Dashboard**
   - Campaign performance metrics
   - Open rates, reply rates, bounce rates
   - Visual progress bars and charts

## Getting Started
1. Start the development server (runs on port 5000)
2. Navigate to the login page
3. Enter your Woodpecker API key
4. Access the dashboard and start managing campaigns

## API Routes
All API routes are located in `src/app/api/` and currently use mock data. To integrate with the actual Woodpecker API:

1. Update the API routes to make requests to Woodpecker's API
2. Use the stored API key from cookies for authentication
3. Transform the responses to match the application's data models

## Environment Configuration
- The application runs on port 5000 (required for Replit webview)
- API keys are stored securely in HTTP-only cookies
- Database connection available via DATABASE_URL environment variable

## Recent Changes
- Initial project setup with Next.js 15
- Complete application structure with all pages and components
- Redux store configured with all necessary slices
- Sass styling system with variables and mixins
- API routes with mock data for testing
- CSV upload functionality for prospects

## User Preferences
- None specified yet

## Architecture Decisions
- Used Next.js App Router for better performance and modern React features
- Redux Toolkit for predictable state management
- Sass modules for scoped styling and reusability
- API routes for backend logic to keep the application self-contained
- Cookie-based authentication for security
