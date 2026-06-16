import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

import { setUser, clearUser, setLoading } from "../state/auth.slice";

import { getCurrentUser } from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (path === "/login") {
      dispatch(clearUser());
      return;
    }

    if (path === "/api/auth/google/callback") {
      dispatch(setLoading(true));
      return;
    }

    let isActive = true;

    async function checkAuth() {
      try {
        dispatch(setLoading(true));

        const data = await getCurrentUser();

        if (!isActive) {
          return;
        }

        if (data?.success) {
          dispatch(setUser(data.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        if (!isActive) {
          return;
        }

        dispatch(clearUser());
      }
    }

    checkAuth();

    return () => {
      isActive = false;
    };
  }, [dispatch, location.pathname]);
};
