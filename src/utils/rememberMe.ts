/**
 * Remember Me Utility Functions
 * Handles storing and retrieving remember me data
 */

const REMEMBER_ME_KEY = "rememberMe";
const REMEMBER_ME_EMAIL_KEY = "rememberMeEmail";
const REMEMBER_ME_EXPIRY_DAYS = 30;

interface RememberMeData {
  token: string;
  userData: string; // JSON stringified user data
  expiryDate: string; // ISO date string
}

/**
 * Store remember me data with 30-day expiry
 */
export const setRememberMe = (token: string, userData: string): void => {
  if (typeof window === "undefined") return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + REMEMBER_ME_EXPIRY_DAYS);

  const rememberMeData: RememberMeData = {
    token,
    userData,
    expiryDate: expiryDate.toISOString(),
  };

  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(rememberMeData));
};

/**
 * Get remember me data if valid (not expired)
 */
export const getRememberMe = (): RememberMeData | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    if (!stored) return null;

    const rememberMeData: RememberMeData = JSON.parse(stored);
    const expiryDate = new Date(rememberMeData.expiryDate);
    const now = new Date();

    // Check if expired
    if (now > expiryDate) {
      clearRememberMe();
      return null;
    }

    return rememberMeData;
  } catch (error) {
    console.error("Error parsing remember me data:", error);
    clearRememberMe();
    return null;
  }
};

/**
 * Clear remember me data
 */
export const clearRememberMe = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
};

/**
 * Store email for pre-filling login form
 */
export const setRememberMeEmail = (email: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_ME_EMAIL_KEY, email);
};

/**
 * Get stored email for pre-filling
 */
export const getRememberMeEmail = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REMEMBER_ME_EMAIL_KEY);
};

/**
 * Check if remember me token exists and is valid
 */
export const hasValidRememberMe = (): boolean => {
  return getRememberMe() !== null;
};

