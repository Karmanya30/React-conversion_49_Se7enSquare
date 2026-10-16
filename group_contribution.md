# Se7enSquare — Group Contribution Documentation

## 1. Project Overview
**Se7enSquare** is a modern full-stack gaming community, moderation, and engagement platform built with a **React 19 + Vite** frontend and a **NestJS** TypeScript backend. The platform provides competitive gamers, community managers, tournament organizers, and administrators with an integrated ecosystem for discovering gaming hubs, organizing tournaments, messaging in dedicated channels, enforcing community guidelines, contest moderation sanctions, and tracking platform telemetry.

---

## 2. Problem Statement and Objectives
Modern gaming communities are often fragmented across disparate chat servers, forum boards, tournament brackets, and disconnected moderation bots. This fragmentation causes:
- Inconsistent identity verification and poor role governance across competitive circles.
- Opaque moderation with no structured recourse or appeal pipelines for players.
- Inaccurate member counters, bloated mock metrics, and artificial engagement numbers.
- High administrative overhead for tournament organizers tracking rosters and approvals.

**Project Objectives:**
1. Unified Gaming Hub: Unify community discovery, real-time messaging, forum posting, and tournament management in a single interface.
2. Transparent Governance: Implement an end-to-end abuse reporting and appeal workflow (`/report` $\rightarrow$ `/mod-panel` $\rightarrow$ `/appeal`).
3. Single Source of Truth: Eliminate mock data and hardcoded counts, dynamically deriving metrics (such as member counts) from database relational queries.
4. Robust Architecture: Enforce strict separation of UI presentation from business logic via custom hooks and modular child components.
5. Role-Based Security: Enforce authentication and authorization both at the client routing layer (`ProtectedRoute`) and backend API guards (`RolesGuard`).

---

## 3. Target Users and Use Cases

| Persona | Primary Needs & Use Cases |
|---|---|
| **Competitive Gamer / Player** | Discover communities, participate in chat channels, read and post discussions, register for tournaments, file violation reports, appeal unfair penalties. |
| **Community Owner** | Customize community branding, add/delete channels, define rules, oversee member rosters, monitor engagement metrics. |
| **Tournament Organizer** | Create esports tournaments, manage prize pools, monitor player registrations and check-ins, view tournament analytics. |
| **Community Moderator** | Review incoming abuse reports, inspect evidence and context, issue warnings, mutes, content removals, or account bans. |
| **Platform Administrator** | Oversee platform health, inspect global audit logs, manage user roles, certify tournament organizers, configure feature flags. |

---

## 4. Main Features and Verified Implementation Status

| Feature Module | Key Functionalities | Implementation Status | Verification Evidence |
|---|---|---|---|
| **Authentication & RBAC** | Local login/register, Google OAuth 2.0 verification, JWT/session storage, protected route redirects. | **Fully Functional** | Verified end-to-end; blocks unauthorized role access to `/admin-dashboard`. |
| **Community Discovery** | Dynamic category filter pills, real-time search, responsive grid, dynamic member counts. | **Fully Functional** | Verified live against backend `GET /api/communities`. |
| **Community Creation** | 3-step wizard (Basic Info $\rightarrow$ Branding $\rightarrow$ Channels/Rules), input validation, automatic owner membership. | **Fully Functional** | Verified; commits new communities to `db.json`. |
| **Community Hub** | Banner telemetry, post feed with create post modal, about widget, rules list, member roster. | **Fully Functional** | Verified; posts persist to backend storage. |
| **Community Chat** | Channel sidebar, message stream, controlled composer, active member sidebar, reaction triggers. | **Fully Functional** | Connected to live backend `GET /api/messages` and `POST /api/messages`. |
| **Tournament Management** | Tournament discovery, status filters, registration flow, participant capacity tracking. | **Fully Functional** | Verified; updates participant count on registration. |
| **Event Approval Queue** | Community Manager approval console with Approve/Reject actions, review modal, and queue metrics. | **Fully Functional** | Verified; triggers status change in database. |
| **Organizer Console** | Host metrics, tournament configuration modal, registrant tracking, subscription card. | **Fully Functional** | Verified with organizer role authentication. |
| **Abuse Reporting** | 4-step reporting stepper (Target $\rightarrow$ Reason $\rightarrow$ Review $\rightarrow$ Ticket Confirmation). | **Fully Functional** | Verified; persists tickets into moderation queue. |
| **Moderator Panel** | Master-detail report queue, evidence inspector, action suite (Warn, Mute, Ban, Dismiss). | **Fully Functional** | Verified; updates report statuses via backend API. |
| **User Appeals** | Disciplinary standing card, structured statement form, commitment checkbox, reference ID generation. | **Fully Functional** | Verified; persists appeal records to database. |
| **Admin Governance** | Overview KPI grid, searchable user table, role assignment modal, audit log, platform settings. | **Fully Functional** | Verified; live telemetry and persistent role mutation. |
| **Pricing & Subscriptions** | Tier comparison grid (Free, Pro, Organizer), billing frequency toggle, upgrade/cancel triggers. | **Fully Functional** | Verified; mutates subscription tier on backend confirmation. |

