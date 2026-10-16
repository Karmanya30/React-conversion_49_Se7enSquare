# Comprehensive Evaluation Guide: Administration & Platform Management

**Student Component:** Rajat — Administration & Platform Management  
**Pages Covered:** `admin-dashboard.html` (`AdminDashboard.jsx`), `community-settings.html` (`CommunitySettings.jsx`), `report.html` (`Report.jsx`), `pricing.html` (`Pricing.jsx`)  
**Stack:** React 19 + Vite 8 + React Router 7 (Frontend) | NestJS 10 + TypeScript + Swagger (Backend)  
**Architectural Scope & Justification:** The Admin Dashboard acts as the primary administrative engine for platform operations and security, supported by Community Settings (granular management of community profiles, channels, member permissions, rules, and analytics), Report (end-to-end violation submission and context gathering pipeline), and Pricing (subscription tier plans, upgrade/downgrade workflows, and financial simulation).

---

## 1. Master File Checklist

Below is the complete inventory of all files involved in this component, categorized by architectural tier.

### A. Frontend: Orchestrator Pages (4 files)
| File | Role & Key Logic |
|---|---|
| [`AdminDashboard.jsx`](front-end/react-app/src/Pages/AdminDashboard.jsx) | Master administrative console orchestrating 9 dedicated management views (Overview, Users, Communities, Moderation, Appeals, Events, Applications, Audit Logs, and Platform Config). Coordinates multi-hook state, audit logging, and toast alerts. |
| [`CommunitySettings.jsx`](front-end/react-app/src/Pages/CommunitySettings.jsx) | Granular community administration workspace. Manages basic details, branding banner uploads, channel CRUD, member role adjustments/removals, guidelines/rules, and live community analytics with dirty-form protection. |
| [`Report.jsx`](front-end/react-app/src/Pages/Report.jsx) | 4-step progressive disclosure wizard for reporting abusive content, messages, or users. Enriches report context from query parameters or live user search, validates inputs, and triggers backend moderation queues. |
| [`Pricing.jsx`](front-end/react-app/src/Pages/Pricing.jsx) | Subscription and monetization hub. Displays comparative tier matrix (Free, Plus, Ultra Pro), handles upgrade payments, downgrade confirmations, and subscription cancellations with persistent plan state. |

---

### B. Frontend: Subcomponents by Feature (34 files)

#### 1. Admin Dashboard Subcomponents (`src/Pages/AdminDashboard/components/` — 14 files)
* [`AdminHeader.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/AdminHeader.jsx) — Top bar with system status pill, search input, notification bell, and administrator avatar profile badge.
* [`AdminNav.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/AdminNav.jsx) — Tab navigation bar switching between the 9 administrative panels with real-time badge count indicators.
* [`OverviewTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/OverviewTab.jsx) — High-level platform health summaries, quick links, system alerts, and primary metrics grid.
* [`UsersTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/UsersTab.jsx) — User management table featuring search, role filter dropdown, role update modal, password reset, and user suspension/ban triggers.
* [`CommunitiesTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/CommunitiesTab.jsx) — Global community directory table with search, category filtering, status indicators, and administrative deletion controls.
* [`ModerationTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/ModerationTab.jsx) — Pending report queue with reason tags, reporter/target identifiers, dismiss button, and action sanction modal (Warn, Mute, Delete).
* [`AppealsTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/AppealsTab.jsx) — Ban and suspension appeal reviews displaying user statements, original sanction reasons, and Approve/Reject verdict buttons.
* [`EventsTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/EventsTab.jsx) — Platform-wide event inspection table with organizer attribution, registration numbers, and event status badges.
* [`ApplicationsTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/ApplicationsTab.jsx) — Dual-queue review for Organizer certification and Moderator badge applications with portfolio links and approve/deny actions.
* [`AuditLogTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/AuditLogTab.jsx) — Full historical audit table listing timestamped administrative actions, actor usernames, target entities, and severity levels.
* [`ConfigTab.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/ConfigTab.jsx) — Platform configuration editor (maintenance mode toggle, signup locks, rate limit thresholds, and community guidelines policy management).
* [`PlatformHealth.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/PlatformHealth.jsx) — Live server telemetry card showing API latency, memory consumption, uptime percentage, and database connection status.
* [`QuickActions.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/QuickActions.jsx) — Rapid-dispatch action bar for common operations (Broadcast Announcement, Clear Cache, Force Sync, Export System Logs).
* [`RecentAuditList.jsx`](front-end/react-app/src/Pages/AdminDashboard/components/RecentAuditList.jsx) — Compact recent activity feed embedded within the overview tab for instant situational awareness.

#### 2. Community Settings Subcomponents (`src/Pages/CommunitySettings/components/` — 10 files)
* [`CommunityHeader.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/CommunityHeader.jsx) — Community branding topbar displaying community icon, title, slug breadcrumb, and "Add Channel" modal trigger.
* [`SettingsNav.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/SettingsNav.jsx) — Sidebar navigation pills switching between General Info, Members, Channels, Rules, and Insights tabs.
* [`BasicInfoTab.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/BasicInfoTab.jsx) — Core settings form (Community Name, Slug URL, Description, Category, Visibility) and branding banner preview.
* [`BannerUpload.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/BannerUpload.jsx) — Image/banner selector with live gradient preview, URL input, and local file upload reader.
* [`MembersTab.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/MembersTab.jsx) — Member roster management table supporting member search, role change dropdown (Admin, Moderator, Member), and member eviction.
* [`ChannelsTab.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/ChannelsTab.jsx) — Channel reordering and management list showing channel type icons (Text, Voice, Announcement) and channel deletion actions.
* [`CreateChannelModal.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/CreateChannelModal.jsx) — Modal dialog for adding channels with channel type selector, name input with lowercase slugification, and description.
* [`RulesTab.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/RulesTab.jsx) — Multi-line community guidelines editor allowing managers to define conduct rules and etiquette.
* [`InsightsTab.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/InsightsTab.jsx) — Community analytics dashboard graphing 30-day message activity, member growth curves, and active engagement hours.
* [`SaveBar.jsx`](front-end/react-app/src/Pages/CommunitySettings/components/SaveBar.jsx) — Floating unsaved changes bar prompting managers to Save or Discard pending configuration changes.

