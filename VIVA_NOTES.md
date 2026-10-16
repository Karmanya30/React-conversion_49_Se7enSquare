# Event Management Module — Refactoring & Architecture Notes for Viva

This document summarizes the architectural refactoring of the **Event Management** module in the FDFED project (`front-end/react-app/src`).

---

## 1. Final Folder Tree

```text
front-end/react-app/src/
├── App.jsx                                           # Route configuration with updated page imports
├── Components/
│   └── event-management/                             # Shared Event Management foundation
│       ├── common/                                   # Reusable presentational components (used by 2+ pages)
│       │   ├── EmptyState.jsx                        # Reusable empty list / no-data placeholder with optional CTA
│       │   ├── LoadingState.jsx                      # Centered loading indicator supporting card grids & table rows
│       │   ├── Modal.jsx                             # Generic accessible modal dialog wrapper with backdrop dismiss
│       │   ├── PageHeader.jsx                        # Standardized page title, badge, navigation tabs, and action header
│       │   ├── StatCard.jsx                          # Reusable metric card for dashboard statistics (icon, value, label)
│       │   ├── StatusBadge.jsx                       # Unified badge component supporting event statuses and tags
│       │   └── Toast.jsx                             # Toast notification popup banner
│       ├── hooks/                                    # Reusable logic, caching, and state management
│       │   ├── useEvents.js                          # Hook for event fetching, category filtering, attendee syncing & drafts
│       │   ├── useLocalStorageFallback.js            # Hook for safe read/write operations against localStorage collections
│       │   ├── useRegistrations.js                   # Hook for event registrations, ticket creation, and cancellation
│       │   └── useToast.js                           # Hook for toast notification messaging with auto-dismiss timers
│       ├── services/                                 # Centralized API network layer
│       │   └── eventService.js                       # HTTP client wrapping all endpoints with automated x-role injection
│       └── utils/                                    # Shared helpers and constants
│           ├── constants.js                          # API_BASE, storage keys, categories, statuses, and user/role helpers
│           └── getCommunityName.js                   # Lookup utility resolving community names by ID or slug
└── Pages/
    ├── EventApproval/                                # Event Approval module
    │   ├── ApprovalCard.jsx                          # Card representing an event submission with approve/reject actions
    │   ├── approvalDefaults.js                       # Offline fallback demo data for approval events and communities
    │   ├── ApprovalList.jsx                          # Reusable list section for pending, approved, and rejected events
    │   ├── EventApproval.jsx                         # Container page orchestrating event request approvals
    │   ├── EventDetailModal.jsx                      # Modal displaying complete submission details for inspection
    │   └── SummaryBar.jsx                            # Metric summary bar displaying counts of pending, approved, and rejected
    ├── OrganizerDashboard/                           # Organizer Dashboard module
    │   ├── DashboardFilterBar.jsx                    # Status filter toolbar with quick "+ Host Tournament" trigger
    │   ├── OrganizerDashboard.jsx                    # Container page orchestrating organizer tournament management
    │   ├── PlanCard.jsx                              # Tier card showing Free vs. Premium status, limits, and upgrade action
    │   ├── StatsGrid.jsx                             # 5-card metric overview displaying key statistics
    │   ├── TournamentModal.jsx                       # Modal form for hosting a new tournament or editing an existing one
    │   ├── TournamentRow.jsx                         # Table row displaying tournament details and action buttons
    │   ├── TournamentsTable.jsx                      # Table wrapper rendering tournament rows, loading, and empty states
    │   └── useOrganizerData.js                       # Hook encapsulating organizer state, stats calculation, and API actions
    ├── Events/                                       # Member Events & Tournaments module
    │   ├── CategoryFilterChips.jsx                   # Interactive category filter chips for upcoming events
    │   ├── CreateEventForm.jsx                       # Form component for creating new events and tournaments
    │   ├── EventCard.jsx                             # Card component for upcoming events with capacity indicators
    │   ├── EventDetailModal.jsx                      # Detailed modal dialog for inspecting event details and joining
    │   ├── Events.jsx                                # Container page orchestrating tabs, filters, and event interactions
    │   ├── EventsGrid.jsx                            # Grid component for upcoming event cards with loading/empty states
    │   ├── FeaturedEventBanner.jsx                   # Hero banner showcasing the top featured upcoming event
    │   ├── LivePreviewCard.jsx                       # Real-time preview card mirroring event creation form inputs
    │   ├── RegistrationModal.jsx                     # Modal dialog for submitting player registration information
    │   ├── RegistrationsGrid.jsx                     # Grid displaying confirmed tickets or an empty state
    │   ├── RegistrationTicket.jsx                    # Ticket card showing confirmed registration, ticket ID, and cancel action
    │   └── useCreateEventForm.js                     # Hook for managing event creation form fields, validation, and drafts
    └── EventRegistrants/                             # Event Registrants module
        ├── EventRegistrants.jsx                      # Container page for tournament player registrations
        ├── RegistrantRow.jsx                         # Table row displaying individual player details and in-game ID badge
        └── RegistrantsTable.jsx                      # Table wrapper rendering registrant rows, loading, and live footer count
```