---

## 5. Team Allocation Table (Authoritative)

The following allocation was established for the five team members, assigning exactly four HTML pages to each member according to functional domain:

| Team Member | Role & Focus | Assigned HTML Pages | Primary Functional Domain |
|---|---|---|---|
| **Sanidhya Joshi** *(Team Leader)* | **Team Leader — Authentication & User Experience** | 1. `landing.html`<br>2. `login.html`<br>3. `dashboard.html`<br>4. `appeal.html` | Public portal, identity validation, user home feed, and moderation recourse. |
| **Karmanya** | **Community Management** | 1. `discovery.html`<br>2. `create-community.html`<br>3. `community-page.html`<br>4. `owner-dashboard.html` | Community exploration, creation wizard, community page hub, and owner telemetry. |
| **Anant** | **Chat, Profile & Moderation** | 1. `chat.html`<br>2. `profile-settings.html`<br>3. `mod-panel.html`<br>4. `user.html` | Real-time chat, profile configuration, moderator ticket resolution, and user directory. |
| **Awadhesh** | **Event Management** | 1. `events.html`<br>2. `event-approval.html`<br>3. `event-registrants.html`<br>4. `organizer-dashboard.html` | Tournament discovery, event approval queue, registrant rosters, and organizer console. |
| **Rajat Jain** | **Administration & Platform Management** | 1. `admin-dashboard.html`<br>2. `community-settings.html`<br>3. `report.html`<br>4. `pricing.html` | Central administration, community settings editor, abuse reporting wizard, and pricing. |

---

## 6. Frontend Architecture and React Implementation

The frontend is built on **React 19** using **Vite 8** as the dev server and production bundler. The application is architected around the following foundational principles:

```
front-end/react-app/
├── src/
│   ├── App.jsx                     # Central client-side router & ProtectedRoute definitions
│   ├── main.jsx                    # Application root mount point
│   ├── Pages/                      # Top-level route orchestrators
│   │   ├── AdminDashboard/         # Modular admin tabs & audit lists
│   │   ├── Appeal/                 # Appeal submission subcomponents
│   │   ├── Chat/                   # Chat sidebar, feed, and member lists
│   │   ├── CommunityPage/          # Banner, post feed, widgets
│   │   ├── CommunitySettings/      # Settings tabs, channel modals
│   │   ├── CreateCommunity/        # Multi-step creation wizard fields
│   │   ├── Dashboard/              # Modular user feed widgets
│   │   ├── Discovery/              # Category bars, community cards
│   │   ├── EventApproval/          # Approval cards & review modal
│   │   ├── EventRegistrants/       # Registrant rows & roster table
│   │   ├── Events/                 # Tournament grid & creation modal
│   │   ├── ModPanel/               # Report queue, detail view, action panel
│   │   ├── OrganizerDashboard/     # Stats grid, tournament modals
│   │   ├── OwnerDashboard/         # Revenue metrics, subscription tabs
│   │   ├── Pricing/                # Pricing cards & plan grid
│   │   ├── ProfileSettings/        # Settings tabs, role modals
│   │   ├── Report/                 # 4-step reporting wizard
│   │   └── User/                   # User table & filter bars
│   ├── Components/
│   │   ├── platform/common/        # StatCard, Toast, Modal components
│   │   ├── platform/hooks/         # Shared business logic & API hooks
│   │   └── platform/layout/        # AppShell, TopNav, SideBar
│   ├── services/
│   │   ├── api.js                  # Centralized fetch client with x-role injection
│   │   └── authService.js          # Session persistence & user state
│   └── styles/                     # Modular Vanilla CSS stylesheets
```

