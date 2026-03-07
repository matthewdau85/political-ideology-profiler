import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from '../lib/auth';
import { fetchProfile, upsertProfile } from '../lib/profile';
import { deleteQuizResults, fetchQuizResults, saveQuizResult } from '../lib/results';
import { fetchEntitlements, hasFeature } from '../lib/entitlements';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [entitlements, setEntitlements] = useState([]);
  const [error, setError] = useState('');

  const refreshUserData = useCallback(async (resolvedUser) => {
    if (!resolvedUser?.id) {
      setProfile(null);
      setResults([]);
      setEntitlements([]);
      return;
    }

    try {
      const [profileRow, resultsRows, entitlementRows] = await Promise.all([
        fetchProfile(resolvedUser.id),
        fetchQuizResults(resolvedUser.id),
        fetchEntitlements(resolvedUser.id),
      ]);

      setProfile(profileRow);
      setResults(resultsRows);
      setEntitlements(entitlementRows);
    } catch (refreshError) {
      if (import.meta.env.DEV) {
        console.error('[auth] Failed to refresh profile/results/entitlements', refreshError);
      }
      setError(refreshError.message || 'Failed to load account data.');
    }
  }, []);

  const hydrate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: sessionData }, { data: userData, error: userError }] = await Promise.all([
        getCurrentSession(),
        getCurrentUser(),
      ]);

      if (userError || !userData?.user) {
        setSession(null);
        setUser(null);
        await refreshUserData(null);
        return;
      }

      setSession(sessionData?.session || null);
      setUser(userData.user);
      await refreshUserData(userData.user);
    } finally {
      setLoading(false);
    }
  }, [refreshUserData]);

  useEffect(() => {
    hydrate();
    const { data } = onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.access_token) {
        setUser(null);
        await refreshUserData(null);
        return;
      }

      const { data: userData } = await getCurrentUser();
      setUser(userData?.user || null);
      await refreshUserData(userData?.user || null);
    });

    return () => {
      data?.subscription?.unsubscribe?.();
    };
  }, [hydrate, refreshUserData]);

  const signUp = useCallback(async (email, password) => {
    setAuthLoading(true);
    setError('');
    try {
      const { data, error: signupError } = await signUpWithEmail(email, password);
      if (signupError) {
        return { error: signupError.message };
      }

      const needsEmailVerification = !data?.session;
      if (!needsEmailVerification) {
        await hydrate();
      }

      return { user: data?.user || null, needsEmailVerification };
    } finally {
      setAuthLoading(false);
    }
  }, [hydrate]);

  const signIn = useCallback(async (email, password) => {
    setAuthLoading(true);
    setError('');
    try {
      const { error: signinError } = await signInWithEmail(email, password);
      if (signinError) {
        return { error: signinError.message };
      }

      await hydrate();
      return { user: true };
    } finally {
      setAuthLoading(false);
    }
  }, [hydrate]);

  const signOut = useCallback(async () => {
    await signOutUser();
    setSession(null);
    setUser(null);
    setProfile(null);
    setResults([]);
    setEntitlements([]);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    if (!user?.id) throw new Error('Authentication required');
    const next = await upsertProfile(user.id, patch);
    setProfile(next);
    return next;
  }, [user?.id]);

  const saveResult = useCallback(async (resultData) => {
    if (!user?.id) {
      return null;
    }

    const saved = await saveQuizResult(user.id, resultData);
    setResults((current) => [saved, ...current]);
    return saved;
  }, [user?.id]);

  const clearResults = useCallback(async () => {
    if (!user?.id) return;
    await deleteQuizResults(user.id);
    setResults([]);
  }, [user?.id]);

  const removeAccount = useCallback(async () => {
    if (!session?.access_token) throw new Error('Authentication required');

    const response = await fetch('/api/me/account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Failed to delete account');
    }

    await signOut();
  }, [session?.access_token, signOut]);

  const featureEnabled = useCallback((feature) => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_UNLOCK_ALL_PREMIUM === 'true') {
      return true;
    }
    return hasFeature(entitlements, feature);
  }, [entitlements]);

  const value = useMemo(() => ({
    loading,
    authLoading,
    session,
    user,
    profile,
    results,
    entitlements,
    error,
    signUp,
    signIn,
    signOut,
    hydrate,
    updateProfile,
    saveResult,
    clearResults,
    removeAccount,
    featureEnabled,
  }), [
    loading,
    authLoading,
    session,
    user,
    profile,
    results,
    entitlements,
    error,
    signUp,
    signIn,
    signOut,
    hydrate,
    updateProfile,
    saveResult,
    clearResults,
    removeAccount,
    featureEnabled,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
