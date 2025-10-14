# Sadhak Ayurved - Ayurvedic Clinic Management System

A comprehensive web application for managing Ayurvedic clinics, built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of clinic statistics, recent patients, appointments, and medicine inventory
- **Patient Management**: Complete patient records with Dosha types, conditions, and treatment history
- **Appointment Scheduling**: Manage daily appointments and consultations
- **Treatment Plans**: Track Panchakarma therapies and herbal treatment protocols
- **Medicine Inventory**: Monitor stock levels and manage Ayurvedic medicines
- **Reports**: Generate and view clinic reports (Coming Soon)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for authentication)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase:
   - Follow the instructions in `FIREBASE_SETUP_GUIDE.md`
   - Create a `.env.local` file with your Firebase credentials

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Creating Dummy Users

To test authentication, create dummy users:

```bash
npx tsx scripts/create-dummy-users.ts
```

This creates 3 test users:
- user1@sadhak.com (password: password123)
- user2@sadhak.com (password: password123)
- user3@sadhak.com (password: password123)

**View users at:** http://localhost:3000/admin/users

For detailed instructions, see `DUMMY_USERS_GUIDE.md`

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── SadhakAyurvedApp.tsx # Main application component
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Authentication

The application includes Firebase Authentication with:
- Email/Password sign up and sign in
- Protected routes
- User session management
- Admin user management page

**Auth Pages:**
- Sign In/Sign Up: http://localhost:3000/auth
- User Management: http://localhost:3000/admin/users
- Firebase Test: http://localhost:3000/test-firebase

## Features Overview

### Dashboard
- Real-time statistics for patients, appointments, treatments, and medicine stock
- Recent patient list with status indicators
- Today's appointment schedule
- Low stock medicine alerts

### Patient Management
- Comprehensive patient records
- Dosha type classification (Vata, Pitta, Kapha)
- Search and filter functionality
- Patient status tracking

### Appointments
- Daily appointment calendar
- Consultation scheduling
- Weekly overview statistics
- Appointment status management

### Treatments
- Panchakarma therapy catalog
- Herbal treatment protocols
- Active treatment plan tracking
- Progress monitoring

### Medicine Inventory
- Stock level monitoring
- Low stock alerts
- Medicine categorization by therapeutic properties
- Price tracking

## Customization

The application uses Tailwind CSS for styling. You can customize the theme by editing:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global CSS variables

## License

This project is private and proprietary.

## Support

For support and queries, please contact the development team.