---

## 7. HTML-to-React Conversion and Routing Strategy

The team successfully transitioned all 20 legacy static HTML prototypes into single-page application (SPA) components managed by **React Router 7**:

1. **Routing Declarations (`App.jsx`):**
   - Public paths: `/`, `/landing`, `/login`, `/pricing`.
   - Core protected paths: `/dashboard`, `/chat`, `/discovery`, `/create-community`, `/community-page/:id`, `/community-settings/:id`, `/events`, `/event-registrants`, `/report`, `/appeal`, `/profile-settings`, `/user`.
   - Role-gated paths:
     - `/admin-dashboard` (and `/admin` alias) $\rightarrow$ Allowed Roles: `['admin']`.
     - `/owner-dashboard` (and `/owner` alias) $\rightarrow$ Allowed Roles: `['owner', 'admin']`.
     - `/organizer-dashboard` (and `/organizer` alias) $\rightarrow$ Allowed Roles: `['organizer', 'admin']`.
     - `/mod-panel` (and `/mod` alias) $\rightarrow$ Allowed Roles: `['moderator', 'admin']`.
     - `/event-approval` $\rightarrow$ Allowed Roles: `['community_manager', 'manager', 'admin']`.
2. **Backward Compatibility & Alias Routing:**
   - Legacy URL extensions (e.g. `/dashboard.html`, `/login.html`, `/admin-dashboard.html`) are explicitly mapped in `App.jsx` to prevent broken bookmarks or dead links.
   - Convenient root aliases (`/admin`, `/owner`, `/mod`, `/organizer`) ensure seamless examiner navigation.

---

## 8. React Engineering Patterns: Components, State, Forms, and Hooks

The codebase demonstrates rigorous adherence to core React engineering standards:

### A. Component Hierarchy and Props Flow
- Pages serve as high-level orchestrators that invoke business logic hooks and distribute state down to focused presentational children.
- Data flows strictly downward via read-only props; user interactions trigger callback props (`onSelect`, `onSave`, `onFilterChange`) that bubble up to update parent state.

### B. State Management (`useState`)
- Discrete, atomic state variables are preferred over monolithic objects to avoid unnecessary re-rendering cycles.
- Multi-step wizards (e.g., `CreateCommunity.jsx`, `Report.jsx`) maintain discrete `step` counters that act as state machines controlling UI view transitions.

### C. Controlled Form Inputs & Validation
- Form fields across Login, Community Creation, Event Creation, Reporting, and Settings bind directly to React state via `value` and `onChange`.
- Client-side validation checks trigger before API dispatch, preventing invalid submissions and rendering clear inline feedback.

### D. Side Effect Management (`useEffect`)
- Side effects are confined to data loading and subscriptions.
- Dependency arrays are explicitly declared to prevent runaway re-render loops or stale closures.

---

## 9. UI, Business Logic, and API Service Separation

The application strictly separates presentation, stateful logic, and network communications:

