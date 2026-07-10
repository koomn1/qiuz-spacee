import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SupabaseUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  customId?: string;
  isPremium?: boolean;
  planName?: string;
}

export interface SupabaseSession {
  access_token: string;
  user: SupabaseUser;
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'MFA_CHALLENGE';

export type AuthListenerCallback = (event: AuthChangeEvent, session: SupabaseSession | null) => void;

interface AuthContextType {
  user: SupabaseUser | null;
  isAuthenticated: boolean;
  isMfaChallenged: boolean;
  loading: boolean;
  mfaUid: string | null;
  signIn: (email: string, password: string) => Promise<{ status: 'SUCCESS' | 'AWAITING_VERIFICATION'; session?: SupabaseSession }>;
  verifyOtp: (code: string) => Promise<SupabaseSession>;
  logout: () => void;
  supabase: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory subscribers for onAuthStateChange
const subscribers = new Set<AuthListenerCallback>();

// In-memory temp storage for pending MFA sessions
let pendingSessionData: { token: string; user: any } | null = null;
let pendingMfaUid: string | null = null;

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const cleanEmail = email.trim().toLowerCase();
      
      // Step 1: Check if user exists and has 2FA enabled in Postgres backend
      const checkRes = await fetch('/api/auth/2fa/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (!checkRes.ok) {
        throw new Error('فشل التحقق من حالة الحساب.');
      }

      const checkData = await checkRes.json();
      
      // Step 2: Perform authentication first to verify credentials
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        throw new Error(errData.error || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
      }

      const loginData = await loginRes.json();

      if (checkData.enabled) {
        // Scenario B: 2FA is enabled. Return awaiting verification and cache the pending session
        pendingSessionData = { token: loginData.token, user: loginData.user };
        pendingMfaUid = loginData.user.uid;
        
        // Notify subscribers of the challenge
        subscribers.forEach((cb) => cb('MFA_CHALLENGE', null));
        
        return {
          data: { user: loginData.user, session: null },
          error: null,
          status: 'AWAITING_VERIFICATION'
        };
      }

      // Scenario A: 2FA is disabled. Complete login immediately
      const session: SupabaseSession = {
        access_token: loginData.token,
        user: loginData.user
      };

      // Store in localStorage
      localStorage.setItem('local_auth_token', loginData.token);
      localStorage.setItem('quiz_userId', loginData.user.uid);
      localStorage.setItem('quiz_userName', loginData.user.name);
      localStorage.setItem('quiz_userEmail', loginData.user.email);
      if (loginData.user.photoURL) {
        localStorage.setItem('quiz_userPhoto', loginData.user.photoURL);
      }

      // Trigger subscribers
      subscribers.forEach((cb) => cb('SIGNED_IN', session));

      return {
        data: { user: loginData.user, session },
        error: null,
        status: 'SUCCESS'
      };
    },

    mfa: {
      challengeAndVerify: async ({ code }: { code: string }) => {
        if (!pendingMfaUid || !pendingSessionData) {
          throw new Error('لا توجد جلسة مصادقة ثنائية نشطة.');
        }

        const res = await fetch('/api/auth/2fa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: pendingMfaUid, code })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'كود التحقق المدخل غير صحيح.');
        }

        // 2FA verification passed. Finalize session.
        const session: SupabaseSession = {
          access_token: pendingSessionData.token,
          user: pendingSessionData.user
        };

        // Persist to storage
        localStorage.setItem('local_auth_token', pendingSessionData.token);
        localStorage.setItem('quiz_userId', pendingSessionData.user.uid);
        localStorage.setItem('quiz_userName', pendingSessionData.user.name);
        localStorage.setItem('quiz_userEmail', pendingSessionData.user.email);
        if (pendingSessionData.user.photoURL) {
          localStorage.setItem('quiz_userPhoto', pendingSessionData.user.photoURL);
        }

        // Clean up pendings
        pendingSessionData = null;
        pendingMfaUid = null;

        // Trigger subscribers
        subscribers.forEach((cb) => cb('SIGNED_IN', session));

        return {
          data: session,
          error: null
        };
      }
    },

    setSession: async (session: SupabaseSession) => {
      localStorage.setItem('local_auth_token', session.access_token);
      localStorage.setItem('quiz_userId', session.user.uid);
      localStorage.setItem('quiz_userName', session.user.name);
      localStorage.setItem('quiz_userEmail', session.user.email);
      if (session.user.photoURL) {
        localStorage.setItem('quiz_userPhoto', session.user.photoURL);
      }
      subscribers.forEach((cb) => cb('SIGNED_IN', session));
      return { data: session, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('local_auth_token');
      localStorage.removeItem('quiz_userId');
      localStorage.removeItem('quiz_userName');
      localStorage.removeItem('quiz_userEmail');
      localStorage.removeItem('quiz_userPhoto');
      pendingSessionData = null;
      pendingMfaUid = null;
      subscribers.forEach((cb) => cb('SIGNED_OUT', null));
    },

    onAuthStateChange: (callback: AuthListenerCallback) => {
      subscribers.add(callback);
      
      // Emit current status instantly
      const token = localStorage.getItem('local_auth_token');
      const uid = localStorage.getItem('quiz_userId');
      if (token && uid && !uid.startsWith('user-')) {
        const user: SupabaseUser = {
          id: uid,
          uid,
          name: localStorage.getItem('quiz_userName') || 'طالب متميز',
          email: localStorage.getItem('quiz_userEmail') || '',
          photoURL: localStorage.getItem('quiz_userPhoto') || undefined
        };
        callback('SIGNED_IN', { access_token: token, user });
      } else {
        callback('SIGNED_OUT', null);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              subscribers.delete(callback);
            }
          }
        }
      };
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMfaChallenged, setIsMfaChallenged] = useState<boolean>(false);
  const [mfaUid, setMfaUid] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setIsAuthenticated(true);
        setIsMfaChallenged(false);
        setMfaUid(null);
      } else if (event === 'MFA_CHALLENGE') {
        setIsMfaChallenged(true);
        setMfaUid(pendingMfaUid);
        // Do NOT reset isAuthenticated or user to avoid route guard ejection
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsMfaChallenged(false);
        setMfaUid(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ status: 'SUCCESS' | 'AWAITING_VERIFICATION'; session?: SupabaseSession }> => {
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.status === 'AWAITING_VERIFICATION') {
        setIsMfaChallenged(true);
        setMfaUid(pendingMfaUid);
        return { status: 'AWAITING_VERIFICATION' };
      }
      return { status: 'SUCCESS', session: res.data.session as SupabaseSession };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    try {
      const res = await supabase.auth.mfa.challengeAndVerify({ code });
      return res.data as SupabaseSession;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isMfaChallenged,
      loading,
      mfaUid,
      signIn,
      verifyOtp,
      logout,
      supabase
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
