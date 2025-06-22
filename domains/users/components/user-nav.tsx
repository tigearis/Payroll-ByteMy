/**
 * @fileoverview User navigation component with avatar, profile menu, and sign-out functionality
 * Displays the authenticated user's information and provides quick access to profile settings
 */

"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
 * - Handles secure sign-out with redirect
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

  /**
   * Determines the best avatar image to display for the user
   * Priority: Custom uploaded image > External account image > fallback
   * 
   * @returns The avatar image URL or empty string for fallback
   */
  const getAvatarImage = () => {
    if (!user) {return "";}

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
    if (!isLoaded || !user?.fullName) {return "U";}

    // Split the name and get initials (up to 2 characters)
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) {return nameParts[0].charAt(0).toUpperCase();}
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  /**
   * Handles user sign-out process
   * Signs out from Clerk and redirects to home page
   */
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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
        <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
