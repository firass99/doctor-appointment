# Frontend

React + Vite client for the MERN clinic/doctor-booking app. Talks to the Express/MongoDB API in [../backend](../backend).

## Tech stack

- React 19 + React Router 7
- Vite 8
- Tailwind CSS 4 + shadcn/ui (Radix/base-ui primitives)
- React Hook Form + Zod for form handling/validation
- sonner for toast notifications

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on Vite's default port (http://localhost:5173) and expects the backend API to be running separately (see [../backend](../backend)).

## Scripts

- `npm run dev` – start the Vite dev server with HMR
- `npm run build` – build for production
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint

## Project structure

```
src/
  components/
    pages/
      (guest)/      public pages: home, about, contact, departments, doctors, login, register
      (dashboard)/  authenticated user pages: account, appointments, notifications, doctor profile
      (admin)/      admin dashboard: overview, users, doctors, specialities
    sections/       landing page sections (hero, services, testimonials, footer, etc.)
    ui/             shadcn/ui primitives (button, input, field, label, ...)
    GuestRoute.jsx, ProtectedRoute.jsx   route guards
    NotificationBell.jsx, StatusBadge.jsx, Photo.jsx, DoctorCard.jsx
  hooks/            useAuth, AuthContext, useNotifications
  lib/
    apiClient.js    fetch wrapper
    api/            one module per backend resource
  App.jsx           app routes
```

Route groups follow a Next.js-style naming convention (parentheses) purely for organization — they don't affect React Router paths.

## Auth context (`src/hooks/AuthContext.jsx`)

`AuthProvider` wraps the whole app in [App.jsx](src/App.jsx) (outside the router) and owns the signed-in user's state:

- `user` – current user object, or `null`. Fetched once on mount via `authService.getMe()` if a token exists in `localStorage`.
- `loading` – true until that initial check resolves. Route guards show a spinner while this is true instead of redirecting prematurely.
- `isAuthenticated` – `Boolean(user)`.
- `login(credentials)`, `register(payload)`, `logout()`, `refreshUser()` – thin wrappers around [`lib/api/auth.js`](src/lib/api/auth.js) that also update local `user` state.

It also listens for a global `auth:unauthorized` DOM event (dispatched by the API client on a 401, see below) and logs the user out automatically when the backend rejects the stored token.

Don't consume `AuthContext` directly — use the `useAuth()` hook instead ([src/hooks/useAuth.js](src/hooks/useAuth.js)), which throws if called outside an `AuthProvider`.

## Hooks (`src/hooks/`)

- **`useAuth()`** – returns `{ user, loading, isAuthenticated, login, register, logout, refreshUser }` from `AuthContext`.
- **`useNotifications({ poll = false } = {})`** – loads the signed-in user's notifications and unread count from [`lib/api/notifications.js`](src/lib/api/notifications.js). Resets to empty when logged out. Pass `{ poll: true }` to re-check the unread count every 60s (used by `NotificationBell`). Returns `{ items, unreadCount, loading, refresh, markAsRead, markAllAsRead, remove, clearRead }`; mutations show `sonner` toasts on success/failure.

## API client (`src/lib/`)

[`apiClient.js`](src/lib/apiClient.js) is a small `fetch` wrapper, not axios:

- Base URL from `VITE_API_URL` (env var), defaulting to `http://localhost:3000/api`.
- Attaches `Authorization: Bearer <token>` from `localStorage` (`"token"` key) on every request.
- Serializes a plain object `body` to JSON automatically.
- Throws an `Error` with the backend's `message` (or `HTTP error! status: <code>`) on non-2xx responses.
- On a 401, dispatches `window.dispatchEvent(new Event("auth:unauthorized"))` instead of trying to refresh — there is no refresh-token flow. `AuthContext` listens for this and logs the user out.
- Exposes `apiClient.get/post/put/patch/delete(endpoint, options)`.

`lib/api/` has one module per backend resource, each a thin set of named functions calling `apiClient` against a specific endpoint (role requirements noted in comments):

| Module | Covers |
| --- | --- |
| `auth.js` | register, login, logout, getMe, updateMe, token helpers |
| `users.js` | admin user list/lookup/role update/delete |
| `notifications.js` | list, unread count, mark read/all read, delete |
| `appointments.js` | booked slots, create/cancel, my/all appointments, update status |
| `doctors.js` | list/lookup doctors, doctor's own profile, admin create/activate |
| `specialities.js` | list/lookup/create/update/delete specialities |

Prefer importing from these modules over calling `apiClient` directly in components.

## Route guards (middleware-equivalent)

React Router has no server middleware, so access control is enforced with layout-route wrapper components in [`src/components/`](src/components):

- **`GuestRoute`** – for `/login` and `/register`. Redirects to `/dashboard` if already authenticated, otherwise renders the nested route.
- **`ProtectedRoute({ roles })`** – redirects to `/login` if unauthenticated (preserving the attempted location in router state), or to `/` if `roles` is given and the user's role isn't in it. Both guards show a spinner while `AuthContext`'s initial `loading` check is in flight.

In [App.jsx](src/App.jsx), these are nested to stack checks — e.g. `/dashboard` is wrapped in `ProtectedRoute roles={["ADMIN","DOCTOR","USER"]}` (any signed-in user), and admin-only pages inside it (`users`, `doctors`, `specialities`) are wrapped again in `ProtectedRoute roles={["ADMIN"]}`.