1. **Presentation Layer (`src/Pages/.../components/`):** Pure or near-pure functional components that receive props, render JSX markup, and fire event callbacks.
2. **Business Logic Layer (`src/Pages/.../hooks/` & `src/Components/platform/hooks/`):** Custom hooks (e.g., `useDashboard`, `useDiscovery`, `useAdminUsers`, `useModPanel`, `useEventsData`) manage state variables, handle input validation, and execute asynchronous coordination.
3. **API Client Layer (`src/services/`):**
   - Centralized handler `api.js` automatically prepends API base URL, formats headers, serializes JSON bodies, injects authenticated `x-role` tokens, and translates HTTP error codes into user-friendly error objects.

---

## 10. Backend Architecture and NestJS Modules

The backend is built with **NestJS** and structured modularly:

```
back-end/src/
├── app.module.ts                   # Root application module orchestrating all feature modules
├── main.ts                         # Bootstrap entry point (Port 3000, Helmet, Rate Limiter)
├── seed.ts                         # Standalone demo data seeder script
├── common/
│   ├── decorators/                 # @Roles() metadata decorator
│   ├── filters/                    # Global AllExceptionsFilter with structured logging
│   ├── guards/                     # RolesGuard enforcing RBAC on routes
│   ├── middleware/                 # LoggingMiddleware and RouterLevelMiddleware
│   └── utils/                      # in-memory-db.ts (database engine with JSON sync)
└── modules/
    ├── auth/                       # Credentials, registration, Google OAuth token verification
    ├── users/                      # User querying, search query filter, role patch
    ├── communities/                # Community CRUD, dynamic member counting
    ├── memberships/                # Community join/leave persistence
    ├── posts/                      # Discussion posts, comments, likes
    ├── messages/                   # Real-time chat messages by community and channel
    ├── events/                     # Tournament scheduling, approval states
    ├── event-registrations/        # Tournament player rosters and check-ins
    ├── reports/                    # Abuse violation tickets and status transitions
    ├── appeals/                    # Sanction contest submissions
    ├── dashboard/                  # Live platform statistics and revenue queries
    ├── audit/                      # Administrative and security audit logging
    ├── platform-config/            # System configuration flags
    ├── subscriptions/              # Membership tier upgrades and cancellations
    ├── organisers/                 # Organizer applications, profiles, and analytics
    └── moderator-certification/    # Moderator certification and quiz verification
```

---

## 11. API Integration and Data Flow

```
[ Browser / User Action ]
          │
          ▼
[ React Component (e.g., Discovery) ]
          │ (calls callback)
          ▼
[ Custom Hook (useDiscovery.js) ]
          │ (dispatches API request)
          ▼
[ Central Client (api.js) ]
          │ (HTTP GET/POST/PATCH + x-role header)
          ▼
[ NestJS Controller (e.g., CommunitiesController) ]
          │ (RolesGuard checks x-role)
          ▼
[ NestJS Service (CommunitiesService) ]
          │ (computes dynamic memberCount from memberships)
          ▼
[ Database Engine (in-memory-db.ts) ] ◄──► [ Persistent Storage (db.json) ]
```

---

## 12. Authentication, Authorization and Role-Based Access Control (RBAC)

The platform enforces end-to-end security through dual-tier RBAC:

1. **Backend Role Guard (`RolesGuard`):**
   - The `@Roles(...)` decorator specifies allowed roles for every endpoint.
   - Every request is validated against authorized application roles (`admin`, `owner`, `community_manager`, `organizer`, `moderator`, `user`, `gamer`).
   - Requests lacking the required permissions receive an immediate `403 Forbidden: Role mismatch: access denied`.
2. **Frontend Route Guard (`ProtectedRoute`):**
   - Wraps sensitive routes in `App.jsx`.
   - Inspects the active user session; if unauthenticated, redirects to `/login`.
   - Compares the user's role against `allowedRoles`. If unauthorized, redirects safely to `/dashboard`.