---

## 2. Line Count Comparison

| Monolithic Page File (Before) | Lines (Before) | Refactored Container File (After) | Lines (After) | Reduction |
| :--- | :---: | :--- | :---: | :---: |
| `src/Pages/Events.jsx` | 763 | `src/Pages/Events/Events.jsx` | 206 | **-73.0%** |
| `src/Pages/EventApproval.jsx` | 363 | `src/Pages/EventApproval/EventApproval.jsx` | 173 | **-52.3%** |
| `src/Pages/EventRegistrants.jsx` | 207 | `src/Pages/EventRegistrants/EventRegistrants.jsx` | 113 | **-45.4%** |
| `src/Pages/OrganizerDashboard.jsx` | 714 | `src/Pages/OrganizerDashboard/OrganizerDashboard.jsx` | 135 | **-81.1%** |
| **Total Lines in Page Files** | **2,047** | **Total Lines in Page Files** | **627** | **-69.4%** |

---

## 3. One-Line Explanation of Each Component, Hook, and Util

### Shared Foundation (`src/Components/event-management/`)
* **`common/EmptyState.jsx`**: Reusable empty state placeholder with icon, message, and optional action button.
* **`common/LoadingState.jsx`**: Centered loading indicator supporting both card grid containers and table rows.
* **`common/Modal.jsx`**: Generic accessible modal overlay with backdrop click-dismiss and ESC support.
* **`common/PageHeader.jsx`**: Standardized page title, badge, navigation tabs, and action header.
* **`common/StatCard.jsx`**: Metric presentation card for dashboard statistics (icon, value, label).
* **`common/StatusBadge.jsx`**: Unified badge component supporting event status and in-game handle styling.
* **`common/Toast.jsx`**: Floating toast notification popup banner.
* **`hooks/useEvents.js`**: Custom hook for event fetching, category filtering, attendee syncing, offline caching, and drafts.
* **`hooks/useLocalStorageFallback.js`**: Custom hook for safe reading, writing, and synchronizing state with `localStorage`.
* **`hooks/useRegistrations.js`**: Custom hook for event registrations, ticket creation, and cancellation.
* **`hooks/useToast.js`**: Custom hook for toast notification messaging with auto-dismiss timers.
* **`services/eventService.js`**: Centralized HTTP client wrapping all endpoints with automated `x-role` header injection.
* **`utils/constants.js`**: Single source of truth for `API_BASE`, storage keys, categories, statuses, and user/role helpers.
* **`utils/getCommunityName.js`**: Safe lookup utility resolving community names by ID or slug with fallback formatting.

