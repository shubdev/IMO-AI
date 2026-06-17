import { createBrowserRouter } from "react-router";

import Chat from "../features/chats/pages/Chat";

import Home from "../features/home/pages/Home";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import AuthLayout from "../components/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
        {
          path: "register",
          element: <Register />, 
        },
        {
          path: "login",
          element: <Login />, 
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
