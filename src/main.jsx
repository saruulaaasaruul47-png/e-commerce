import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/home';
import Products from './pages/products';
import Details from './pages/details';
import Cart from './pages/cart';
import  Log_in from './pages/login';
import Signin from './pages/signin';
import Account from './pages/account';
import ShopLayout from './pages/shop-layout';
import Wishlist from './pages/wishlist';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    element: <ShopLayout />,
    children: [
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/orders',
        element: <Cart />
      },
      {
        path: '/wishlist',
        element: <Wishlist />
      }
    ]
  },
  {
    path: "/details/:id",
    element: <Details />
  },
  {
    path: '/login',
    element: < Log_in />
  },
  {
    path: '/signin',
    element: < Signin />
  },
  {
    path: '/account',
    element: <Account />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
