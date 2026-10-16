# Comprehensive Evaluation Guide: Community Management & Owner Dashboard

**Student Component:** Karmanya — Community Management  
**Pages Covered:** `discovery.html` (`Discovery.jsx`), `create-community.html` (`CreateCommunity.jsx`), `community-page.html` (`CommunityPage.jsx`), `owner-dashboard.html` (`OwnerDashboard.jsx`)  
**Stack:** React 19 + Vite 8 + React Router 7 (Frontend) | NestJS 10 + TypeScript + Swagger (Backend)  
**Architectural Scope & Justification:** These pages cover community discovery, creation, viewing, and owner-level management.

---

## 1. Master File Checklist

Below is the complete inventory of all files involved in this component, categorized by architectural tier.

### A. Frontend: Orchestrator Pages (4 files)
| File | Role & Key Logic |
|---|---|
| [`Discovery.jsx`](front-end/react-app/src/Pages/Discovery.jsx) | Thin orchestrator for discovery view. Calls `useDiscovery`; isolates layout with `.discovery-shell` and `.discovery-content`; coordinates header, hero stats, horizontal category pills, sort dropdown, and community card grid. |
| [`CreateCommunity.jsx`](front-end/react-app/src/Pages/CreateCommunity.jsx) | Thin orchestrator for community & channel creation. Calls `useCreateCommunity`; coordinates the 4-step wizard, interactive live preview card, and standalone channel creation tab. |
| [`CommunityPage.jsx`](front-end/react-app/src/Pages/CommunityPage.jsx) | Thin orchestrator for viewing individual community details. Calls `useCommunityPage`; switches between Overview, Channels, Members, and Rules tabs; guards channel access for non-members. |
| [`OwnerDashboard.jsx`](front-end/react-app/src/Pages/OwnerDashboard.jsx) | Thin orchestrator for platform owner analytics. Calls `useOwnerDashboard`; renders platform health KPIs, financial revenue metrics, and interactive drill-down modal dialogs. |

---

### B. Frontend: Subcomponents by Feature (20 files)

#### 1. Discovery Subcomponents (`src/Pages/Discovery/components/`)
* [`DiscoveryHeader.jsx`](front-end/react-app/src/Pages/Discovery/components/DiscoveryHeader.jsx) — Top navigation bar with Discover Communities title, notification bell with unread badge, and profile avatar link.
* [`CategoryFilterBar.jsx`](front-end/react-app/src/Pages/Discovery/components/CategoryFilterBar.jsx) — Scoped filter bar (`.discovery-filter-bar`) rendering horizontally scrollable category chips (`All`, `Gaming`, `Other`, etc.) and the "Sort: Most Active / Members / Trending / Newest" dropdown.
* [`CommunityGrid.jsx`](front-end/react-app/src/Pages/Discovery/components/CommunityGrid.jsx) — Scoped body area (`.discovery-body-area`) featuring the Featured Community banner, community count indicator, loading skeletons, empty state, and responsive card grid.
* [`CommunityCard.jsx`](front-end/react-app/src/Pages/Discovery/components/CommunityCard.jsx) — Community card UI with avatar icon, verified badge, online/member stats, category tags, and optimistic Join/Leave toggle button with loading spinner.