3. **Google OAuth 2.0 Integration:**
   - Frontend integrates Google Identity Services.
   - Backend validates Google ID tokens securely using `OAuth2Client.verifyIdToken` via `google-auth-library`.

---

## 13. Database Models and Persistence

Persistence is maintained in `back-end/db.json` via a synchronous file-backed JSON engine (`in-memory-db.ts`). The database manages the following core entities:

- **Users:** `id`, `username`, `email`, `role`, `firstName`, `lastName`, `bio`, `avatar`, `authProvider`.
- **Communities:** `id`, `name`, `description`, `ownerId`, `tags`, `icon`, `category`, `slug`, `channels`, `rules`, `visibility`.
- **Memberships:** `id`, `communityId`, `userId`, `role`, `joinedAt`.
- **Messages:** `id`, `communityId`, `channelId`, `userId`, `sender`, `content`, `timestamp`, `reactions`, `pinned`.
- **Posts:** `id`, `communityId`, `userId`, `author`, `title`, `content`, `likes`, `comments`, `createdAt`.
- **Events:** `id`, `title`, `game`, `date`, `time`, `prizePool`, `maxParticipants`, `status`, `communityId`, `organizerId`.
- **Event Registrations:** `id`, `eventId`, `userId`, `teamName`, `status`, `registeredAt`.
- **Reports:** `id`, `targetType`, `targetId`, `targetName`, `reason`, `notes`, `status`, `reporterId`, `timestamp`.
- **Appeals:** `id`, `userId`, `appealType`, `statement`, `status`, `createdAt`.
- **Audit Logs:** `id`, `actor`, `action`, `target`, `timestamp`, `details`.
- **Subscriptions:** `id`, `userId`, `tier`, `status`, `billingCycle`, `renewsAt`.

---

## 14. Project Dependencies and Technologies

### Frontend (`front-end/react-app/package.json`)
- **Runtime:** React 19 (`^19.2.8`), React DOM (`^19.2.8`), React Router DOM (`^7.18.4`).
- **Build & Dev:** Vite (`^8.3.0`), `@vitejs/plugin-react` (`^6.1.1`).
- **Code Quality:** ESLint (`^10.10.0`), `eslint-plugin-react-hooks` (`^7.1.1`), `eslint-plugin-react-refresh` (`^0.5.6`).

### Backend (`back-end/package.json`)
- **Framework:** NestJS Core & Common (`^10.4.8`), Express Platform (`^10.4.8`).
- **Documentation:** Swagger / OpenAPI (`@nestjs/swagger`, `swagger-ui-express`).
- **Security & Validation:** Helmet (`^8.3.0`), Express Rate Limit (`^8.6.2`), Google Auth Library (`^11.3.1`), `class-validator` (`^0.14.1`), `class-transformer` (`^0.5.1`).
- **Logging:** Winston (`^3.19.0`), Winston Daily Rotate File (`^5.0.0`).
- **Build & Tooling:** TypeScript (`^5.5.4`), `ts-node` (`^10.9.2`), Nest CLI (`^10.4.7`), Prettier, ESLint.

---

## 15. Environment Configuration

