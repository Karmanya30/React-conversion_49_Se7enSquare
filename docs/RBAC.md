# Role-Based Access Control (RBAC) & Identity Specification

This document specifies the Role-Based Access Control (RBAC), identity validation, and account status architecture across the Se7enSquare (Gameunity) platform.

---

## 1. Role Hierarchy & Vocabulary

| Role Name | Internal Code (`AppRole`) | Canonical Home Route | Scope & Responsibilities |
|---|---|---|---|
| **System Administrator** | `admin` | `/admin-dashboard` | Superuser platform governance: user directory, role assignments, community oversight, moderation, system config. |
| **Platform Owner** | `owner` | `/owner-dashboard` | Statistics and platform health telemetry. This is a metrics/read-only executive role distinct from community owners. |
| **Moderator** | `moderator` | `/mod-panel` | Content and community safety: queue inspection, sanction dispatch, appeals review. |
| **Community Manager** | `community_manager` | `/event-approval` | Event proposals, verification, and community lifecycle management. |
| **Organizer** | `organizer` | `/organizer-dashboard` | Tournament operations, brackets, participant management, and event creation. |
| **Gamer / User** | `user` | `/dashboard` | Standard player access: dashboard, discovery, chat channels, event registrations, reports, profile settings. |

---

## 2. Canonical Home Routes (`getHomeRoute`)

Every user role is bound to a canonical entry point via `getHomeRoute(role)` defined in `front-end/react-app/src/services/roleAccess.js`:

```javascript
export function getHomeRoute(role) {
  const normalized = typeof role === 'string' ? role.trim().toLowerCase() : 'user';
  switch (normalized) {
    case 'admin':             return '/admin-dashboard';
    case 'owner':             return '/owner-dashboard';
    case 'moderator':         return '/mod-panel';
    case 'organizer':         return '/organizer-dashboard';
    case 'community_manager': return '/event-approval';
    case 'user':
    default:                  return '/dashboard';
  }
}
```

This helper is used consistently across:
- **Sidebar brand logo link** (clicking the logo takes the user to their role-specific home route).
- **Post-login redirect** (`useAuthForm.js` redirects directly to `getHomeRoute(user.role)`).
- **`ProtectedRoute` unauthorized access fallback** (redirects unauthorized users back to their authorized home route).

---

## 3. Permission Matrix (`ROLE_ROUTE_PERMISSIONS`)

The matrix in `front-end/react-app/src/services/roleAccess.js` governs access to all application paths:

| Route Path | Allowed Roles | Description |
|---|---|---|
| `/`, `/landing`, `/login`, `/pricing` | `*` (All / Public) | Publicly accessible marketing and authentication routes |
| `/dashboard` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Player dashboard |
| `/chat` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Community channel chat |
| `/discovery` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Public community directory |
| `/create-community` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Community creation wizard |
| `/community-page`, `/community-page/:id` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Community detail & feed |
| `/community-settings`, `/community-settings/:id` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Community settings (owner/admin) |
| `/events` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Event directory |
| `/event-registrants` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Event attendance roster |
| `/report` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | Conduct & content reporting form |
| `/appeal` | `*` (All including suspended) | Sanction appeal submission |
| `/profile-settings` | `user`, `moderator`, `community_manager`, `organizer`, `admin`, `owner` | Account settings & profile |
| `/user` | `user`, `moderator`, `community_manager`, `organizer`, `admin` | User profile view |
| `/admin-dashboard` | `admin` | Central administration panel |
| `/owner-dashboard` | `owner`, `admin` | Platform analytics and telemetry |
| `/organizer-dashboard` | `organizer`, `admin` | Tournament & bracket operations |
| `/mod-panel` | `moderator`, `admin` | Moderation queue and reports |
| `/event-approval` | `community_manager`, `manager`, `admin` | Event proposal approvals |

---

## 4. Server-Side Identity & Auth Context

Server-side identity verification is enforced by `AuthContextGuard` registered globally in `back-end/src/app.module.ts`:

1. **Identity Extraction**:
   - Reads `x-user-id` header from incoming HTTP requests.
   - For non-public endpoints, returns `401 Unauthorized` if `x-user-id` is missing or does not match an existing database user.
2. **Server-Side Role Derivation & Verification**:
   - Fetches the user record directly from the database.
   - If the client sends an `x-role` header that conflicts with the user's persisted database role, returns `403 Forbidden` (`Role header mismatch`).
   - Attaches the verified user record to `request.user`.
3. **Restricted Account Enforcement**:
   - If `user.status === 'suspended'`, the guard blocks access with `403 Forbidden` carrying `{ code: 'ACCOUNT_SUSPENDED', reason: user.statusReason, until: user.statusUntil }`.
   - If `user.status === 'banned'`, the guard blocks access with `403 Forbidden` carrying `{ code: 'ACCOUNT_BANNED', reason: user.statusReason }`.
   - **Allowed restricted endpoints**: The guard permits access for restricted users exclusively to:
     - `GET /users/me`
     - `GET /sanctions/mine`
     - `/appeals` (`POST` and `GET`)
     - `GET /notifications`
4. **Integration with `RolesGuard` and `@CurrentUser()`**:
   - `RolesGuard` derives the user's role from `request.user.role` (loaded securely by `AuthContextGuard`), preventing header spoofing.
   - Controllers access the authenticated user via `@CurrentUser()` or `@CurrentUser('id')`.

---

## 5. Security & Sensitive Field Sanitization

1. **Password Hashing**:
   - Passwords are securely hashed using `node:crypto`'s `scryptSync` with salt: `salt:derivedKeyHex`.
   - Migrations automatically upgrade legacy plain passwords to scrypt hashes. Default seed password is `Demo@123`.
2. **Zero Password Leakage**:
   - `sanitizeUser()` strips both `password` and `passwordHash` before any user record is returned over HTTP.
   - Applies to: `POST /auth/login`, `POST /auth/register`, `POST /auth/google`, `GET /users/me`, `PATCH /users/me`, `GET /users`, `GET /users/:id`, and `POST /users`.
3. **Endpoint Separation for User Updates**:
   - `PATCH /users/me`: Authenticated user profile updates. Whitelists `firstName`, `lastName`, `bio`, `phone`, `avatar`. Normal users cannot modify their role or status.
   - `PATCH /users/:id/role`: Admin-only endpoint to assign roles. Contains validation preventing administrators from demoting themselves or the last remaining system administrator.

---

## 6. Frontend Session & Error Handling

1. **Session Storage Hygiene**:
   - `localStorage.getItem('user')` contains strictly sanitized session data: `{ id, username, role, name }`. Never contains passwords, hashes, or tokens.
2. **Restricted Account Handling**:
   - `services/api.js` and the temporary fetch shim in `main.jsx` detect `ACCOUNT_BANNED` and `ACCOUNT_SUSPENDED` response codes.
   - On error, active session credentials are cleared and the user is redirected to `/login?accountStatus=...&statusReason=...`. Suspended accounts are presented with a direct button to file an appeal via `/appeal`.