#### 3. Report Subcomponents (`src/Pages/Report/components/` — 6 files)
* [`ReportHeader.jsx`](front-end/react-app/src/Pages/Report/components/ReportHeader.jsx) — Minimal header displaying the reporting center title and reporter user badge.
* [`ReportStepper.jsx`](front-end/react-app/src/Pages/Report/components/ReportStepper.jsx) — Progress bar indicating current wizard position (1: Target → 2: Reason → 3: Review → 4: Success).
* [`TargetStep.jsx`](front-end/react-app/src/Pages/Report/components/TargetStep.jsx) — Step 1 target selector: User, Message, or Community with debounced live user search input.
* [`ReasonStep.jsx`](front-end/react-app/src/Pages/Report/components/ReasonStep.jsx) — Step 2 category selection (Harassment, Spam, Hate Speech, Inappropriate Content, Impersonation) and supplemental details textarea.
* [`ReviewStep.jsx`](front-end/react-app/src/Pages/Report/components/ReviewStep.jsx) — Step 3 summary card showing target details, violation reason, confirmation checkbox, and submit button.
* [`SuccessStep.jsx`](front-end/react-app/src/Pages/Report/components/SuccessStep.jsx) — Step 4 confirmation view providing generated reference ticket ID (`REP-XXXXXX`) and navigation actions back to Dashboard.

#### 4. Pricing Subcomponents (`src/Pages/Pricing/components/` — 4 files)
* [`PricingHeader.jsx`](front-end/react-app/src/Pages/Pricing/components/PricingHeader.jsx) — Hero section explaining subscription benefits, billing cycles, and feature guarantees.
* [`PlanGrid.jsx`](front-end/react-app/src/Pages/Pricing/components/PlanGrid.jsx) — Three-column responsive grid comparing Free, Plus ($9.99/mo), and Ultra Pro ($24.99/mo) plans.
* [`PricingCard.jsx`](front-end/react-app/src/Pages/Pricing/components/PricingCard.jsx) — Individual tier card with highlighted "Current Plan" / "Upgrade" / "Downgrade" buttons and checklist of perks.
* [`CancelSubscriptionCard.jsx`](front-end/react-app/src/Pages/Pricing/components/CancelSubscriptionCard.jsx) — Manage billing footer providing cancellation flow with confirmation dialog and automatic fallback to Free tier.

---

