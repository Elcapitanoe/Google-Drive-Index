import { driveConfig, API_ENDPOINTS } from '@/config/drive';
import type { TokenResponse } from '@/types';

/**
 * Authentication service for Google Drive API
 */
export class AuthService {
  private static instance: AuthService;
  private cachedToken: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Gets a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiry) {
      return this.cachedToken;
    }

    try {
      const response = await fetch(API_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: driveConfig.clientId,
          client_secret: driveConfig.clientSecret,
          refresh_token: driveConfig.refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const result: TokenResponse = await response.json();

      this.cachedToken = result.access_token;
      this.tokenExpiry = Date.now() + (result.expires_in - 60) * 1000; // Refresh 1 minute early

      return result.access_token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Clears the cached token
   */
  clearToken(): void {
    this.cachedToken = null;
    this.tokenExpiry = 0;
  }
}
