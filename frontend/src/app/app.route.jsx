import { createBrowserRouter } from "react-router";

import Chat from "../features/chats/pages/Chat";

import Home from "../features/home/pages/Home";

import Login from "../features/auth/pages/Login";

import AuthCallback from "../features/auth/pages/AuthCallback";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthLayout from "../components/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "api/auth/google/callback",
        element: <AuthCallback />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