### C. Frontend: Custom Hooks & Shared Platform Utilities (14 files)
* [`useAdminUsers.js`](front-end/react-app/src/Components/platform/hooks/useAdminUsers.js) — User directory state, role filter matching, user search, role upgrade mutations, suspension, and ban operations with automatic audit logging.
* [`useAdminModeration.js`](front-end/react-app/src/Components/platform/hooks/useAdminModeration.js) — Moderation queue state, reports handling, appeal adjudications, organizer/moderator application reviews, and action dispatches.
* [`useAdminConfig.js`](front-end/react-app/src/Components/platform/hooks/useAdminConfig.js) — Platform configuration state, maintenance toggle, feature flag modifications, and dynamic policy list CRUD.
* [`useAuditLog.js`](front-end/react-app/src/Components/platform/hooks/useAuditLog.js) — Centralized audit logging dispatcher recording administrative actions to local state and backend `/api/audit`.
* [`useCommunitySettings.js`](front-end/react-app/src/Components/platform/hooks/useCommunitySettings.js) — Community configuration lifecycle, tab switching, channel CRUD, member role adjustments, snapshot creation, and dirty-form tracking.
* [`useDirtyForm.js`](front-end/react-app/src/Components/platform/hooks/useDirtyForm.js) — Reusable hook tracking unsaved form modifications and providing `markDirty`, `markClean`, and `isDirty` state flags.
* [`useReportForm.js`](front-end/react-app/src/Components/platform/hooks/useReportForm.js) — 4-step report state machine, search param context extraction (`?user=`, `?msg=`, `?community=`), debounced target search, and API report submission.
* [`usePricing.js`](front-end/react-app/src/Components/platform/hooks/usePricing.js) — Subscription status fetching, upgrade payment simulation, downgrade confirmation barriers, and cancellation handlers.
* [`useToast.js`](front-end/react-app/src/Components/platform/hooks/useToast.js) — Toast notification manager providing timed auto-dismissing feedback messages.
* [`AppShell.jsx`](front-end/react-app/src/Components/platform/layout/AppShell.jsx) — Standardized dashboard shell integrating sidebar navigation, top header bar, and content scrolling.
* [`StatCard.jsx`](front-end/react-app/src/Components/platform/common/StatCard.jsx) — Reusable KPI card presenting numeric totals, trend percentages, and accent icons.
* [`Toast.jsx`](front-end/react-app/src/Components/platform/common/Toast.jsx) — Toast UI overlay rendering icons and feedback strings.
* [`ToggleSwitch.jsx`](front-end/react-app/src/Components/platform/common/ToggleSwitch.jsx) — Accessible animated boolean switch for configuration flags and maintenance mode.
* [`platformStorage.js`](front-end/react-app/src/Components/platform/utils/platformStorage.js) — Unified `localStorage` access utilities for active session user tokens and roles.

---

### D. Frontend: Data Constants & Stylesheets (8 files)
* [`adminData.js`](front-end/react-app/src/Components/platform/data/adminData.js) — Admin navigation tabs definitions, fallback stats, default users, mock reports, applications, and system config constants.
* [`defaultCommunityData.js`](front-end/react-app/src/Components/platform/data/defaultCommunityData.js) — Default community configuration schema, baseline channels, member lists, and guidelines fallback.
* [`reportReasons.js`](front-end/react-app/src/Components/platform/data/reportReasons.js) — Predefined violation categories, explanations, and severity classifications.
* [`pricingPlans.js`](front-end/react-app/src/Components/platform/data/pricingPlans.js) — Tier schemas (`free`, `plus`, `ultra`), feature arrays, pricing values, and tier rank mapping.
* [`admin-dashboard.css`](front-end/react-app/src/styles/admin-dashboard.css) — 9-tab dashboard grid layout, table styles, moderation queues, and status pills.
* [`community-settings.css`](front-end/react-app/src/styles/community-settings.css) — Settings layout, floating save bar, channel lists, and permission dropdowns.
* [`report.css`](front-end/react-app/src/styles/report.css) — Stepper bar, target cards, reason selector tiles, and success ticket styling.
* [`pricing.css`](front-end/react-app/src/styles/pricing.css) — Pricing tier comparison cards, active badge styling, and cancellation widget.

---