#### 2. Create Community Subcomponents (`src/Pages/CreateCommunity/components/`)
* [`CreateCommunityHeader.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/CreateCommunityHeader.jsx) — Wizard top navigation, progress breadcrumbs, and tab switcher (`Create Community` vs `Create Channel`).
* [`BasicInfoFields.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/BasicInfoFields.jsx) — Step 1 inputs: Community Name, dynamic URL Slug generator, Description (10-200 chars), Category selector, and optional Website URL with regex validation.
* [`BrandingPicker.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/BrandingPicker.jsx) — Step 2 inputs: Emoji avatar selector, gradient banner theme palette picker, and tag pills (1-5 tags, 2-20 chars).
* [`PrivacyTypeSelector.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/PrivacyTypeSelector.jsx) — Step 3 inputs: Public, Private, and Invite-Only radio cards, member permission toggles, and default channel templates.
* [`CommunityRulesInput.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/CommunityRulesInput.jsx) — Step 4 inputs: Dynamic multi-line community guidelines input and welcome message for newly joined members.
* [`CreateCommunityActions.jsx`](front-end/react-app/src/Pages/CreateCommunity/components/CreateCommunityActions.jsx) — Navigation buttons (`Previous Step`, `Next Step`, `Create Community`), free-plan community cap enforcement, and submit guard spinner.

#### 3. Community Page Subcomponents (`src/Pages/CommunityPage/components/`)
* [`CommunityBanner.jsx`](front-end/react-app/src/Pages/CommunityPage/components/CommunityBanner.jsx) — Cover banner, community avatar, verified badge, live member & online counters, Join/Leave toggle button, and owner Delete Community trigger.
* [`CommunityNav.jsx`](front-end/react-app/src/Pages/CommunityPage/components/CommunityNav.jsx) — Pill-based tab bar (`Overview`, `Channels`, `Members`, `Rules`) with dynamic count badges.
* [`CommunityAboutWidget.jsx`](front-end/react-app/src/Pages/CommunityPage/components/CommunityAboutWidget.jsx) — Overview sidebar: bio description, foundation date, tags chips, and moderation notice.
* [`PostFeed.jsx`](front-end/react-app/src/Pages/CommunityPage/components/PostFeed.jsx) — Channel posts display, author avatar initials, reaction counters, and timestamp formatting.
* [`CommunityMembersList.jsx`](front-end/react-app/src/Pages/CommunityPage/components/CommunityMembersList.jsx) — Members tab: real-time member search, role badges (`Owner`, `Admin`, `Member`), and member avatar generator.
* [`CommunityRulesWidget.jsx`](front-end/react-app/src/Pages/CommunityPage/components/CommunityRulesWidget.jsx) — Rules tab: numbered list of guidelines with default fallback protection.

#### 4. Owner Dashboard Subcomponents (`src/Pages/OwnerDashboard/components/`)
* [`OwnerHeader.jsx`](front-end/react-app/src/Pages/OwnerDashboard/components/OwnerHeader.jsx) — Executive header, "OWNER" permission badge, and "Export PDF Report" trigger button.
* [`OwnerMetricsGrid.jsx`](front-end/react-app/src/Pages/OwnerDashboard/components/OwnerMetricsGrid.jsx) — Metric cards: Total Revenue, Monthly Revenue, Active Communities, Monthly Active Users, Paid Subscriptions, and Verified Organizers.
* [`RecentActivityList.jsx`](front-end/react-app/src/Pages/OwnerDashboard/components/RecentActivityList.jsx) — Real-time platform health indicators (`Reachable`, `Degraded`, `Unreachable`) and recent system audit events feed.
* [`SubscriptionsTab.jsx`](front-end/react-app/src/Pages/OwnerDashboard/components/SubscriptionsTab.jsx) — Interactive drill-down modal for inspecting granular details (Subscriptions, Organizers, Reports, Audit Logs).

---

### C. Frontend: Custom Hooks & Data Constants (8 files)
* [`useDiscovery.js`](front-end/react-app/src/Components/platform/hooks/useDiscovery.js) — Manages community listings, client-side filtering, debounced search, category matching, sorting, optimistic join/leave sync, Vite proxy path (`/api`), and user role defaults.
* [`useCreateCommunity.js`](front-end/react-app/src/Components/platform/hooks/useCreateCommunity.js) — Wizard step navigation, slug auto-generation, DTO validation alignment, dynamic channels/rules arrays, and API submission guard.
* [`useCommunityPage.js`](front-end/react-app/src/Components/platform/hooks/useCommunityPage.js) — Community fetch by ID, member enrichment, tab selection, owner deletion cascade, and local storage ownership tracking.
* [`useOwnerDashboard.js`](front-end/react-app/src/Components/platform/hooks/useOwnerDashboard.js) — Stats and revenue fetch with zero-fallbacks (no fake numbers), drill-down query coordination.
* [`discoveryData.js`](front-end/react-app/src/Components/platform/data/discoveryData.js) — Offline demo fallback communities and sort options definitions.
* [`createCommunityOptions.js`](front-end/react-app/src/Components/platform/data/createCommunityOptions.js) — Wizard steps constants, banner gradient palettes, default channels list, and URL regex pattern.
* [`defaultCommunityData.js`](front-end/react-app/src/Components/platform/data/defaultCommunityData.js) — Fallback rules and metadata schemas.
* [`ownerDashboardData.js`](front-end/react-app/src/Components/platform/data/ownerDashboardData.js) — Default 0-state objects for KPI stats and revenue.

---

### D. Frontend: Stylesheets & Shared Components (6 files)
* [`discovery.css`](front-end/react-app/src/styles/discovery.css) — Scoped discovery styles (`.discovery-shell`, `.discovery-content`, `.discovery-filter-bar`, `.discovery-body-area`) enforcing single-scroll containment and full-height filter chips.
* [`create-community.css`](front-end/react-app/src/styles/create-community.css) — Wizard step stepper, color swatches, preview panel layout.
* [`community-page.css`](front-end/react-app/src/styles/community-page.css) — Hero banner, tab strip, sidebar widgets, member row styles.
* [`owner-dashboard.css`](front-end/react-app/src/styles/owner-dashboard.css) — KPI grid, drill-down modal dialog, health status badges.
* [`SideBar.jsx`](front-end/react-app/src/Components/SideBar.jsx) — Persistent navigation sidebar highlighting current route.
* [`App.jsx`](front-end/react-app/src/App.jsx) — React Router routes (`/discovery`, `/create-community`, `/community-page/:id`, `/owner-dashboard`) and `ProtectedRoute` role guard.

---

### E. Backend: Modules, Controllers, Services & Database (10 files)
* [`communities.controller.ts`](back-end/src/modules/communities/communities.controller.ts) — REST endpoints for `/api/communities` (`GET`, `POST`, `PATCH`, `DELETE`).
* [`communities.service.ts`](back-end/src/modules/communities/communities.service.ts) — Business logic for community creation, slug validation, cascading deletion.
* [`community.dto.ts`](back-end/src/modules/communities/dto/community.dto.ts) & [`create-community.dto.ts`](back-end/src/modules/communities/dto/create-community.dto.ts) — Class validator constraints (`@IsString`, `@IsNotEmpty`, `@IsArray`).
* [`memberships.controller.ts`](back-end/src/modules/memberships/memberships.controller.ts) — REST endpoints for `/api/memberships` (query by `communityId` or `userId`, join, leave).
* [`memberships.service.ts`](back-end/src/modules/memberships/memberships.service.ts) — Join/leave persistence and membership checks.
* [`dashboard.controller.ts`](back-end/src/modules/dashboard/dashboard.controller.ts) — REST endpoints for `/api/dashboard/stats` and `/api/dashboard/revenue` (Owner/Admin RBAC).
* [`dashboard.service.ts`](back-end/src/modules/dashboard/dashboard.service.ts) — Aggregates user counts, community counts, subscription tiers, and financial revenue.
* [`subscriptions.controller.ts`](back-end/src/modules/subscriptions/subscriptions.controller.ts) — REST endpoints for `/api/subscriptions` (drill-down view for Owner).
* [`in-memory-db.ts`](back-end/src/common/utils/in-memory-db.ts) — Centralized in-memory database store with seed records (`users`, `communities`, `memberships`, `subscriptions`).

---

## 2. React Concepts & Engineering Principles Used

### 1. Thin Orchestrator Pattern
Instead of monolithic 800-line JSX files mixing fetch logic, form handlers, and DOM rendering, the refactored architecture splits each page into:
1. **Custom Hook:** Holds 100% of the state (`useState`), side-effects (`useEffect`), API requests (`fetch`), and event handler callbacks.
2. **Subcomponents:** Pure presentational components receiving typed props and event callbacks.
3. **Orchestrator Page:** 40–80 lines of clean JSX assembling the layout.

### 2. Custom Hooks & Separation of Concerns
* **`useDiscovery()`**: Isolates the filtering algorithm, debouncing, and multi-endpoint data synchronization (`/communities`, `/memberships`, `/events`). Uses Vite's reverse proxy (`/api`) to eliminate CORS errors and defaults missing user roles to `'user'`.
* **`useCreateCommunity(navigate)`**: Implements a multi-step wizard state machine. Tracks step index, validates current step before advancing, aligns fields with backend `CreateCommunityDto`, builds dynamic arrays (channels, rules), and submits to backend.
* **`useCommunityPage(id, navigate)`**: Manages active tab state, fetches community by ID, queries member list, filters members locally, and handles optimistic join/leave updates.
* **`useOwnerDashboard()`**: Aggregates high-level analytics, handles backend health detection, and drives the drill-down modal without substituting fake revenue numbers.

### 3. Derived State with `useMemo`
In `useDiscovery.js`, instead of duplicating filtered lists into separate `useState` variables (which causes extra re-renders and stale state bugs), lists and category counts are derived on the fly:
```javascript
const filtered = useMemo(() => {
  return communities.filter((c) => {
    const matchesSearch = !q || c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'All' || (c.category || '').toLowerCase() === cat || (c.tags || []).some(t => String(t).toLowerCase() === cat);
    return matchesSearch && matchesCategory;
  }).sort(sortComparator);
}, [communities, search, activeCategory, sortBy]);
```

### 4. Layout Containment & Scoped CSS Architecture
To prevent global layout rules (`.content`, `.filter-bar` in `dashboard.css` or `global.css`) from shrinking or clipping the discovery page, scoped wrapper classes are applied:
* `.discovery-shell` and `.discovery-content`: Ensure `.content` serves as the single scroll container (`flex: 1`, `overflow-y: auto`, `padding: 0`, `gap: 0`).
* `.discovery-filter-bar`: Prevents category bar compression with `flex-shrink: 0`, `min-height: 62px`, `height: auto`, and horizontal scrolling for category chips.
* `.discovery-body-area`: Configured with `overflow: visible` and `height: auto` to prevent nested scrollbars.

### 5. Lifecycle Cleanup & Race-Condition Prevention
In all hooks (`useDiscovery`, `useCommunityPage`), asynchronous effects use a `cancelled = true` cleanup flag:
```javascript
useEffect(() => {
  let cancelled = false;
  async function load() {
    const res = await fetch(...);
    if (cancelled) return; // Discard result if component unmounted or ID changed
    setData(await res.json());
  }
  load();
  return () => { cancelled = true; };
}, [id]);
```

### 6. Optimistic UI Updates & Offline Fallbacks
* **Joining/Leaving:** When clicking "Join Community", `useDiscovery` immediately toggles the button state and updates `localStorage ('nexus_joined_communities')` before the HTTP request finishes. If the server fails, it rolls back gracefully and displays a toast.
* **Graceful Degradation:** If the backend is offline, the pages fallback to `DEFAULT_COMMUNITIES` while displaying a yellow indicator warning rather than crashing or showing a white blank screen.

### 7. Role-Based Access Control (RBAC) in Routing
Protected in `App.jsx`:
* `/owner-dashboard` is restricted via `<ProtectedRoute allowedRoles={['owner', 'admin']}>`.
* If an unauthenticated user visits, they are redirected to `/login`.
* If a regular user (`player01`) attempts to access `/owner-dashboard`, they are redirected to `/dashboard`.
* Delete community buttons in `CommunityBanner.jsx` are guarded by `isOwner = user.id === community.ownerId || user.role === 'admin'`.

---

## 3. Backend & REST API Deep Dive

The backend is built with **NestJS**, adhering to the Controller-Service-Repository architecture with TypeScript DTOs.

```
       HTTP Request
            │
            ▼
    [GlobalRateLimiter & Helmet]
            │
            ▼
     [ValidationPipe]  (Validates DTOs)
            │
            ▼
     [RolesGuard (RBAC)] (Checks x-role header)
            │
            ▼
    [CommunitiesController]
            │
            ▼
    [CommunitiesService]
            │
            ▼
    [In-Memory DB Store (db.json)]
```

### Complete API Specification for Karmanya's Component

#### 1. Communities API
| Endpoint | Method | Role Required (`x-role`) | Request Body | Response Description |
|---|---|---|---|---|
| `/api/communities` | `GET` | Any valid role | None | Returns array of all community objects with enriched fields (`category`, `icon`, `memberCount`, `onlineCount`). |
| `/api/communities/:id` | `GET` | Any valid role | None (URL param `:id`) | Returns single community record matching numeric ID. |
| `/api/communities` | `POST` | `admin`, `community_manager`, `user`, `organizer` | `CreateCommunityDto`: `{ name, description, ownerId, tags, icon, category, slug, visibility, rules, channels }` | Returns newly created community object with assigned numeric `id`. |
| `/api/communities/:id` | `PATCH` | `admin`, `community_manager`, `user`, `organizer` | `UpdateCommunityDto`: Partial fields | Updates specified fields (e.g. adding channels or updating rules). |
| `/api/communities/:id` | `DELETE` | `admin`, `community_manager`, `user`, `organizer` | None | Cascades deletion to remove all memberships and community events; returns `{ message: "Community :id deleted" }`. |

#### 2. Memberships API
| Endpoint | Method | Role Required (`x-role`) | Query / Body | Response Description |
|---|---|---|---|---|
| `/api/memberships` | `GET` | Any valid role | `?communityId=:id` or `?userId=:id` | Lists all matching memberships (e.g., all members belonging to community 1). |
| `/api/memberships` | `POST` | Any valid role | `{ communityId: number, userId: number }` | Creates membership record; joins user to community. |
| `/api/memberships/:id` | `DELETE` | Any valid role | None (URL param `:id`) | Removes membership record; user leaves community. |

#### 3. Owner Dashboard & Analytics API
| Endpoint | Method | Role Required (`x-role`) | Response Description |
|---|---|---|---|
| `/api/dashboard/stats` | `GET` | `admin`, `owner`, `community_manager`, `moderator`, `user` | Returns aggregated metrics: `{ totalUsers, totalCommunities, totalEvents, pendingReportsCount, pendingAppealsCount, totalMemberships }`. |
| `/api/dashboard/revenue` | `GET` | `admin`, `owner` (**Strict RBAC**) | Returns financial analytics: `{ totalRevenue, monthlyRevenue, subscriptionRevenue, organiserRevenue, featuredEventRevenue, premiumUsers, verifiedOrganisers }`. |
| `/api/subscriptions` | `GET` | `admin`, `owner` (**Strict RBAC**) | Returns breakdown of active subscription plans and active subscribers list for the drill-down modal. |

---

## 4. Key Logic Walkthroughs (Code-Level)

### Walkthrough 1: Slug Auto-Generation & Wizard Flow
In `useCreateCommunity.js`:
```javascript
const handleNameChange = (val) => {
  setName(val);
  // Replaces spaces and special characters with hyphens for clean URLs
  setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
};

const validateStep = (step) => {
  if (step === 1) {
    if (!name.trim()) { showToast('⚠️ Community name is required'); return false; }
    if (!desc.trim()) { showToast('⚠️ Description is required'); return false; }
    if (website && !URL_PATTERN.test(website)) { showToast('⚠️ Invalid website URL'); return false; }
  }
  return true;
};
```
*Evaluator Point:* Shows controlled input management, instant UX feedback with sanitized slugs, and defensive form validation before transitioning wizard steps.

---

### Walkthrough 2: Cascade Community Deletion
In `communities.service.ts`:
```typescript
remove(id: number) {
  const index = db.communities.findIndex((item) => item.id === id);
  if (index === -1) throw new NotFoundException(`Community ${id} not found`);
  
  db.communities.splice(index, 1);
  // Cascade delete: remove memberships and events associated with this community
  db.memberships = db.memberships.filter((m) => m.communityId !== id);
  db.events = db.events.filter((e) => e.communityId !== id);
  saveDb();
  return { message: `Community ${id} deleted` };
}
```
*Evaluator Point:* Demonstrates referential integrity handling in the in-memory database, ensuring no orphaned memberships or events exist after community deletion.

---

### Walkthrough 3: Owner Drill-Down Data Fetching (Preventing React Antipatterns)
In `useOwnerDashboard.js`:
* **Initial Anti-Pattern:** Storing raw JSX table elements directly into a `drillContent` state variable.
* **Refactored React Pattern:** `useOwnerDashboard` fetches pure JSON data from `/api/subscriptions`, `/api/organisers`, or `/api/audit-log`. The raw data is passed as props to `SubscriptionsTab.jsx`, which handles rendering. State contains **only data**, never JSX.

---

### Walkthrough 4: Discovery Layout Containment & Single-Scroll Architecture
In `Discovery.jsx` and `discovery.css`:
```jsx
// Discovery.jsx — Scoped layout wrappers prevent conflicting CSS leaks
<div className="app-shell discovery-shell">
  <SideBar />
  <div className="main">
    <DiscoveryHeader />
    <div className="content discovery-content">
      <DiscoveryHero ... />
      <CategoryFilterBar ... />
      <CommunityGrid ... />
    </div>
  </div>
</div>
```
```css
/* discovery.css — Enforcing single scroll container and full-height filter chips */
.app-shell.discovery-shell .content.discovery-content {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  height: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 0 !important;
  gap: 0 !important;
}

.discovery-shell .filter-bar.discovery-filter-bar {
  flex-shrink: 0 !important;
  min-height: 62px !important;
  height: auto !important;
  overflow-x: auto !important;
}
```
*Evaluator Point:* Demonstrates advanced CSS layout debugging and architectural scoping. When external global styles from dashboard or community settings leak into `.content`, scoping ensures the page maintains a single scroll container while protecting the filter bar from height-squeezing or overflow clipping.

---

## 5. Potential Evaluator Questions & Answers

### Q1: Why did you refactor the 4 Community pages into Custom Hooks and Subcomponents?
> **Answer:** "Previously, the pages were monolithic HTML-converted JSX files over 700 lines long, tightly coupling DOM structure, fetch calls, state management, and error handling. I refactored them to follow the **Thin Orchestrator & Custom Hook pattern** (mirroring PR #3). All business logic, lifecycle operations, and API communications are encapsulated inside reusable hooks (`useDiscovery`, `useCreateCommunity`, `useCommunityPage`, `useOwnerDashboard`). This achieves strict separation of concerns, makes the components testable, avoids prop-drilling, and reduces each page file to under 80 lines."

### Q2: How does the application handle backend downtime or slow connections?
> **Answer:** "We implemented graceful degradation with zero fake data substitution:
> 1. In `useDiscovery`, if `/api/communities` fails, a yellow warning banner informs the user while displaying baseline fallback communities from `discoveryData.js`.
> 2. In `useOwnerDashboard`, fallback values are explicitly set to `0` and the status badge switches to `⚠️ Unreachable`. We never substitute fake revenue numbers because doing so would deceive the platform owner.
> 3. In `useCommunityPage`, if an invalid ID is provided, it renders a friendly empty state with a 'Browse Communities' redirect button."

### Q3: How is Role-Based Access Control (RBAC) enforced between Frontend and Backend?
> **Answer:** 
> - **On Frontend:** In `App.jsx`, routes like `/owner-dashboard` are wrapped in `<ProtectedRoute allowedRoles={['owner', 'admin']}>`, which validates the logged-in user in `localStorage`. Additionally, delete buttons in `CommunityBanner.jsx` only render if `isOwner` evaluates to true.
> - **On Backend:** NestJS uses a custom `@Roles()` decorator and an RBAC guard checking the `x-role` header on every request. For example, `GET /api/dashboard/revenue` strictly enforces `AppRole.ADMIN` and `AppRole.OWNER`, returning `403 Forbidden` for any regular user.

### Q4: How do the Create Community Wizard and live preview stay in sync?
> **Answer:** "The form fields are controlled components managed by `useCreateCommunity`. Every keystroke on community name, description, category, or banner selection immediately updates hook state. The `preview-card` in `CreateCommunity.jsx` reads directly from that state, providing instantaneous live preview rendering without needing any external event emitters or DOM querying."

### Q5: How was the Discovery page layout issue (squeezed filter bar) resolved?
> **Answer:** "The issue arose because global CSS rules for `.content` (with default padding and flex gaps from dashboard styles) were leaking into the Discovery page, which in turn squeezed `.filter-bar` and created conflicting nested scroll containers. I resolved this by applying scoped wrapper classes (`discovery-shell`, `discovery-content`, `discovery-filter-bar`, and `discovery-body-area`). This configured `.discovery-content` as the single vertical scroll container, set `.discovery-filter-bar` with `flex-shrink: 0` and `min-height: 62px`, and guaranteed full-height rendering of all filter chips and the sort dropdown across all viewports."
