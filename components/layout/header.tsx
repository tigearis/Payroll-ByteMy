"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, User } from "lucide-react";
import Image from "next/image";
import CommandPalette from "@/components/command-palette/command-palette";
import { GlobalSearch } from "@/components/search/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

/**
 * Global App Header
 *
 * Features:
 * - Company logo/brand
 * - Global search functionality
 * - Notification center with badges
 * - User menu with profile access
 * - Theme toggle
 */
export function Header() {
  const { user } = useUser();
  const { currentUser } = useCurrentUser();
  const { sidebarCollapsed } = useLayoutPreferences();

  // Mock notification count - replace with real data
  const notificationCount = 3;

  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    // Try database user first, then fall back to Clerk user
    const dbUser = currentUser;
    const clerkUser = user;
    
    if (dbUser?.firstName && dbUser?.lastName) {
      return `${dbUser.firstName[0]}${dbUser.lastName[0]}`.toUpperCase();
    }
    if (clerkUser?.firstName && clerkUser?.lastName) {
      return `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase();
    }
    if (clerkUser?.firstName) {
      return clerkUser.firstName[0].toUpperCase();
    }
    if (clerkUser?.fullName) {
      const names = clerkUser.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return null;
  };

  const userInitials = getUserInitials();
  
  // Get the best available image URL - prioritize database image, fallback to Clerk
  const getAvatarImageUrl = () => {
    return currentUser?.image || user?.imageUrl;
  };
  
  // Get the best available display name - prioritize database user
  const getDisplayName = () => {
    return currentUser?.computedName || 
           currentUser?.firstName || 
           user?.fullName || 
           user?.firstName || 
           "User";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <CommandPalette />
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Logo/Brand */}
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src="/bytemy-logo-icon.png"
                alt="ByteMy Payroll"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="font-semibold text-lg text-foreground">
              ByteMy Payroll
            </span>
          </div>
        </div>

        {/* Center Section: Global Search */}
        <div className="flex-1 max-w-md mx-8">
          <GlobalSearch />
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={getAvatarImageUrl()}
                    alt={getDisplayName()}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {userInitials || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">
                  {currentUser?.firstName || user?.firstName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