### E. Backend: Modules, Controllers, Services & Database (12 files)
* [`users.controller.ts`](back-end/src/modules/users/users.controller.ts) — Endpoints for listing all users, updating roles (`PATCH /users/:id`), suspending users, and resetting credentials.
* [`users.service.ts`](back-end/src/modules/users/users.service.ts) — Business logic for user search, role enforcement, status updates (`active`, `suspended`, `banned`).
* [`reports.controller.ts`](back-end/src/modules/reports/reports.controller.ts) — Endpoints for submitting reports (`POST /reports`), listing reports (`GET /reports`), and resolving reports (`PATCH /reports/:id/status`).
* [`reports.service.ts`](back-end/src/modules/reports/reports.service.ts) — Report persistence, status lifecycle (`pending`, `reviewed`, `dismissed`, `action_taken`), and action records.
* [`subscriptions.controller.ts`](back-end/src/modules/subscriptions/subscriptions.controller.ts) — Endpoints for subscription status (`GET /status`), upgrade payments (`POST /upgrade`), and cancellations (`POST /cancel`).
* [`subscriptions.service.ts`](back-end/src/modules/subscriptions/subscriptions.service.ts) — Plan upgrade logic, payment simulation logging, and active subscriber record management.
* [`platform-config.controller.ts`](back-end/src/modules/platform-config/platform-config.controller.ts) — Administrative configuration endpoints (`GET /platform-config`, `PATCH /platform-config`).
* [`platform-config.service.ts`](back-end/src/modules/platform-config/platform-config.service.ts) — Maintenance mode flags, rate limit overrides, and system policy rule mutations.
* [`audit.controller.ts`](back-end/src/modules/audit/audit.controller.ts) — REST endpoints for auditing (`GET /audit`, `POST /audit`).
* [`audit.service.ts`](back-end/src/modules/audit/audit.service.ts) — Immutable event logging for security auditing and compliance tracking.
* [`communities.controller.ts`](back-end/src/modules/communities/communities.controller.ts) — Endpoints supporting Community Settings (`GET /communities/:id`, `PATCH /communities/:id`).
* [`communities.service.ts`](back-end/src/modules/communities/communities.service.ts) — Community metadata updates, channel list modifications, and rules updating.

---

## 2. React Concepts & Engineering Principles Used

### 1. Thin Orchestrator & Multi-Hook Decomposition
Monolithic administration pages frequently devolve into thousands of lines of unmaintainable code due to overlapping concerns (managing users, moderation queues, config flags, and billing). Rajat's component breaks this antipattern down into:
* **Orchestrator Page (`AdminDashboard.jsx`)**: Acts as a high-level layout coordinator (~200 lines). It delegates state and logic to three specialized domain hooks:
  - `useAdminUsers`: User directory and account mutations.
  - `useAdminModeration`: Queue triage, report dismissals, and sanctions.
  - `useAdminConfig`: System settings, maintenance mode, and platform policies.
* **Separation of Presentation and Business Logic**: All JSX components (e.g., `UsersTab.jsx`, `ModerationTab.jsx`) receive pure props and callback functions, making them independently testable and maintainable.

### 2. Dirty Form State & Accidental Data Loss Prevention
In `CommunitySettings.jsx`, unsaved changes could be lost if a community manager inadvertently switches tabs or navigates away:
* **Snapshot State**: When the community data loads, both `community` (active working copy) and `initialCommunity` (immutable baseline snapshot) are initialized.
* **`useDirtyForm` Hook**: Whenever any field (name, description, category, rules, channels) is edited, `markDirty()` sets `isDirty = true`.
* **Floating `SaveBar`**: A sticky notification bar automatically slides into view at the bottom of the screen with "Save Changes" and "Discard" actions.
* **Discard Mechanism**: Clicking "Discard" restores the `community` state directly from `initialCommunity` and resets `isDirty = false`.

### 3. Progressive Disclosure State Machine (Report Wizard)
`Report.jsx` implements a clean 4-step state machine:
1. **Target Selection**: Allows selecting User, Message, or Community. Dynamically enriches context from query string parameters (`?user=12&uname=alex`) or executes live search against `/api/users`.
2. **Reason Selection**: Selects predefined rule violation tags from `reportReasons.js` with supplementary detail text.
3. **Review & Confirm**: Presents a read-only recap of the violation target and category with an explicit confirmation checkbox before enabling the submission button.
4. **Success & Ticket Reference**: Renders an immutable success ticket with a generated reference number (`REP-XXXXXX`) and reset triggers.

