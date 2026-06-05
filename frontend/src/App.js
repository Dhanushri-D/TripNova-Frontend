import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DestinationProvider } from './context/DestinationContext';
import { PackageProvider } from './context/PackageContext';
import { HotelProvider } from './context/HotelContext';
import { WishlistProvider } from './context/WishlistContext';
import { BookingProvider } from './context/BookingContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <DestinationProvider>
          <PackageProvider>
            <HotelProvider>
              <WishlistProvider>
                <BookingProvider>
                  <AppRoutes />
                </BookingProvider>
              </WishlistProvider>
            </HotelProvider>
          </PackageProvider>
        </DestinationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
