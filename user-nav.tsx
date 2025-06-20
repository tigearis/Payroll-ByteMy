// components/user-nav.tsx
"use client";

import { useUser, useClerk } from "@clerk/nextjs";
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
import { useRouter } from "next/navigation";

export function UserNav() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Helper function to get the correct avatar image (same logic as settings page)
  const getAvatarImage = () => {
    if (!user) return "";

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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!isLoaded || !user?.fullName) return "U";

    // Split the name and get initials (up to 2 characters)
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

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
