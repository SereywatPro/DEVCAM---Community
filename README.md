# DEVCAM — Developer Blog Community (Frontend)

DEVCAM is the client application for a blog community built for developers. People can browse and read articles for free, and registered members can write, edit, and manage their own posts from a personal dashboard. Site administrators get a separate dashboard for moderating users, articles, and categories.

This repository contains only the frontend. It is a single-page application built with **Vue 3** and the Composition API, styled with **Bootstrap 5** on top of a small custom design system, and it talks to a separate Node/Express + MySQL backend over a REST API.

## Features

- **Public browsing** — anyone can read the home page, the blog list, and individual articles without an account.
- **Authentication** — register and log in against the backend's JWT-based auth endpoints. The session token is kept in `localStorage` and attached to every request automatically.
- **Author dashboard** — logged-in members can create, edit, and delete their own articles, upload a thumbnail per article, and manage their profile (avatar, bio, phone, address).
- **Admin dashboard** — accounts with the `admin` role get an additional `/admin` section for:
  - reviewing and searching all registered users, promoting/demoting roles, and soft-deleting or restoring accounts;
  - moderating any user's articles (edit or delete, not just your own);
  - creating, renaming, and deleting categories.

  There is no separate admin login — admins sign in through the same `/login` page as everyone else. Access to `/admin/*` is enforced entirely by the Vue Router navigation guard checking the logged-in user's role, and the "Admin" link in the navbar only appears for admin accounts.
- **Client-side validation** — email format, password strength, and image type/size checks run before anything is sent to the API, with inline error messages on every form.
- **Toast notifications** and **confirm-before-delete modals** for a consistent feedback pattern across destructive actions.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Routing | Vue Router 5, with a global `beforeEach` guard |
| State management | Pinia |
| HTTP client | Axios, with a shared instance, request/response interceptors, and centralized error handling |
| Styling | Bootstrap 5 + a small custom CSS design system (`src/assets/main.css`) — hairline borders, an editorial display typeface, and a consistent set of reusable `.btn-ink` / `.badge-tag` / `.eyebrow` utility classes |
| Build tool | Vite |

## Project structure

```
src/
  api/            One file per backend resource (auth, article, category, profile, admin),
                   each wrapping the matching Express routes.
  assets/         Global design tokens and base styles.
  components/
    admin/        Shared admin UI (tab navigation).
    blog/         Article-related components (BlogCard, ArticleForm).
    common/       App-wide building blocks (navbar, footer, hero, modals, pagination, etc).
  composables/    Reusable logic not tied to a component (form validators).
  layouts/        Page shell that wraps every route (navbar + footer + toast stack).
  router/         Route table and the auth/role navigation guard.
  stores/         One Pinia store per domain: auth, article, category, profile, toast,
                   plus adminUsers and adminArticles for the admin dashboard.
  views/          Route-level components, grouped by feature (Home, Auth, Articles,
                   Dashboard, Profile, Admin, Static).
```

## Getting started

### Prerequisites

- Node.js 18 or later
- A running instance of the companion backend (Express + MySQL), reachable over HTTP

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:3131
```

This should point at wherever the backend is running. It's used both as the Axios base URL and to build absolute URLs for uploaded images (avatars and article thumbnails), since the API returns those as relative paths.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot module reload |
| `npm run build` | Production build, output to `dist/` |
| `npm run preview` | Serve the production build locally, for a final check before deploying |

### Running locally

```bash
npm install
npm run dev
```

The app will be available at the URL Vite prints (typically `http://localhost:5173`). Make sure the backend is running and `VITE_API_BASE_URL` points at it, or every API call will fail.

## Authentication and roles

The backend issues a JWT on login, which this app stores in `localStorage` and sends as a `Bearer` token on every subsequent request. The current user's `role` (`user` or `admin`) comes back from both the login response and `GET /me`, and drives two things on the frontend:

- the router guard, which blocks `/admin/*` routes for non-admins and redirects them to the regular dashboard;
- the navbar, which only renders the "Admin" link for admin accounts.

There is intentionally no self-service way to become an admin from within the app — that's a deliberate action taken directly against the database on the backend.

## Notes on the backend contract

A few details worth knowing if you're extending this app:

- Articles are created and updated with a numeric `category_id`, not a category name.
- Thumbnails and avatars are returned as **relative paths** (e.g. `uploads/thumbnails/x.jpg`), not full URLs — the frontend builds the final `<img src>` by prefixing `VITE_API_BASE_URL`.
- A thumbnail can only be uploaded to an article that already exists, so creating a new article with an image is a two-step flow: create the article, then upload the thumbnail against the returned article id.
- Some backend endpoints report failures with an HTTP 200 status and `{ result: false, message }` in the body instead of a 4xx/5xx status. The shared Axios instance in `src/api/axios.js` treats `result === false` as a failed request either way, so this is handled once, centrally, rather than in every view.

---

**Author:** SEREYWAT
