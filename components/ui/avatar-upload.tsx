"use client";

import { Camera, Upload, X, AlertCircle, Check } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ByteMySpinner } from "@/components/ui/bytemy-loading-icon";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  currentImageUrl?: string;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isEditing?: boolean;
  targetUserId?: string; // For admin uploads - if not provided, uploads for current user
  onImageUpdate?: (newImageUrl: string | null) => void;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16", 
  lg: "h-24 w-24",
  xl: "h-32 w-32",
};

const buttonSizes = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-8 w-8", 
  xl: "h-10 w-10",
};

export function AvatarUpload({ 
  currentImageUrl, 
  userName = "User", 
  size = "lg", 
  isEditing = false,
  targetUserId,
  onImageUpdate 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file client-side
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please select a JPEG, PNG, WebP, or GIF image.",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setIsDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);
      
      // If targetUserId is provided, this is an admin upload
      if (targetUserId) {
        formData.append('targetUserId', targetUserId);
      }

      const response = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Avatar updated successfully");
        onImageUpdate?.(result.imageUrl);
        setIsDialogOpen(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        
        // Force refresh of the page to update Clerk user data
        window.location.reload();
      } else {
        toast.error("Upload failed", {
          description: result.error || "Failed to upload avatar",
        });
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Upload failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    
    try {
      const url = targetUserId 
        ? `/api/users/avatar?targetUserId=${encodeURIComponent(targetUserId)}`
        : '/api/users/avatar';
        
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Avatar removed successfully");
        onImageUpdate?.(null);
        
        // Force refresh to update Clerk user data
        window.location.reload();
      } else {
        toast.error("Removal failed", {
          description: result.error || "Failed to remove avatar",
        });
      }
    } catch (error) {
      console.error("Avatar removal error:", error);
      toast.error("Removal failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentImageUrl} alt={userName} />
          <AvatarFallback className="text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <Button
            size="sm"
            variant="secondary"
            className={`absolute -bottom-2 -right-2 ${buttonSizes[size]} rounded-full p-0`}
            onClick={openFileDialog}
            disabled={isUploading}
          >
            {isUploading ? (
              <ByteMySpinner size="sm" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* Upload confirmation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Update Profile Picture
            </DialogTitle>
            <DialogDescription>
              This will update your avatar across the entire platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview section */}
            <div className="flex items-center justify-center space-x-6">
              {/* Current avatar */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-2">
                  <AvatarImage src={currentImageUrl} alt="Current" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-500">Current</p>
              </div>

              {/* Arrow */}
              <div className="text-gray-400">→</div>

              {/* New avatar preview */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-2">
                  <AvatarImage src={previewUrl || undefined} alt="New" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-500">New</p>
              </div>
            </div>

            {/* File info */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                  <div>Type: {selectedFile.type}</div>
                </div>
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 space-y-1">
                  <p className="font-medium">Image Guidelines:</p>
                  <ul className="space-y-0.5 text-blue-600">
                    <li>• Square images work best</li>
                    <li>• Maximum size: 5MB</li>
                    <li>• Formats: JPEG, PNG, WebP, GIF</li>
                    <li>• Recommended: 512x512 pixels or higher</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={closeDialog}
                disabled={isUploading}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {currentImageUrl && (
                <Button
                  variant="destructive"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? <ByteMySpinner size="sm" /> : <X className="w-4 h-4 mr-2" />}
                  Remove
                </Button>
              )}
              
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="flex-1"
              >
                {isUploading ? <ByteMySpinner size="sm" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}