### Events Page (`src/Pages/Events/`)
* **`Events.jsx`**: Container orchestrator coordinating tabs, modals, and hooks for events and tournaments.
* **`CategoryFilterChips.jsx`**: Interactive category filter chips for upcoming events.
* **`FeaturedEventBanner.jsx`**: Hero banner highlighting the top upcoming event with quick register/view actions.
* **`EventsGrid.jsx`**: Grid displaying upcoming event cards with integrated loading and empty states.
* **`EventCard.jsx`**: Card presentation component for an upcoming event with capacity indicators and register/delete actions.
* **`RegistrationsGrid.jsx`**: Grid displaying user's confirmed event tickets or an empty state.
* **`RegistrationTicket.jsx`**: Ticket card showing confirmed registration, ticket ID (`TKT-XXXXXX`), and cancel action.
* **`CreateEventForm.jsx`**: Form component for creating new events and tournaments with validation and draft controls.
* **`LivePreviewCard.jsx`**: Real-time preview card mirroring the event creation form inputs.
* **`EventDetailModal.jsx`**: Modal dialog for inspecting complete event details and specifications.
* **`RegistrationModal.jsx`**: Modal dialog for capturing player registration details (in-game ID, contact info).
* **`useCreateEventForm.js`**: Custom hook managing event creation form state, validations, draft persistence, and image uploads.

### Event Approval Page (`src/Pages/EventApproval/`)
* **`EventApproval.jsx`**: Container page orchestrating community event approval workflows.
* **`ApprovalCard.jsx`**: Card component representing an event submission with approve and reject actions.
* **`ApprovalList.jsx`**: Reusable section list rendering grouped events (`pending`, `approved`, `rejected`) with loading and empty states.
* **`SummaryBar.jsx`**: Summary metrics bar displaying counts of pending, approved, and rejected events.
* **`EventDetailModal.jsx`**: Inspection modal displaying comprehensive submission details for management review.
* **`approvalDefaults.js`**: Fallback sample data for approval events and communities.

### Event Registrants Page (`src/Pages/EventRegistrants/`)
* **`EventRegistrants.jsx`**: Container page for tournament player registrations and query param handling.
* **`RegistrantRow.jsx`**: Table row presentation component for an individual event registrant.
* **`RegistrantsTable.jsx`**: Data table wrapper rendering column headers, registrant rows, loading state, error/empty states, and live footer count.

### Organizer Dashboard Page (`src/Pages/OrganizerDashboard/`)
* **`OrganizerDashboard.jsx`**: Container page orchestrating organizer tournament management and analytics.
* **`PlanCard.jsx`**: Plan status card showing Free vs. Premium organizer tier, limits, and upgrade action.
* **`StatsGrid.jsx`**: Overview metrics grid displaying summary statistics for tournaments, registrations, and revenue.
* **`DashboardFilterBar.jsx`**: Filter toolbar for segmenting tournaments by status with quick host tournament CTA.
* **`TournamentRow.jsx`**: Table row presentation component for an individual organizer tournament with action buttons.
* **`TournamentsTable.jsx`**: Data table wrapper rendering column headers, tournament rows, loading/empty states, and count.
* **`TournamentModal.jsx`**: Modal dialog for hosting a new tournament or editing an existing one.
* **`useOrganizerData.js`**: Custom hook encapsulating organizer tournament state, stats calculations, API requests, and modal operations.

---

## 4. How Each Page Is Composed

### 1. Events Page
```text
Events (Container)
├── SideBar (Shared Navigation)
└── Main Content Container
    ├── PageHeader (Common Header + Tabs: Upcoming | My Registrations | Create Event)
    ├── Tab 1: Upcoming Events
    │   ├── CategoryFilterChips
    │   ├── FeaturedEventBanner (Hero Banner)
    │   └── EventsGrid
    │       ├── LoadingState (Common)
    │       ├── EmptyState (Common)
    │       └── EventCard*
    ├── Tab 2: My Registrations
    │   └── RegistrationsGrid
    │       ├── EmptyState (Common)
    │       └── RegistrationTicket*
    ├── Tab 3: Create Event
    │   ├── CreateEventForm (Inputs, Draft Buttons, Upload Box)
    │   └── LivePreviewCard (Real-time Mirror + Tips Card)
    ├── EventDetailModal (Inspect Event)
    ├── RegistrationModal (Join Event Form)
    └── Toast (Common Feedback Banner)
```

### 2. Event Approval Page
```text
EventApproval (Container)
├── SideBar (Shared Navigation)
└── Main Content Container
    ├── Header ("Community Operations — Event Requests")
    ├── SummaryBar (Pending | Approved | Rejected live counters)
    ├── ApprovalList [Pending Events] (with Approve/Reject actions)
    │   └── ApprovalCard*
    ├── ApprovalList [Approved Events] (Live view)
    │   └── ApprovalCard*
    ├── ApprovalList [Rejected Events] (Declined view)
    │   └── ApprovalCard*
    ├── EventDetailModal (Common Modal + Detailed Fields)
    └── Toast (Common Feedback Banner)
```