### 4. Derived State & Memoization with `useMemo`
In `useAdminUsers.js`, user search and role filtering are derived reactively without creating redundant state variables:
```javascript
const filteredUsers = useMemo(() => {
  return users.filter((u) => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchSearch =
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    return matchRole && matchSearch;
  });
}, [users, userSearch, userRoleFilter]);
```
*Why this matters:* Eliminates synchronization bugs where the filtered list becomes stale relative to the raw users list, and prevents unnecessary computations during unrelated component renders.

### 5. Centralized Audit Logging Bus
Every administrative action (updating a role, banning a user, approving an appeal, or updating platform configuration) automatically dispatches through `useAuditLog`:
* The event is immediately appended to the local audit timeline for instant UI feedback.
* A background `POST /api/audit` records the actor's username, action description, timestamp, and category to the backend database.

### 6. Role-Based Access Control (RBAC) Protection
Protected in `App.jsx` and component-level rendering:
* `/admin-dashboard` is strictly wrapped in `<ProtectedRoute allowedRoles={['admin']}>`. Non-admin accounts attempting access are redirected to `/dashboard`.
* `/community-settings` is restricted in frontend navigation to Community Managers and Admins.
* Administrative buttons (Ban User, Force Reset Password, Maintenance Toggle) are strictly gated to the `admin` role.

---

## 3. Backend & REST API Deep Dive

The backend architecture enforces security, validation, and role governance through standard NestJS interceptors and guards:

```
        Incoming HTTP Request
                 │
                 ▼
     [GlobalRateLimiter & Helmet]   (Security headers & DDoS mitigation)
                 │
                 ▼
          [ValidationPipe]           (Validates DTO constraints: @IsString, @IsEnum)
                 │
                 ▼
         [RolesGuard (RBAC)]         (Validates x-role against allowed @Roles())
                 │
                 ▼
    [Domain Controllers & Services]
  (Users, Reports, Subscriptions, Platform-Config, Audit)
                 │
                 ▼
      [In-Memory DB Store (db.json)]
```

### Complete API Specification for Rajat's Component

#### 1. User Administration API (`/api/users`)
| Endpoint | Method | Role Required (`x-role`) | Payload / Query | Description |
|---|---|---|---|---|
| `/api/users` | `GET` | Any authenticated role | `?search=:query` | Retrieves all registered users; supports substring filtering by name or username. |
| `/api/users/:id` | `GET` | Any authenticated role | None | Fetches detailed profile record for specified user ID. |
| `/api/users/:id` | `PATCH` | `admin` | `{ role: string }` | Updates user permissions role (`user`, `moderator`, `community_manager`, `organizer`, `admin`). |
| `/api/users/:id/suspend` | `POST` | `admin` | None | Temporarily locks user account status to `suspended`. |
| `/api/users/:id/ban` | `POST` | `admin` | None | Permanently terminates user sessions and updates status to `banned`. |
| `/api/users/:id/reset-password` | `POST` | `admin` | None | Invalidates password and generates temporary password reset token. |

#### 2. Reports & Content Moderation API (`/api/reports`)
| Endpoint | Method | Role Required (`x-role`) | Payload / Query | Description |
|---|---|---|---|---|
| `/api/reports` | `GET` | `admin`, `moderator` | None | Returns list of all filed user and content violation reports. |
| `/api/reports` | `POST` | Any authenticated role | `CreateReportDto`: `{ reporterId, targetType, targetId, reason, details }` | Submits new violation report; automatically sets status to `pending`. |
| `/api/reports/:id/status` | `PATCH` | `admin`, `moderator` | `{ status: string }` | Updates report status (`pending`, `reviewed`, `dismissed`, `action_taken`). |
| `/api/reports/:id/action` | `POST` | `admin`, `moderator` | `{ action: string, note: string }` | Applies punitive action against reported target (Warning, Message Delete, Mute). |

#### 3. Subscriptions & Monetization API (`/api/subscriptions`)
| Endpoint | Method | Role Required (`x-role`) | Payload / Query | Description |
|---|---|---|---|---|
| `/api/subscriptions/status` | `GET` | Any authenticated role | `?userId=:id` | Returns active subscription tier for the user (defaults to `free`). |
| `/api/subscriptions/upgrade` | `POST` | Any authenticated role | `{ userId: number, plan: string }` | Upgrades user to `plus` or `ultra` plan; simulates payment processing. |
| `/api/subscriptions/cancel` | `POST` | Any authenticated role | `{ userId: number }` | Cancels recurring subscription and immediately reverts user status to `free`. |
| `/api/subscriptions` | `GET` | `admin`, `owner` | None | Returns active subscription analytics and active subscriber roster. |

