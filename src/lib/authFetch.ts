import { auth } from './firebase';

// Helper to wait for firebase auth to be ready
async function waitForAuth(): Promise<void> {
  if (auth.currentUser) return;
  
  // If there is a local custom auth token, we don't need to wait for firebase auth
  const localToken = typeof localStorage !== 'undefined' ? localStorage.getItem('local_auth_token') : null;
  if (localToken) {
    return;
  }
  
  // If there is no stored authenticated user in localStorage, resolve immediately
  const storedUid = typeof localStorage !== 'undefined' ? localStorage.getItem('quiz_userId') : null;
  if (!storedUid || storedUid.startsWith('user-')) {
    return;
  }

  // Otherwise, wait up to 3 seconds for auth to initialize
  await new Promise<void>((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, 3000);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve();
        }
        unsubscribe();
      }
    });
  });
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = { ...(options.headers || {}) } as Record<string, string>;
  
  // Wait for auth initialization if there is a known user logged in
  await waitForAuth();
  
  async function getAuthHeaders(): Promise<Record<string, string>> {
    const h = { ...headers };
    if (auth.currentUser) {
      try {
        // Force refresh to avoid expired token errors
        const token = await auth.currentUser.getIdToken(true);
        if (token) {
          h['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Could not retrieve firebase id token for fetch:', e);
      }
    } else {
      // Fallback for email/password custom local authentication session
      const localToken = typeof localStorage !== 'undefined' ? localStorage.getItem('local_auth_token') : null;
      if (localToken) {
        h['Authorization'] = `Bearer ${localToken}`;
      } else {
        // Fallback for anonymous guest users in offline/local modes to prevent 401 lockout in Cosmo chat
        const localUserId = typeof localStorage !== 'undefined' ? localStorage.getItem('quiz_userId') : null;
        if (localUserId) {
          h['Authorization'] = `Bearer ${localUserId}`;
        }
      }
    }
    return h;
  }

  const authHeaders = await getAuthHeaders();
  const response = await fetch(url, { ...options, headers: authHeaders });
  
  // If we get 401 and have a Firebase user, force refresh token and retry once
  if (response.status === 401 && auth.currentUser) {
    try {
      const freshToken = await auth.currentUser.getIdToken(true);
      if (freshToken) {
        const retryHeaders = { ...headers, 'Authorization': `Bearer ${freshToken}` };
        return fetch(url, { ...options, headers: retryHeaders });
      }
    } catch (e) {
      console.warn('Token refresh retry failed:', e);
    }
  }
  
  return response;
}
