/**
 * @fileoverview User navigation component with avatar, profile menu, and sign-out functionality
 * Displays the authenticated user's information and provides quick access to profile settings
 */

"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, startTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutState } from "@/lib/auth/logout-state";

/**
 * UserNav Component
 *
 * A navigation component that displays the current user's avatar and name,
 * with a dropdown menu for accessing profile settings and signing out.
 *
 * Features:
 * - Shows user avatar with fallback to initials
 * - Displays full name and email
 * - Provides quick navigation to profile and settings
 * - Handles secure sign-out with Clerk's recommended approach
 *
 * @component
 * @example
 * ```tsx
 * // Used in the main layout header
 * <UserNav />
 * ```
 */
export function UserNav() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isLoggingOut, setLoggingOut } = useLogoutState();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /**
   * Determines the best avatar image to display for the user
   * Priority: Custom uploaded image > External account image > fallback
   *
   * @returns The avatar image URL or empty string for fallback
   */
  const getAvatarImage = () => {
    if (!user) {
      return "";
    }

    // If user has uploaded a custom image, use that
    if (user.hasImage && user.imageUrl) {
      return user.imageUrl;
    }

    // If user has external accounts (like Google) with avatar, use that
    if (user.externalAccounts && user.externalAccounts.length > 0) {
      const externalAccount = user.externalAccounts[0];
      if (externalAccount.imageUrl) {
        return externalAccount.imageUrl;
      }
    }

    // Fallback to empty string for default avatar
    return "";
  };

  /**
   * Generates user initials for avatar fallback
   * Takes first letter of first name and first letter of last name
   *
   * @returns User initials (1-2 characters) or "U" as final fallback
   */
  const getUserInitials = () => {
    if (!isLoaded || !user?.fullName) {
      return "U";
    }

    // Split the name and get initials (up to 2 characters)
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  /**
   * Handles user sign-out process with React 18 transitions for stability
   * Uses startTransition to prevent hooks errors during redirect
   */
  const handleSignOut = async () => {
    // Prevent multiple logout attempts
    if (isSigningOut || isLoggingOut) {
      console.log('⚠️ Sign-out already in progress, ignoring duplicate request');
      return;
    }

    console.log('🔐 Starting sign-out process...');

    try {
      // Set signing out state to prevent component changes
      setIsSigningOut(true);
      setLoggingOut(true);

      // Use React 18 startTransition for non-blocking state updates
      startTransition(() => {
        // Batch any pending state updates before redirect
        console.log('🔄 Batching state updates before sign-out...');
      });

      // Small delay to allow React to finish any pending updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clear any ongoing operations that might cause hook issues
      if (typeof window !== 'undefined') {
        // Cancel any pending timeouts or intervals
        for (let i = 1; i < 99999; i++) window.clearTimeout(i);
        
        // Clear Apollo cache to prevent hooks during unmount
        if ((window as any).__APOLLO_CLIENT__) {
          try {
            await (window as any)._APOLLO_CLIENT__.clearStore();
            console.log('✅ Apollo cache cleared before sign-out');
          } catch (apolloError) {
            console.warn('⚠️ Apollo cache clear failed:', apolloError);
          }
        }
      }

      // Try primary strategy: Clerk sign-out with redirect
      console.log('🔐 Initiating Clerk sign-out...');
      
      // Alternative strategy: If hooks errors persist, use manual redirect
      const useAlternativeStrategy = sessionStorage.getItem('use-alternative-logout') === 'true';
      
      if (useAlternativeStrategy) {
        console.log('🔄 Using alternative logout strategy...');
        // Sign out without redirect, then manually navigate
        await signOut();
        console.log('✅ Clerk sign-out completed, manually redirecting...');
        
        // Clear states before redirect
        setIsSigningOut(false);
        setLoggingOut(false);
        
        // Use replace to avoid back button issues
        window.location.replace('/');
      } else {
        // Primary strategy: Let Clerk handle the redirect
        console.log('🔐 Using primary strategy with Clerk redirect...');
        
        // Set a timeout to clear loading state if redirect takes too long
        const timeoutId = setTimeout(() => {
          console.warn('⚠️ Logout taking longer than expected, clearing loading state...');
          setIsSigningOut(false);
          setLoggingOut(false);
          // Force redirect if Clerk redirect failed
          window.location.replace('/');
        }, 3000); // 3 second timeout
        
        try {
          await signOut({ redirectUrl: "/" });
          clearTimeout(timeoutId);
        } catch (signOutError) {
          clearTimeout(timeoutId);
          throw signOutError;
        }
      }
      
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      
      // If primary strategy fails, enable alternative for next time
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('use-alternative-logout', 'true');
        console.log('🔄 Alternative logout strategy enabled for future attempts');
      }
      
      // Reset states on error
      setIsSigningOut(false);
      setLoggingOut(false);
      
      // Immediate fallback to manual navigation
      console.log('🔄 Falling back to manual navigation...');
      window.location.replace('/');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 flex items-center gap-2 rounded-full"
        >
          <span className="hidden md:inline-block text-sm font-medium">
            {isLoaded && user?.fullName ? user.fullName : ""}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={getAvatarImage()}
              alt={user?.fullName || "User avatar"}
            />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoaded && user?.fullName ? user.fullName : "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {isLoaded && user?.primaryEmailAddress
                ? user.primaryEmailAddress.emailAddress
                : "email@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/settings/account")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={isSigningOut || isLoggingOut ? () => {
            // Emergency reset if stuck in loading state
            console.log('🔄 Emergency logout state reset');
            setIsSigningOut(false);
            setLoggingOut(false);
            sessionStorage.removeItem('logout-in-progress');
            sessionStorage.setItem('use-alternative-logout', 'true');
            window.location.replace('/');
          } : handleSignOut}
        >
          {isSigningOut || isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
              <span>Signing out... <small>(click to force)</small></span>
            </div>
          ) : (
            "Log out"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
