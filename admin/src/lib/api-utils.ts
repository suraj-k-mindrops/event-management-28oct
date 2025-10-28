import { API_CONFIG } from './api-config';

// API utility functions
export class ApiUtils {
  /**
   * Get the appropriate API URL based on configuration
   */
  static getApiUrl(endpoint: string, useNextApi: boolean = false): string {
    const baseUrl = useNextApi ? API_CONFIG.NEXT_API_URL : API_CONFIG.BACKEND_URL;
    return `${baseUrl}${endpoint}`;
  }

  /**
   * Create headers for API requests
   */
  static createHeaders(token?: string | null): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Make API request with retry logic
   */
  static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retryAttempts: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        if (attempt === retryAttempts) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      }
    }

    throw lastError!;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isValidPassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    return { isValid: true };
  }

  /**
   * Format API error message
   */
  static formatErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Check if error is network related
   */
  static isNetworkError(error: any): boolean {
    return error?.name === 'TypeError' && error?.message?.includes('fetch');
  }

  /**
   * Check if error is authentication related
   */
  static isAuthError(error: any): boolean {
    return error?.status === 401 || error?.status === 403;
  }

  /**
   * Get token from localStorage
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }

  /**
   * Set token in localStorage
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  }

  /**
   * Remove token from localStorage
   */
  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Set refresh token in localStorage
   */
  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Remove refresh token from localStorage
   */
  static removeRefreshToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY);
  }
}
