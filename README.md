# AI Study Groups Platform

A study group tracking platform for Frenzy Works with real-time collaboration features, progress streaks, and accessible curriculum management.

## Tech Stack

- **Frontend:** Next.js 14 (React 18) + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS (WCAG 2.1 AA compliant)
- **Deployment:** Vercel
- **Auth:** Supabase Auth with Google OAuth
- **Database:** PostgreSQL (via Supabase)

## Features

### User Roles
1. **Admin** - Full platform control
2. **Facilitator** - Group management + resource recommendations
3. **User** - Study group participation + progress tracking

### Core Features
- Google authentication with role-based access control
- Study groups with meeting summaries
- Daily task streaks (optional habits)
- Weekly meeting attendance streaks
- Friend streaks for accountability
- Embedded curriculum with progress tracking
- Resource table (built-in + Notion embed support)
- Admin dashboard with audit logging
- Notification system
- WCAG 2.1 AA accessible UI

## Project Structure

```
AI Study Groups/
├── src/
│   ├── app/                      # Next.js app directory (routes)
│   ├── components/
│   │   ├── common/               # Shared components (Header, Footer, Nav)
│   │   ├── auth/                 # Auth-related components
│   │   ├── study-groups/         # Study group pages/components
│   │   ├── admin/                # Admin dashboard components
│   │   └── curriculum/           # Curriculum components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── supabase/             # Supabase client setup
│   │   ├── utils/                # Utility functions
│   │   └── constants/            # App constants
│   ├── types/                    # TypeScript type definitions
│   └── styles/                   # Global styles
├── public/
│   ├── icons/                    # SVG icons
│   └── images/                   # Static images
├── tests/
│   └── unit/                     # Unit tests
├── .github/
│   └── workflows/                # CI/CD workflows
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd "AI Study Groups"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test

# Watch tests
npm run test:watch
```

## Database Setup

### Tables to Create in Supabase

1. **users_extended** - User profiles with roles
2. **study_groups** - Study group information
3. **meetings** - Meeting records with summaries
4. **daily_tasks** - Optional daily task recommendations
5. **user_streaks** - Daily, weekly, and friend streaks
6. **curricula** - Course content
7. **curriculum_sections** - Multi-part curriculum sections
8. **curriculum_progress** - User progress tracking
9. **resources** - Facilitator-recommended resources
10. **notifications** - System notifications
11. **admin_audit_log** - Admin action tracking

*Full schema SQL to be added in Ticket 1*

## Authentication

This project uses Supabase Auth with Google OAuth. Users can:
- Sign in with Google
- Have their email verified automatically
- Get assigned a role (user/facilitator/admin)
- Access features based on their role

## Accessibility

This project is built to **WCAG 2.1 AA** standards:
- ✓ Color contrast ratios meet AA standards
- ✓ Keyboard navigation fully supported
- ✓ Screen reader compatible (tested with NVDA/VoiceOver)
- ✓ Semantic HTML throughout
- ✓ ARIA landmarks and labels
- ✓ Focus indicators visible
- ✓ No flashing/seizure triggers

**Accessibility Verification:**
- Run axe DevTools on every page
- Test with screen readers
- Verify Lighthouse accessibility score ≥ 90

## Deployment

This project is configured for **Vercel**:

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Vercel auto-deploys on push

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Format with Prettier
- Write tests for new features

## Tickets

This project is split into 3 epics (see Linear):

1. **Auth, Roles & Accessible UI Foundation** (FW-7)
2. **Study Groups, Streaks & Social Features** (FW-8)
3. **Curriculum, Resources & Admin Dashboard** (FW-9)

## Support

For issues or questions, open an issue in the repo or contact the Frenzy Works team.
