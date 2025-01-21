// @ts-nocheck
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import MenuManagement from '../pages/MenuManagement';
import ApiManagement from '../pages/ApiManagement';
import PageManagement from '../pages/PageManagement';
import PageCreator from '../pages/PageCreator';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <MainLayout />,
    children: [
      {
        path: 'menu',
        element: <MenuManagement />,
      },
      {
        path: 'apis',
        element: <ApiManagement />,
      },
      {
        path: 'pages',
        element: <PageManagement />,
      },
      {
        path: 'page-creator/:pageName',
        element: <PageCreator />,
      },
    ],
  },
]); 