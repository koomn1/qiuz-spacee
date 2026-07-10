import React, { useEffect, useState } from 'react';

interface AdminGuardProps {
  userId: string | null;
  userEmail: string | null;
  lang: 'ar' | 'en';
  children: React.ReactNode;
}

export default function AdminGuard({ userId, userEmail, lang, children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId || !userEmail) {
      setIsAuthorized(false);
      return;
    }

    const checkAdminPrivileges = async () => {
      try {
        // Strict Role Check: The explicitly allowed admin user email is 'adman777888999@gmail.com'
        // We simulate a secure profile/role query from Supabase-like model
        const isAdminEmail = userEmail === 'adman777888999@gmail.com';
        
        // Supabase-like profile role resolution logic:
        const mockProfile = {
          uid: userId,
          email: userEmail,
          role: isAdminEmail ? 'admin' : 'student'
        };

        if (mockProfile.role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error('Admin authorization verification failed:', err);
        setIsAuthorized(false);
      }
    };

    checkAdminPrivileges();
  }, [userId, userEmail]);

  useEffect(() => {
    if (isAuthorized === false) {
      window.location.hash = '#/dashboard/landing';
    }
  }, [isAuthorized]);

  if (isAuthorized === null || !isAuthorized) {
    // Subtle loading state or blocked state, do not reveal anything
    return null;
  }

  return <>{children}</>;
}
