import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/common/ScrollToTop';

const AuthLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default AuthLayout;
