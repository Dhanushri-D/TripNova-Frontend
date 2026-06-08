import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
const Landing = lazy(() => import('../pages/public/Landing'));
const Home = lazy(() => import('../pages/public/Home'));
const Destinations = lazy(() => import('../pages/public/Destinations'));
const DestinationDetail = lazy(() => import('../pages/public/DestinationDetail'));
const Packages = lazy(() => import('../pages/public/Packages'));
const PackageDetail = lazy(() => import('../pages/public/PackageDetail'));
const Hotels = lazy(() => import('../pages/public/Hotels'));
const HotelDetail = lazy(() => import('../pages/public/HotelDetail'));
const Gallery = lazy(() => import('../pages/public/Gallery'));
const Reviews = lazy(() => import('../pages/public/Reviews'));
const AboutUs = lazy(() => import('../pages/public/AboutUs'));
const ContactUs = lazy(() => import('../pages/public/ContactUs'));
const FAQ = lazy(() => import('../pages/public/FAQ'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/public/Terms'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// User Pages
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const Wishlist = lazy(() => import('../pages/user/Wishlist'));
const BudgetPlanner = lazy(() => import('../pages/user/BudgetPlanner'));
const TripPlanner = lazy(() => import('../pages/user/TripPlanner'));
const Profile = lazy(() => import('../pages/user/Profile'));
const MyTrips = lazy(() => import('../pages/user/MyTrips'));
const MyBookings = lazy(() => import('../pages/user/MyBookings'));
const MyEnquiries = lazy(() => import('../pages/user/MyEnquiries'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminDestinations = lazy(() => import('../pages/admin/AdminDestinations'));
const AdminPackages = lazy(() => import('../pages/admin/AdminPackages'));
const AdminHotels = lazy(() => import('../pages/admin/AdminHotels'));
const AdminEnquiries = lazy(() => import('../pages/admin/AdminEnquiries'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));
const AdminGallery = lazy(() => import('../pages/admin/AdminGallery'));

const Loader = () => (
  <div className="loading-container" style={{ minHeight: '100vh' }}>
    <div className="spinner-teal"></div>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Public with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/budget-planner" element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
        <Route path="/trip-planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/my-enquiries" element={<ProtectedRoute><MyEnquiries /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="gallery" element={<AdminGallery />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
