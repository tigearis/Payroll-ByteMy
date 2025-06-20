// lib/auth/token-encryption.ts - Client-side token encryption utilities
"use client";

/**
 * Secure token encryption for browser storage
 * Uses Web Crypto API for AES-GCM encryption with ephemeral keys
 */

interface EncryptedToken {
  data: string;          // Base64 encoded encrypted data
  iv: string;           // Base64 encoded initialization vector
  keyFingerprint: string; // Session-based key identifier
}

class TokenEncryption {
  private static instance: TokenEncryption;
  private sessionKey: CryptoKey | null = null;
  private keyFingerprint: string | null = null;

  private constructor() {
    // Initialize encryption key on first use
    this.initializeSessionKey();
  }

  static getInstance(): TokenEncryption {
    if (!TokenEncryption.instance) {
      TokenEncryption.instance = new TokenEncryption();
    }
    return TokenEncryption.instance;
  }

  /**
   * Initialize a session-based encryption key
   * Key is ephemeral and not persisted anywhere
   */
  private async initializeSessionKey(): Promise<void> {
    try {
      // Generate a random encryption key for this session
      this.sessionKey = await crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        false, // Not extractable for security
        ["encrypt", "decrypt"]
      );

      // Create a fingerprint for the key (for validation)
      const keyData = await crypto.subtle.exportKey("raw", this.sessionKey);
      const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);
      this.keyFingerprint = btoa(String.fromCharCode(...new Uint8Array(hashBuffer.slice(0, 8))));
      
      console.log("🔐 Token encryption key initialized");
    } catch (error) {
      console.error("❌ Failed to initialize token encryption:", error);
      // Fallback: we'll store tokens unencrypted but log the security risk
      console.warn("⚠️ SECURITY WARNING: Token encryption failed, storing unencrypted");
    }
  }

  /**
   * Encrypt a token string
   */
  async encryptToken(token: string): Promise<EncryptedToken | null> {
    if (!this.sessionKey || !this.keyFingerprint) {
      console.warn("⚠️ Token encryption not available, returning null");
      return null;
    }

    try {
      // Generate a random IV for each encryption
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Convert token to bytes
      const tokenBytes = new TextEncoder().encode(token);
      
      // Encrypt the token
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.sessionKey,
        tokenBytes
      );

      // Convert to base64 for storage
      const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      const ivString = btoa(String.fromCharCode(...iv));

      return {
        data: encryptedData,
        iv: ivString,
        keyFingerprint: this.keyFingerprint,
      };
    } catch (error) {
      console.error("❌ Token encryption failed:", error);
      return null;
    }
  }

  /**
   * Decrypt a token
   */
  async decryptToken(encryptedToken: EncryptedToken): Promise<string | null> {
    if (!this.sessionKey || !this.keyFingerprint) {
      console.warn("⚠️ Token decryption not available");
      return null;
    }

    // Validate key fingerprint
    if (encryptedToken.keyFingerprint !== this.keyFingerprint) {
      console.warn("⚠️ Token encrypted with different key, cannot decrypt");
      return null;
    }

    try {
      // Convert from base64
      const encryptedBytes = new Uint8Array(
        atob(encryptedToken.data)
          .split("")
          .map(char => char.charCodeAt(0))
      );
      
      const iv = new Uint8Array(
        atob(encryptedToken.iv)
          .split("")
          .map(char => char.charCodeAt(0))
      );

      // Decrypt the token
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        this.sessionKey,
        encryptedBytes
      );

      // Convert back to string
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      console.error("❌ Token decryption failed:", error);
      return null;
    }
  }

  /**
   * Check if encryption is available
   */
  isEncryptionAvailable(): boolean {
    return !!(this.sessionKey && this.keyFingerprint);
  }

  /**
   * Clear encryption key (on logout or security event)
   */
  clearEncryptionKey(): void {
    this.sessionKey = null;
    this.keyFingerprint = null;
    console.log("🧹 Token encryption key cleared");
  }

  /**
   * Get encryption status for debugging
   */
  getEncryptionStatus(): {
    available: boolean;
    keyFingerprint: string | null;
    webCryptoSupported: boolean;
  } {
    return {
      available: this.isEncryptionAvailable(),
      keyFingerprint: this.keyFingerprint,
      webCryptoSupported: !!(typeof crypto !== "undefined" && crypto.subtle),
    };
  }
}

// Export singleton instance
export const tokenEncryption = TokenEncryption.getInstance();

// Helper functions for easy integration
export const encryptToken = (token: string) => tokenEncryption.encryptToken(token);
export const decryptToken = (encryptedToken: EncryptedToken) => tokenEncryption.decryptToken(encryptedToken);
export const isEncryptionAvailable = () => tokenEncryption.isEncryptionAvailable();
export const clearEncryptionKey = () => tokenEncryption.clearEncryptionKey();

// Export types
export type { EncryptedToken };