#### 4. Platform Configuration API (`/api/platform-config`)
| Endpoint | Method | Role Required (`x-role`) | Payload | Description |
|---|---|---|---|---|
| `/api/platform-config` | `GET` | Any authenticated role | None | Retrieves system configuration (maintenance mode, registration locks, policies). |
| `/api/platform-config` | `PATCH` | `admin` | `UpdatePlatformConfigDto` | Modifies platform settings, maintenance toggles, and feature flags. |
| `/api/platform-config/policies` | `POST` | `admin` | `{ rule: string }` | Appends a new community guideline rule to the platform policy registry. |
| `/api/platform-config/policies/:id` | `DELETE` | `admin` | None | Removes a community guideline rule from the platform policy registry. |

#### 5. Audit Logging API (`/api/audit`)
| Endpoint | Method | Role Required (`x-role`) | Payload | Description |
|---|---|---|---|---|
| `/api/audit` | `GET` | `admin` | None | Retrieves chronological security log of all administrative actions. |
| `/api/audit` | `POST` | `admin` | `{ actor: string, action: string, category: string }` | Appends a new immutable audit record to the system log. |

---

## 4. Key Logic Walkthroughs (Code-Level)

### Walkthrough 1: Dirty Form State & Discard Logic
In `useCommunitySettings.js` and `useDirtyForm.js`:
```javascript
// Snapshot initial load
const loaded = { ...DEFAULT_COMMUNITY, ...data };
setCommunity(loaded);
setInitialCommunity(loaded); // Immutable reference snapshot

// When any input is modified:
const handleFieldChange = (field, value) => {
  setCommunity((prev) => ({ ...prev, [field]: value }));
  markDirty(); // Sets isDirty = true, triggering SaveBar visibility
};

// Discard changes without hitting server:
const discardSettings = () => {
  setCommunity(initialCommunity); // Reverts back to initial snapshot
  markClean(); // Hides SaveBar
  showToast('Changes discarded');
};
```
*Evaluator Point:* Shows how client-side state snapshots allow instant revert capability without requiring network refetches or leaving lingering uncommitted mutations.

---

### Walkthrough 2: Downgrade Confirmation Barrier in Pricing
In `usePricing.js`:
```javascript
const handlePlanChange = async (planId) => {
  const targetPlan = PLANS.find((p) => p.id === planId);
  if (!targetPlan) return;

  // Compare tier rankings to distinguish upgrade vs downgrade
  const isDowngrade = PLAN_RANK[planId] < PLAN_RANK[currentPlan];

  if (isDowngrade) {
    const confirmed = window.confirm(
      `Downgrade to ${targetPlan.name}? You'll lose access to paid features beyond the ${targetPlan.name} tier limits.`
    );
    if (!confirmed) return; // Abort operation if user rejects loss of features
  }

  const res = await fetch(`${API_BASE}/subscriptions/upgrade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-role': user.role },
    body: JSON.stringify({ userId: Number(user.id), plan: planId }),
  });
  if (res.ok) {
    setCurrentPlan(planId);
    showToast('✅', `Now on the ${targetPlan.name} plan`);
  }
};
```
*Evaluator Point:* Demonstrates user experience defense: users are protected from accidental feature loss by evaluating plan hierarchy before executing backend payment state changes.

---

### Walkthrough 3: Progressive Context Enrichment in Report Wizard
In `useReportForm.js`:
```javascript
// Automatically pre-populate report target from query string context
const [selectedTarget, setSelectedTarget] = useState(() => {
  if (ctxUser) return { type: 'user', id: ctxUser, name: ctxUserName || `User #${ctxUser}` };
  if (ctxMsg) return { type: 'message', id: ctxMsg, text: ctxMsgText };
  if (ctxComm) return { type: 'community', id: ctxComm, name: ctxCommName };
  return null;
});