### 3. Event Registrants Page
```text
EventRegistrants (Container)
├── SideBar (Shared Navigation)
└── Main Content Container
    ├── PageHeader ("Registrants — {eventTitle}" + "← Back to Dashboard")
    ├── Branch A (When no ?eventId= in URL):
    │   └── EmptyState ("No tournament specified" + Back Button)
    └── Branch B (When eventId is present):
        └── RegistrantsTable
            ├── Table Header (6 Columns)
            ├── LoadingState (Common table row)
            ├── EmptyState (Common table row for empty/error)
            ├── RegistrantRow* (Name, @handle, Email, Phone, In-Game Badge, Timestamp)
            └── Table Footer (Live registrant count or loading status)
```

### 4. Organizer Dashboard Page
```text
OrganizerDashboard (Container)
├── SideBar (Shared Navigation)
└── Main Content Container
    ├── PageHeader ("Organizer Dashboard" + "ORGANIZER" Badge + Avatar)
    ├── PlanCard (Free vs. Premium status + Upgrade Button)
    ├── StatsGrid (5 x Common StatCard: Tournaments, Registrations, Pending, Upcoming, Earnings)
    ├── DashboardFilterBar (Status Filters: All, Approved, Pending, Cancelled + "+ Host Tournament")
    ├── TournamentsTable
    │   ├── LoadingState (Common table row)
    │   ├── EmptyState (Common table row)
    │   └── TournamentRow* (Edit, Promote, Registrants, Delete actions)
    ├── TournamentModal (Host / Edit Tournament Form)
    └── Toast (Common Feedback Banner)
```

---

## 5. Five Architectural Advantages of this Structure (for Viva)

1. **Separation of Concerns (Container / Presentational Pattern)**:
   - Each page component is now a pure container (112–206 lines) responsible solely for orchestration, routing, and passing data down as props.
   - Presentational components (`EventCard`, `RegistrationTicket`, `TournamentRow`, `RegistrantRow`) have no direct API calls or complex side effects, making them easy to unit-test and reason about.

2. **Elimination of Code Duplication (DRY Principle)**:
   - Previously, `ApprovalList` logic was copy-pasted 3 times across Pending, Approved, and Rejected tabs. Now, a single `ApprovalList` component renders all three sections with dynamic props.
   - Community lookups, `x-role` header injection, and `localStorage` fallbacks were duplicated across 3+ files; now they reside in single-purpose utilities (`getCommunityName.js`, `eventService.js`, `useLocalStorageFallback.js`).

3. **Resilient Offline Architecture**:
   - Centralizing the API layer in `eventService.js` combined with `useLocalStorageFallback.js` guarantees consistent offline behavior across the entire module. If the backend is unreachable, tournaments and approvals fail over gracefully to `localStorage` without breaking the UI.

4. **Maintainability and Independent Scalability**:
   - Features can be enhanced in isolation. For example, modifying the event creation form inputs or draft validation only touches `CreateEventForm.jsx` and `useCreateEventForm.js`, with zero risk of breaking event card rendering or dashboard statistics.

5. **Viva-Ready Code Clarity**:
   - In a project viva or code review, each file has a single, immediately understandable responsibility with a one-line header comment. A reviewer can understand `OrganizerDashboard.jsx` in 2 minutes because it simply composes `PlanCard`, `StatsGrid`, `DashboardFilterBar`, and `TournamentsTable`.

6. **Multi-Tier Role Authorization & Defense-in-Depth**:
   - Organizers cannot approve their own tournaments. The UI completely removes the Status dropdown when creating tournaments (forcing status to `pending`) and restricts editing to either retaining the current status or cancelling the tournament.
   - Defense-in-depth is enforced at both the submit handler level and the centralized `eventService.js` network layer: any payload with `status: 'approved'` originating from an `organizer` role is automatically sanitized, while full approval/rejection capabilities are preserved for `admin` and `community_manager` roles on the Event Approval page.

