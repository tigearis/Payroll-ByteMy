// app/(dashboard)/settings/account/page.tsx
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Mail,
  Building2,
  Camera,
  Save,
  RefreshCw,
  Lock,
  Eye,
  Monitor,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserRole } from "@/hooks/use-user-role";

// Import extracted GraphQL operations
const GET_USER_PROFILE = gql`
  query GetUserProfileSettings($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      email
      avatar_url
      role
      is_staff
      is_active
      created_at
      updated_at
      clerk_user_id
      manager {
        id
        name
        email
      }
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfileSettings(
    $id: uuid!
    $name: String
    $image: String
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, avatar_url: $image, updated_at: "now()" }
    ) {
      id
      name
      avatar_url
      updated_at
    }
  }
`;

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  image: string;
  bio: string;
  phone: string;
  location: string;
  company: string;
  website: string;
}

export default function AccountSettings() {
  const { user: clerkUser, isLoaded } = useUser();
  const { currentUserId } = useCurrentUser();
  const { userRole } = useUserRole();

  // Form state
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    username: "",
    image: "",
    bio: "",
    phone: "",
    location: "",
    company: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // GraphQL operations
  const {
    data: userData,
    loading: userLoading,
    refetch,
  } = useQuery(GET_USER_PROFILE, {
    variables: { id: currentUserId },
    skip: !currentUserId,
    fetchPolicy: "cache-and-network",
  });

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  // Helper function to get the correct avatar image
  const getAvatarImage = useCallback(() => {
    if (!clerkUser) {
      return "";
    }

    // If user has uploaded a custom image, use that
    if (clerkUser.hasImage && clerkUser.imageUrl) {
      return clerkUser.imageUrl;
    }

    // If user has external accounts (like Google) with avatar, use that
    if (clerkUser.externalAccounts && clerkUser.externalAccounts.length > 0) {
      const externalAccount = clerkUser.externalAccounts[0];
      if (externalAccount.imageUrl) {
        return externalAccount.imageUrl;
      }
    }

    // Fallback to empty string for default avatar
    return "";
  }, [clerkUser]);

  // Load user data when component mounts
  useEffect(() => {
    if (isLoaded && clerkUser && userData?.users_by_pk) {
      const dbUser = userData.users_by_pk;
      setProfileForm({
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: "", // username not available in current schema
        image: getAvatarImage(),
        bio: (clerkUser.unsafeMetadata?.bio as string) || "",
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
        location: (clerkUser.unsafeMetadata?.location as string) || "",
        company: (clerkUser.unsafeMetadata?.company as string) || "",
        website: (clerkUser.unsafeMetadata?.website as string) || "",
      });
    }
  }, [isLoaded, clerkUser, userData, getAvatarImage]);

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageUploading(true);
    try {
      // Upload to Clerk
      await clerkUser?.setProfileImage({ file });

      // Update local state with new image URL
      const updatedUser = await clerkUser?.reload();
      if (updatedUser?.imageUrl) {
        setProfileForm(prev => ({
          ...prev,
          image: updatedUser.imageUrl,
        }));

        // Also update in our database
        if (currentUserId) {
          await updateUserProfile({
            variables: {
              id: currentUserId,
              name: `${profileForm.firstName} ${profileForm.lastName}`,
              image: updatedUser.imageUrl,
            },
          });
        }
      }

      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const syncUserWithDatabase = async (profileData: ProfileForm) => {
    try {
      const fullName =
        `${profileData.firstName} ${profileData.lastName}`.trim();

      const { data } = await updateUserProfile({
        variables: {
          id: currentUserId,
          name: fullName,
          image: profileData.image,
        },
      });

      return data;
    } catch (error) {
      console.error("Error syncing with database:", error);
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      // Use our new API endpoint that handles Clerk Backend API calls
      const response = await fetch("/api/users/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          username: profileForm.username,
          unsafeMetadata: {
            bio: profileForm.bio,
            location: profileForm.location,
            company: profileForm.company,
            website: profileForm.website,
            phone: profileForm.phone,
          },
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        const textResponse = await response.text();
        console.error("Raw response:", textResponse);
        throw new Error(
          `Server returned invalid response: ${textResponse.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Also sync with database
      await syncUserWithDatabase(profileForm);

      toast.success(result.message || "Profile updated successfully");
      refetch(); // Refresh the user data

      // Reload the Clerk user to get the latest data
      await clerkUser?.reload();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setPasswordLoading(true);
      // For now, we'll show a message directing users to use email reset
      // In a production app, you'd integrate with Clerk's password reset flow
      toast.info(
        "Please use the 'Forgot Password' link on the login page to reset your password"
      );
    } catch (error) {
      console.error("Error with password reset:", error);
      toast.error("Failed to initiate password reset");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isLoaded || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  const dbUser = userData?.users_by_pk;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={getAvatarImage()} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profileForm.firstName[0]}
                    {profileForm.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={imageUploading} asChild>
                      <span>
                        {imageUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Change Picture
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={e =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={e =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileForm.username}
                  onChange={e => handleInputChange("username", e.target.value)}
                  placeholder="Enter a unique username (optional)"
                />
                <p className="text-xs text-muted-foreground">
                  Username is optional and can be left empty
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={e => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={clerkUser?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here. Use the security tab to manage
                  email addresses.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileForm.location}
                  onChange={e => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Professional Information
              </CardTitle>
              <CardDescription>Your work-related details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileForm.company}
                  onChange={e => handleInputChange("company", e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileForm.website}
                  onChange={e => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {dbUser?.role === "developer"
                      ? "Developer"
                      : dbUser?.role === "org_admin"
                        ? "Admin"
                        : dbUser?.role === "manager"
                          ? "Manager"
                          : dbUser?.role === "consultant"
                            ? "Consultant"
                            : "Viewer"}
                  </Badge>
                  <Badge variant={dbUser?.is_staff ? "default" : "secondary"}>
                    {dbUser?.is_staff ? "Staff Member" : "External User"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Role changes must be made by an administrator.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Account ID</Label>
                  <p className="text-sm text-muted-foreground">{dbUser?.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Clerk ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.clerk_user_id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.created_at
                      ? new Date(dbUser.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {dbUser?.updated_at
                      ? new Date(dbUser.updated_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password
              </CardTitle>
              <CardDescription>
                Change your account password for better security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Current Password</h4>
                    <p className="text-sm text-gray-600">••••••••••</p>
                  </div>
                  <Button
                    onClick={handlePasswordReset}
                    disabled={passwordLoading}
                    variant="outline"
                  >
                    {passwordLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                A password reset link will be sent to your email address. You
                can then create a new password securely.
              </p>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage devices that are signed into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Current Session</span>
                        <Badge variant="secondary" className="text-xs">
                          This device
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Last active:{" "}
                        {clerkUser?.lastSignInAt
                          ? new Date(
                              clerkUser.lastSignInAt
                            ).toLocaleDateString()
                          : "Now"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {clerkUser?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  <p>
                    For security reasons, only your current session is
                    displayed. If you suspect unauthorized access, please change
                    your password immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Emails</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="aest">
                      Australian Eastern Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
