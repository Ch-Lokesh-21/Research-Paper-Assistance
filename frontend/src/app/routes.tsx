import React from 'react';
import { type RouteObject} from 'react-router-dom';
import PageLoder from '../components/common/PageLoder';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const PageNotFound = React.lazy(() => import('../components/common/PageNotFound'));

const Login = React.lazy(() => import('../features/auth/components/Login'));
const Register = React.lazy(() => import('../features/auth/components/Register'));
const HomePage = React.lazy(() => import('../features/home/components/HomePage'));
const ChatLayout = React.lazy(() => import('../features/chat/components/ChatLayout'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <React.Suspense fallback={<PageLoder />}>
        <HomePage />
      </React.Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<PageLoder />}>
        <Login />
      </React.Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<PageLoder />}>
        <Register />
      </React.Suspense>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoder />}>
          <ChatLayout />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat/:sessionId',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<PageLoder />}>
          <ChatLayout />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <React.Suspense fallback={<PageLoder />}>
        <PageNotFound />
      </React.Suspense>
    ),
  },
];

export default routes;
