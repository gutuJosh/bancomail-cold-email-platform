# Woodpecker Email Client

## Overview
A comprehensive email campaign management application built with Next.js, TypeScript, Redux, and Sass. This app integrates with the Woodpecker API to provide a complete email marketing solution with authentication, campaign management, prospect handling, email account setup, and detailed statistics tracking.

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
│   │   ├── new/             # Create campaign
│   │   └── [id]/edit/       # Edit campaign
│   ├── prospects/           # Prospect pages
│   │   └── upload/          # Upload prospects
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
   - Session management with HTTP-only cookies
   - Protected routes

2. **Campaign Management**
   - Create, edit, and delete campaigns
   - Start and pause campaigns
   - Campaign status tracking (draft, active, paused, completed)
   - Full CRUD functionality

3. **Prospect Management**
   - Upload prospects via CSV with validation
   - CSV format: email, first_name, last_name, company (optional)
   - View all prospects with status tracking
   - Status indicators: pending, sent, opened, replied, bounced

4. **Email Account Management**
   - Add and manage email sending accounts
   - Support for Gmail, Outlook, and custom SMTP
   - Account status tracking (active, inactive, error)

5. **Statistics Dashboard**
   - Campaign performance metrics
   - Visual progress bars for open rates, reply rates, bounce rates
   - Real-time statistics tracking
   - Overview cards with total campaigns, active campaigns, emails sent, and total replies

6. **Responsive Design**
   - Modern UI with gradient backgrounds
   - Color-coded status badges
   - Mobile-friendly layouts
   - Smooth transitions and hover effects

## Getting Started
1. Start the development server (runs on port 5000)
2. Navigate to the login page
3. Enter your Woodpecker API key
4. Access the dashboard and start managing campaigns

## API Routes
All API routes are located in `src/app/api/`. The current implementation includes:
- Authentication (login, logout, verify)
- Campaigns (CRUD operations, start/pause)
- Prospects (list, upload)
- Email Accounts (CRUD operations)
- Statistics (campaign metrics)

**Note**: The API routes currently use mock data for testing. To integrate with the actual Woodpecker API:
1. Update the API routes to make requests to Woodpecker's endpoints
2. Use the stored API key from cookies for authentication
3. Transform the responses to match the application's data models
4. Add proper error handling

## Environment Configuration
- The application runs on port 5000 (required for Replit webview)
- API keys are stored securely in HTTP-only cookies
- Database connection available via DATABASE_URL environment variable

## CSV Upload Format
Prospects CSV should include:
- **Required**: email, first_name, last_name
- **Optional**: company

Example:
```csv
email,first_name,last_name,company
john.doe@example.com,John,Doe,Example Corp
jane.smith@example.com,Jane,Smith,Tech Inc
```

## Recent Changes
- November 12, 2025: Complete application build
  - Initial project setup with Next.js 15
  - Complete application structure with all pages and components
  - Redux store configured with all necessary slices
  - Sass styling system with variables and mixins
  - API routes with mock data for testing
  - CSV upload functionality for prospects
  - Campaign edit page added for full CRUD functionality
  - Comprehensive README documentation

## User Preferences
- None specified yet

## Architecture Decisions
- **Next.js App Router**: Modern React features and better performance
- **Redux Toolkit**: Predictable state management with minimal boilerplate
- **Sass Modules**: Scoped styling for component reusability
- **API Routes**: Self-contained backend logic within Next.js
- **Cookie-based Auth**: Secure session management with HTTP-only cookies
- **Form Validation**: Client-side validation with React Hook Form
- **CSV Parsing**: PapaParse for robust CSV file handling

## Next Steps for Production
1. **Woodpecker API Integration**: Replace mock data with actual API calls
2. **Error Handling**: Add comprehensive error handling and user feedback
3. **Loading States**: Implement proper loading indicators
4. **Real-time Updates**: Add webhook support for campaign status updates
5. **Testing**: Add unit and integration tests
6. **Performance**: Optimize bundle size and implement code splitting
7. **Security**: Add rate limiting and API key validation
8. **Deployment**: Configure production deployment settings
