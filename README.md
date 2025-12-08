# GoalTracker_UX_PWR

A modern goal tracking web application built for a UX course group project.

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Build Tool**: Vite
- **Database**: localStorage (lightweight local storage solution)

## Features

- 🎯 **Dashboard**: Overview of your goals with statistics and recent activity
- 📝 **Goals**: Create, manage, and track your goals
- 📅 **Schedule**: Plan and organize goal-related activities with a weekly calendar view
- 📊 **Analytics**: Track progress with metrics and insights
- ⚙️ **Settings**: Customize your profile and application preferences

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout/         # Layout components (Navbar, Layout wrapper)
├── pages/              # Page components
│   ├── Dashboard/      # Home page with stats
│   ├── Goals/          # Goals management
│   ├── Schedule/       # Weekly schedule view
│   ├── Analytics/      # Progress tracking and analytics
│   └── Settings/       # User settings
├── utils/              # Utility functions
│   └── storage.ts      # Local storage manager for data persistence
└── App.tsx             # Main app with routing configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yarosfct/GoalTracker_UX_PWR.git
cd GoalTracker_UX_PWR
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Component Architecture

The project follows a component-based architecture with:

- **Reusable Components**: Common UI elements in the `components/` directory
- **Page Components**: Feature-specific pages in the `pages/` directory
- **Separation of Concerns**: Each component has its own directory with an index file for easy imports

## Data Storage

The application uses a lightweight localStorage-based solution for data persistence. The storage manager provides:

- Goal management (create, read, update, delete)
- Activity tracking
- User settings persistence

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is part of a UX course group project.

