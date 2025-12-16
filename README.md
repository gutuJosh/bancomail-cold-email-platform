# Bancomail Email Client

A comprehensive email campaign management application built with Next.js, TypeScript, Redux Toolkit, and Sass. This application provides a complete interface for managing email campaigns using the Woodpecker API.

## Features

### 🔐 Authentication

- Secure login with Woodpecker API key
- Session management using HTTP-only cookies
- Protected routes requiring authentication

### 📧 Campaign Management

- Create new email campaigns with custom subjects and content
- Edit existing campaigns
- View all campaigns with status indicators (draft, active, paused, completed)
- Start and pause campaigns
- Delete campaigns with confirmation

### 👥 Prospect Management

- Upload prospects via CSV files
- CSV validation with detailed error reporting
- View all prospects with their status
- Track prospect engagement (pending, sent, opened, replied, bounced)

### ✉️ Email Account Management

- Add multiple email sending accounts
- Support for Gmail, Outlook, and custom SMTP providers
- Account status tracking
- Remove accounts when no longer needed

### ✉️ Inbox Management

- Read received email in response to your campigns
- Reply to a specific email

### 📊 Statistics Dashboard

- Campaign performance metrics
- Visual representation of:
  - Total emails sent
  - Open rates
  - Reply rates
  - Bounce rates
- Progress bars for quick insights

### 🎨 User Interface

- Clean, modern design with gradient backgrounds
- Responsive layout that works on all devices
- Color-coded status badges
- Intuitive navigation

## Tech Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit with React Redux
- **Styling**: Sass (SCSS) with modular architecture
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **CSV Parsing**: PapaParse
- **Database**: PostgreSQL (Neon-backed)

## Getting Started

1. **Start the Application**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

2. **Login**

   - Navigate to the login page
   - Enter your Woodpecker API key
   - Click "Login" to access the dashboard

3. **Create Your First Campaign**

   - Go to the Campaigns page
   - Click "Create Campaign"
   - Fill in the campaign details (name, subject, content)
   - Save as draft or start immediately

4. **Upload Prospects**

   - Navigate to the Prospects page
   - Click "Upload Prospects"
   - Select a campaign
   - Upload a CSV file with columns: `email`, `first_name`, `last_name`, `company` (optional)

5. **View Statistics**

   - Go to the Campaigns page and click the "Stats" button inside campaign box with status "COMPLEATED", to see campaign performance
   - Monitor open rates, reply rates, and bounce rates

6. **Inbox**

- Navigate to the Inbox page to see a list inbox messages
- Click a email maessage box to read the details
- Send a reply to a specific message

## CSV Format for Prospects

Your CSV file should have the following columns:

```csv
email,first_name,last_name,company,phone,address,city,state,country,industry,website,email_provider
john.doe@example.com,John,Doe,Example Corp,3565133101,piazza della Vittoria,Genova,GE,IT,softwear,www.neosoft.it,bancomail
jane.smith@example.com,Jane,Smith,Tech Inc,3682174151,via dei Mille 44,Genova,GE,IT,softwear,www.menufinder.it,bancomail
```

Required columns:

- `email`: Valid email address
- `first_name`: First name of the prospect
- `last_name`: Last name of the prospect

Optional columns:

- `company`: Company name

Sample File:

- see prospects-sample.csv file in /config folder.

Custom Fileds:

- Woodpecker provides 15 predefined custom fields specifically for personalization, which are referred to in the API as:
  `snippet1, snippet2, ... snippet15`.
- When you upload a prospect list (e.g., a CSV), you map your custom columns (like "Industry," "Custom Link," or "Role") to these available snippet.
- Once you've populated the snippet1 through snippet15 fields via the API, you can use them for hyper-personalization in your email copy within your Woodpecker campaigns. In the email editor, you would insert the corresponding snippet tag (e.g., {{SNIPPET1}} or {{SNIPPET4}}).

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── api/                  # Backend API routes
│   ├── campaigns/            # Campaign pages
│   ├── prospects/            # Prospect pages
│   ├── email-accounts/       # Email account pages
│   ├── stats/campaign_id.    # Statistics page
│   ├── inbox                 # Inbox page
│   └── dashboard/            # Main dashboard
├── components/               # Reusable React components
├── store/                    # Redux store and slices
├── services/                 # API service layer
├── styles/                   # Global Sass styles
└── utils/                    # Utility functions
```

## API Integration

The application uses the actual Woodpecker API:

1. Read the docu here `https://developers.woodpecker.co/docs/`

## Environment Variables

The following environment variables are available:

- `DATABASE_URL`: MySQL connection string
- `SESSION_SECRET`: Secret for session management

## Scripts

- `npm run dev`: Start development server on port 5000
- `npm run build`: Build production bundle
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Key Features Explained

### Redux State Management

The application uses Redux Toolkit for state management with separate slices for:

- Authentication (auth)
- Campaigns (campaigns)
- Prospects (prospects)
- Statistics (stats)
- Email Accounts (emailAccounts)

### Sass Architecture

Modular Sass structure with:

- Global variables for colors, spacing, and typography
- Reusable mixins for buttons, cards, and layouts
- Component-scoped modules for isolated styling

### Form Validation

React Hook Form provides:

- Client-side validation
- Error messages
- Form state management

### CSV Validation

PapaParse handles:

- CSV file parsing
- Header detection
- Data validation
- Error reporting

## Browser Compatibility

The application works on all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

Potential improvements for future versions:

- Real-time campaign updates via webhooks
- Advanced prospect filtering and segmentation
- Email template builder with drag-and-drop
- A/B testing capabilities
- Detailed analytics with charts
- Export functionality for reports
- Multi-language support

## Getting Your Woodpecker API Key

1. Log in to your Woodpecker account
2. Navigate to Settings → API
3. Generate or copy your API key
4. Assign the key to NEXT_PUBLIC_AUTHENTICATION_KEY variable in .env file
5. Use this key to log in to the application

## Support

For issues or questions:

1. Check the application logs in the browser console
2. Verify your Woodpecker API key is valid
3. Ensure your CSV files follow the correct format
4. Check that campaigns have prospects before starting them

## License

This project is private and is proprietary of Bancomail S.p.A
