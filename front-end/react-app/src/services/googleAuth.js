/**
 * Google Identity Services (GIS) Client Integration Module
 * Manages loading the GIS SDK script and launching the Google OAuth2 popup.
 */

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Loads the Google Identity Services SDK script if not already present.
 */
export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const existingScript = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Initiates the real Google OAuth2 popup flow using Google Identity Services.
 * Returns { accessToken } on success, or { error, message } on failure / cancellation.
 */
export async function initiateGoogleSignIn(clientId) {
  if (!clientId || clientId.includes('your-google-client-id')) {
    return {
      error: 'MISSING_CLIENT_ID',
      message: 'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in front-end/react-app/.env.',
    };
  }

  try {
    await loadGoogleScript();
  } catch {
    return {
      error: 'SDK_LOAD_FAILED',
      message: 'Could not reach Google servers. Please check your internet connection.',
    };
  }

  if (!window.google?.accounts?.oauth2) {
    return {
      error: 'SDK_UNAVAILABLE',
      message: 'Google Identity Services is currently unavailable. Please refresh the page.',
    };
  }

  return new Promise((resolve) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: (response) => {
          if (response.error) {
            if (response.error === 'access_denied') {
              resolve({
                error: 'ACCESS_DENIED',
                message: 'Google sign-in was cancelled by the user.',
              });
            } else {
              resolve({
                error: response.error,
                message: response.error_description || `Google sign-in failed (${response.error}).`,
              });
            }
          } else if (response.access_token) {
            resolve({
              accessToken: response.access_token,
            });
          } else {
            resolve({
              error: 'EMPTY_TOKEN',
              message: 'Google did not return an access token.',
            });
          }
        },
        error_callback: (error) => {
          resolve({
            error: error?.type || 'POPUP_FAILED',
            message: 'Google Sign-In popup was closed or blocked by browser popup settings.',
          });
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (initErr) {
      resolve({
        error: 'CLIENT_INIT_FAILED',
        message: initErr.message || 'Failed to initialize Google Sign-In client.',
      });
    }
  });
}
