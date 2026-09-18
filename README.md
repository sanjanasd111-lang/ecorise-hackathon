# ECORISE

ECORISE is a climate-action and sustainability platform designed to turn small daily habits into measurable environmental impact. The app combines challenge tracking, animated progress dashboards, EcoByte mascot evolution, community engagement, and intelligent sustainability analytics to motivate users toward meaningful action aligned with SDG 13: Climate Action.

This project was developed for the Ramaiah University Applied Science Micro Hackathon 2026 and is built to be presentation-ready, highly interactive, and easy to demo locally.

## Project Overview

ECORISE helps users:
- Track weekly eco-friendly challenges
- Earn Eco Points for sustainable actions
- Visualize their environmental impact in real time
- Evolve a companion mascot, EcoByte
- Unlock badges and milestone-based achievements
- Participate in local and community sustainability goals
- Learn about climate change and sustainable living through interactive dashboards

## Key Features

### 1. Weekly Eco Challenge System
- 10 curated sustainability tasks across five impact categories:
  - Nature
  - Water
  - Transport
  - Energy
  - Waste
- Real-time point calculation for completed activities
- Search and filters by challenge category
- Instant updates to progress bars, totals, and impact outcomes
- Floating achievement popups and toast notifications

### 2. EcoByte Mascot Evolution
- A custom eco-robot companion named EcoByte
- Mascot stages evolve based on total points:
  - Sprout Robot
  - Energy Seedling
  - Eco Champion
  - Climate Master
- Audio feedback and eco-tips using browser-based sound generation
- Visual transformations and celebration animations

### 3. Badge and Achievement System
- Dynamic milestone badges such as:
  - First Step
  - Water Saver
  - Tree Champion
  - Green Commuter
  - Waste Warrior
  - Energy Guardian
  - Eco Streaker
  - Climate Champion
- Confetti celebration effects at milestone thresholds
- Full-screen reward modal for reaching major progress levels

### 4. Impact Translation and Analytics
- Converts completed actions into measurable sustainability impact such as:
  - Trees supported
  - Water conserved
  - Plastic avoided
  - Transport impact
  - Energy saved
- Circular and bar-chart-based performance visualization
- Category-wise progress breakdown
- Trend charts for weekly performance tracking
- Data-driven sustainability insights

### 5. Community and Leaderboard features
- Community goal meter tracking collective action progress
- Local ranking and leaderboard experiences
- Community participation dashboards
- Shared progress and civic climate engagement elements

### 6. Learning and SDG Alignment
- Educational content mapped to SDG 13: Climate Action
- Real-world climate explanation and habit-to-impact connection
- Dashboard sections designed to communicate climate knowledge clearly to users and judges

### 7. User Experience and Accessibility
- Light and dark mode support
- Responsive layout for desktop and mobile viewing
- Local persistence using browser storage
- Demo controls for quick product presentations
- Ambient environment effects and visual polish
- Intuitive UI with modern dashboard styling

### 8. App Architecture and Backend Integration
- React + Vite frontend
- Express server for backend APIs
- Optional Supabase integration for profile and auth data
- Local storage fallback for demo and offline-friendly usage
- Structured modular project layout for future scaling

## Tech Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- Backend: Node.js, Express
- Data: Supabase-ready integration and local JSON/data configuration
- Charts and UI effects: Recharts, Framer Motion, canvas-based visuals
- Authentication: JWT + optional Supabase auth

## Project Structure

```text
New Project/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server/
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── css/
├── js/
├── supabase/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── index.html
├── test.html
└── SUPABASE_SETUP.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

#### Development mode
```bash
npm run dev
```

#### Run frontend and backend together
```bash
npm run dev:all
```

#### Start the backend server
```bash
npm run server
```

#### Build the frontend for production
```bash
npm run build
```

## Environment Setup

Create a `.env` file based on `.env.example` and configure your settings:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecorise
JWT_SECRET=your_secret_key_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## Demo and Presentation Notes

The application is intentionally designed for hackathon and demo use:
- easy-to-understand sustainability challenge flow
- visually rich mascot-based progress tracking
- instant reward feedback via animations and confetti
- active board for community motivation
- strong storytelling around real environmental actions

## Team

- Samrat Choudhury
- Sanjana SD
- Rohith S

## Contact

For project-related queries, contact:
- sanjanasd111@gmail.com

## License

This project is intended for educational and hackathon demonstration use.

## Repository Setup

The repository name for this project is configured as:

```text
ecorise
```

To push this project to GitHub, use:

```bash
git remote set-url origin https://github.com/<your-github-username>/ecorise.git
git add .
git commit -m "Initial commit for ECORISE"
git push -u origin master
```

If GitHub does not yet have a repo named `ecorise`, create it in the GitHub UI first and then push.
