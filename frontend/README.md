# TripNova — Frontend

The face of TripNova. Built with React 18, this is everything the user sees and interacts with — from browsing destinations and hotels to planning trips, managing bookings, and leaving reviews.

---

## What's Inside

- **React 18** — UI library
- **React Router v6** — client-side routing
- **Axios** — HTTP requests to the backend
- **Bootstrap 5 + Bootstrap Icons** — styling and icons
- **Framer Motion** — smooth page/component animations
- **Chart.js + react-chartjs-2** — budget visualisation charts

---

## Project Structure

```
src/
├── assets/          # Images and static files
├── components/
│   ├── cards/       # DestinationCard, HotelCard, PackageCard
│   ├── common/      # Modals (Booking, Enquiry, Login, TripDetail), ScrollToTop
│   ├── footer/      # Footer
│   └── navbar/      # Navbar
├── context/         # React Context providers (Auth, Destinations, etc.)
├── data/            # Static/seed data if any
├── layouts/         # Page layout wrappers
├── pages/
│   ├── admin/       # Admin dashboard, manage destinations/hotels/packages/users...
│   ├── auth/        # Login, Signup, ForgotPassword
│   ├── public/      # Home, Landing, Destinations, Hotels, Packages, Gallery, Reviews...
│   └── user/        # Profile, MyBookings, MyTrips, TripPlanner, BudgetPlanner, Wishlist
├── routes/          # Route definitions and protected route guards
├── services/
│   └── api.js       # All Axios API calls, grouped by feature
└── utils/           # Helper/utility functions
```

---

## Pages at a Glance

| Area   | Pages |
|--------|-------|
| Public | Home, Landing, Destinations, Destination Detail, Hotels, Hotel Detail, Packages, Package Detail, Gallery, Reviews, About Us, Contact Us, FAQ, Privacy Policy, Terms |
| Auth   | Login, Signup, Forgot Password |
| User   | Dashboard, Profile, My Bookings, My Enquiries, My Trips, Trip Planner, Budget Planner, Wishlist |
| Admin  | Dashboard, Destinations, Hotels, Packages, Enquiries, Reviews, Gallery, Users |

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm

### Install & Run

```bash
cd Frontend/frontend
npm install
npm start
```

App runs at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## Environment / API

The app talks to the backend via `src/services/api.js`. The base URL is currently pointing to the deployed backend:

```
https://tripnova-backend-tdec.onrender.com/api
```

If you're running the backend locally, update the `baseURL` in `src/services/api.js`:

```js
const api = axios.create({ baseURL: 'http://localhost:5000/api' });
```

Auth tokens are stored in `localStorage` and automatically attached to every request via an Axios interceptor.

---

## Deployment

The frontend is deployed on **Vercel**. The `vercel.json` handles SPA routing so all paths correctly resolve to `index.html`.

Live URL: [https://trip-nova-frontend.vercel.app](https://trip-nova-frontend.vercel.app)

---

## Roles

| Role  | Access |
|-------|--------|
| Guest | Browse destinations, hotels, packages, gallery, reviews |
| User  | Everything above + bookings, wishlist, trip planner, budget planner, enquiries |
| Admin | Full CRUD on all content + manage users and enquiries |