### Frontend Configuration (`front-end/react-app/.env`)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=784045223165-rgmes9ee44r52abkaau43h8oj27qr3na.apps.googleusercontent.com
```

### Backend Configuration (`back-end/.env`)
```bash
PORT=3000
GOOGLE_CLIENT_ID=784045223165-rgmes9ee44r52abkaau43h8oj27qr3na.apps.googleusercontent.com
```

---

## 16. Installation and Execution Commands

### Prerequisites
- Node.js (version 20 or higher)
- npm (version 10 or higher)

### 1. Backend Setup & Startup
```bash
cd back-end
npm install
npm run build
npm run start:prod
# Server starts on http://localhost:3000 (Swagger docs available at http://localhost:3000/api/docs)
```

### 2. Optional Demo Database Seeding
To populate cleanly identified demonstration records without affecting code:
```bash
cd back-end
npm run seed
```

### 3. Frontend Setup & Startup
```bash
cd front-end/react-app
npm install
npm run dev
# Frontend dev server starts on http://localhost:5173
```

---

## 17. Testing Procedures and Verified Results

### Automated Build & Lint Verification
1. **Backend Build (`back-end`):** `npm run build` $\rightarrow$ **Code 0 (Passed)**.
2. **Backend Lint (`back-end`):** `npm run lint` $\rightarrow$ **Code 0 (0 errors, 0 warnings)**.
3. **Frontend Build (`front-end/react-app`):** `npm run build` $\rightarrow$ **Code 0 (Passed, 205ms)**.
4. **Frontend Lint (`front-end/react-app`):** `npm run lint` $\rightarrow$ **Code 0 (0 errors)**.

### End-to-End System Verification
All core workflows were tested against live servers:
- **Authentication:** Verified user registration, credential login, role assignment, and redirection.
- **RBAC Protection:** Confirmed that non-admin users attempting to load `/admin-dashboard` are blocked and redirected to `/dashboard`.
- **Search & Filter:** Verified instant client-side keyword search and category tag filtering in Discovery.
- **Community Join/Leave:** Verified optimistic UI toggling and reactive member count adjustments.
- **Database Persistence:** Confirmed that community creation, event creation, reports, and role updates write to `back-end/db.json`.

---

## 18. Git Collaboration and Contribution Evidence

Reviewing the commit ledger confirms continuous, structured team collaboration:
- `Sanidhya Joshi (Team Leader)`: Overall project coordination, repository management, PR review and conflict resolution, initial full-stack integration, Google OAuth setup, dashboard component refactor, backend proxy integration, and platform-wide dummy data removal.
- `Karmanya`: Modular community management refactor, live backend integration, submit guards, and Discovery filter layout enhancements (PR #2, PR #4).
- `Anant`: Modular refactoring of Chat, Profile Settings, Mod Panel, and User Directory components.
- `Awadhesh`: Modular refactoring of the Event Management subsystem, approval modals, and organizer console (PR #5).
- `Rajat Jain`: Initial React setup, common components, modular refactoring of Admin Dashboard, Community Settings, Abuse Reporting, and Pricing (PR #1, PR #3).

---

## 19. Known Limitations

1. **Google OAuth in Offline Environments:** The Google Sign-In button requires active internet access and valid Google OAuth domain whitelisting. For offline college evaluations, the local email/password login and demo pills provide a reliable, offline-capable authentication path.
2. **WebSockets for Real-Time Chat:** Chat messages currently refresh via HTTP REST endpoints (`GET /api/messages`). WebSocket integration (Socket.io) can be introduced in future iterations for instant cross-client synchronization.
3. **In-Memory JSON Storage:** Storage utilizes a local JSON file (`db.json`) rather than an external SQL/NoSQL server, which is suitable for demonstration but would be replaced by PostgreSQL/MongoDB in enterprise production.

---

## 20. Group Summary: How the Five Modules Fit Together

The five functional modules engineered by the team form a cohesive platform architecture:

1. **Sanidhya Joshi's Module (Team Leader — Authentication & UX)** establishes user identity, handles authentication tokens, and renders the central user feed.
2. **Karmanya's Module (Community Management)** empowers authenticated users to discover gaming communities, create new hubs, join discussions, and monitor platform ownership metrics.
3. **Anant's Module (Chat, Profile & Moderation)** enables communication across channel rooms, maintains user profiles and security credentials, and provides moderators with tools to police violations.
4. **Awadhesh's Module (Event Management)** powers competitive gaming by providing tournament scheduling, community manager approval, attendee check-ins, and organizer console tools.
5. **Rajat's Module (Administration & Platform Management)** provides overarching governance: administrative user controls, platform settings, community configuration, abuse reporting, and subscription monetization.

Together, these five modules deliver an integrated, stable, and verifiable gaming community platform ready for evaluation.