// Live fallback search if reporting directly from navigation
const handleUserSearch = async (val) => {
  setUserSearch(val);
  if (!val.trim()) { setSearchResults([]); return; }
  try {
    const res = await fetch(`${API_BASE}/users?search=${encodeURIComponent(val)}`, {
      headers: { 'x-role': user.role },
    });
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data.slice(0, 5) : []);
    }
  } catch {
    // Graceful fallback to cached demo users if network is unreachable
  }
};
```
*Evaluator Point:* Demonstrates deep-linking support (e.g., clicking "Report Message" in Chat navigates to `/report?msg=124&text=...`), seamlessly integrating the reporting module with all other platform pages.

---

### Walkthrough 4: Audit Log Dispatch on Administrative Action
In `useAdminUsers.js`:
```javascript
const updateUserRole = async (userId, newRole) => {
  // 1. Optimistic local update
  setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  setEditingUser(null);

  // 2. Local & persistent audit log dispatch
  addAuditLog(`Updated role for user #${userId} to ${newRole}`, 'role');
  showToast(`✓ Role updated to ${newRole}`);

  // 3. Backend persistence
  try {
    await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-role': adminUser.role },
      body: JSON.stringify({ role: newRole }),
    });
  } catch (err) {
    console.error('Failed to sync role update to server', err);
  }
};
```
*Evaluator Point:* Illustrates transactional consistency in admin operations: UI updates immediately, audit logs are recorded for compliance, and the mutation is synchronized with the NestJS API.

---

## 5. Potential Evaluator Questions & Answers

### Q1: Why did you group Admin Dashboard, Community Settings, Report, and Pricing into Rajat's component?
> **Answer:** "This component encompasses the **Administration & Platform Management** domain. The Admin Dashboard is the central administrative engine governing users, moderation, appeals, and system configuration. Community Settings provides granular community-level administration (roles, channels, rules). Report provides the user-facing reporting funnel that feeds directly into the Admin Moderation Queue. Finally, Pricing manages subscription tiers and monetization, which links directly to user tier statuses and platform revenue tracked on the administrative side."

### Q2: How does the Admin Dashboard manage 9 tabs without becoming unmaintainable?
> **Answer:** "Rather than having a single massive component, `AdminDashboard.jsx` is a **Thin Orchestrator** of ~200 lines. The state and logic are separated into three dedicated custom hooks:
> 1. `useAdminUsers` handles user directory search, role modifications, suspensions, and bans.
> 2. `useAdminModeration` handles reports triage, appeals, and application approvals.
> 3. `useAdminConfig` handles maintenance mode toggles and community guidelines.
> Each of the 9 tabs (`OverviewTab`, `UsersTab`, `ModerationTab`, etc.) is an isolated subcomponent that receives only the props and actions it needs."

### Q3: How does `CommunitySettings` protect users from accidental data loss?
> **Answer:** "We implemented the `useDirtyForm` hook along with an immutable state snapshot. When data is fetched from `/api/communities/:id`, we save both `community` and `initialCommunity`. As the user makes edits, `isDirty` is set to `true`, which reveals the floating `SaveBar`. If the user decides to cancel, `discardSettings()` restores the exact state from `initialCommunity` without needing another API call. When saved, `saveSettings()` sends a `PATCH` request and updates the snapshot."

### Q4: How is Role-Based Access Control (RBAC) enforced across the administration features?
> **Answer:** 
> - **Frontend:** In `App.jsx`, `/admin-dashboard` is protected by `<ProtectedRoute allowedRoles={['admin']}>`. If a non-admin attempts access, they are automatically redirected to `/dashboard`.
> - **Backend:** Every NestJS controller is decorated with `@Roles()`. For instance, `PATCH /users/:id` requires `AppRole.ADMIN`, and `GET /reports` requires `AppRole.ADMIN` or `AppRole.MODERATOR`. The request sends the `x-role` header which is validated by `RolesGuard`; any unauthorized request is rejected with `403 Forbidden`."

### Q5: How does the Report page handle deep links from other parts of the platform?
> **Answer:** "`useReportForm` reads URL query parameters on mount: `?user=`, `?msg=`, or `?community=`. If a user clicks 'Report' on a chat message or profile, `Report.jsx` pre-populates Step 1 with the target's ID and description, skipping manual user search and allowing the reporter to immediately proceed to Step 2 (Reason Selection)."

### Q6: How does subscription pricing manage upgrades, downgrades, and cancellations?
> **Answer:** "`usePricing` tracks subscription tiers using a rank mapping (`free: 0, plus: 1, ultra: 2`). If a user switches to a lower tier, a confirmation modal warns them about losing access to paid features. Once confirmed, the hook invokes `POST /api/subscriptions/upgrade` (or `/cancel` for free tier reversion), updating the user's plan state and showing a toast confirmation."
