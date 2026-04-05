"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      adminApi.getMe(token)
        .then((res) => {
          setState({ user: res.data as User, token, loading: false });
        })
        .catch(() => {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_refresh_token");
          setState({ user: null, token: null, loading: false });
        });
    } else {
      setState({ user: null, token: null, loading: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.login(email, password);
    const data = res.data as { accessToken: string; refreshToken: string; user: User };
    localStorage.setItem("admin_token", data.accessToken);
    localStorage.setItem("admin_refresh_token", data.refreshToken);
    setState({ user: data.user, token: data.accessToken, loading: false });
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    setState({ user: null, token: null, loading: false });
  }, []);

  return { ...state, login, logout };
}
