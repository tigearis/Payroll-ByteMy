"use client";

import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Loader2,
  Plus 
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  payrollId?: string;
  onUploadComplete?: (documents: any[]) => void;
  onUploadError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  selectedFiles: File[];
  uploadResults: Array<{
    file: File;
    success: boolean;
    document?: any;
    error?: string;
  }>;
}

const DOCUMENT_CATEGORIES = [
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'report', label: 'Report' },
  { value: 'timesheet', label: 'Timesheet' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'other', label: 'Other' },
] as const;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'text/csv',
];

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) {
    return <Image className="w-4 h-4 text-blue-500" />;
  } else if (file.type === 'application/pdf') {
    return <FileText className="w-4 h-4 text-red-500" />;
  } else if (file.type.includes('word') || file.type.includes('document')) {
    return <FileText className="w-4 h-4 text-blue-600" />;
  } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
    return <FileText className="w-4 h-4 text-green-600" />;
  }
  return <File className="w-4 h-4 text-gray-500" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function DocumentUploadModal({ 
  isOpen,
  onClose,
  clientId, 
  payrollId, 
  onUploadComplete, 
  onUploadError,
}: DocumentUploadModalProps) {
  const { can } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    selectedFiles: [],
    uploadResults: [],
  });
  
  const [uploadMetadata, setUploadMetadata] = useState({
    category: 'other' as const,
    isPublic: false,
    description: '',
  });

  // Check permissions
  const canUpload = can('files', 'create');

  // Reset form when modal opens
  const resetForm = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      selectedFiles: [],
      uploadResults: [],
    });
    setUploadMetadata({
      category: 'other',
      isPublic: false,
      description: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Reset form when modal opens
  useState(() => {
    if (isOpen) {
      resetForm();
    }
  });

  // Validate file
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File "${file.name}" has an unsupported format. Please use PDF, Word, Excel, images, or text files.`;
    }
    
    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setUploadState(prev => ({
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...validFiles],
        uploadResults: [],
      }));
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setUploadState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((_, i) => i !== index),
    }));
  };

  // Upload files
  const uploadFiles = async () => {
    if (uploadState.selectedFiles.length === 0) return;

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      uploadResults: [],
    }));

    const results: Array<{
      file: File;
      success: boolean;
      document?: any;
      error?: string;
    }> = [];

    for (let i = 0; i < uploadState.selectedFiles.length; i++) {
      const file = uploadState.selectedFiles[i];
      
      try {
        const formData = new FormData();
        formData.append('document', file);
        
        if (clientId) formData.append('clientId', clientId);
        if (payrollId) formData.append('payrollId', payrollId);
        formData.append('category', uploadMetadata.category);
        formData.append('isPublic', uploadMetadata.isPublic.toString());
        
        if (uploadMetadata.description) {
          formData.append('metadata', JSON.stringify({
            description: uploadMetadata.description,
          }));
        }

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          results.push({
            file,
            success: true,
            document: result.document,
          });
        } else {
          results.push({
            file,
            success: false,
            error: result.error,
          });
          onUploadError?.(result.error);
        }
      } catch (error) {
        results.push({
          file,
          success: false,
          error: 'Upload failed',
        });
        onUploadError?.('Upload failed');
      }

      // Update progress
      const progress = ((i + 1) / uploadState.selectedFiles.length) * 100;
      setUploadState(prev => ({
        ...prev,
        progress,
      }));
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: false,
      uploadResults: results,
    }));

    // Show summary toast
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    if (successful > 0 && failed === 0) {
      toast.success(`Successfully uploaded ${successful} document${successful > 1 ? 's' : ''}`);
    } else if (successful > 0 && failed > 0) {
      toast.warning(`Uploaded ${successful} document${successful > 1 ? 's' : ''}, ${failed} failed`);
    } else if (failed > 0) {
      toast.error(`Failed to upload ${failed} document${failed > 1 ? 's' : ''}`);
    }

    // Call completion callback with successful documents
    const successfulDocuments = results.filter(r => r.success).map(r => r.document);
    if (successfulDocuments.length > 0) {
      onUploadComplete?.(successfulDocuments);
    }

    // Auto-close modal if all uploads succeeded
    if (successful > 0 && failed === 0) {
      setTimeout(() => {
        onClose();
      }, 1500); // Give user time to see success message
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!uploadState.isUploading) {
      onClose();
    }
  };

  if (!canUpload) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to upload documents.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </DialogTitle>
          <DialogDescription>
            Upload documents to be associated with {clientId ? 'this client' : payrollId ? 'this payroll' : 'the system'}.
            Supports PDF, Word, Excel, images, and text files up to 50MB.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              uploadState.isUploading
                ? "border-gray-200 bg-gray-50"
                : "border-gray-300 hover:border-gray-400 cursor-pointer"
            )}
            onClick={() => !uploadState.isUploading && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500">
                  PDF, Word, Excel, images, and text files up to 50MB
                </p>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept={ALLOWED_TYPES.join(',')}
            className="hidden"
          />

          {/* Upload Configuration */}
          {uploadState.selectedFiles.length > 0 && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Upload Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={uploadMetadata.category}
                    onValueChange={(value: any) => 
                      setUploadMetadata(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={uploadMetadata.isPublic}
                      onCheckedChange={(checked) =>
                        setUploadMetadata(prev => ({ ...prev, isPublic: checked }))
                      }
                    />
                    Public Document
                  </Label>
                  <p className="text-xs text-gray-500">
                    Public documents can be viewed by all users
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for these documents..."
                  value={uploadMetadata.description}
                  onChange={(e) =>
                    setUploadMetadata(prev => ({ ...prev, description: e.target.value }))
                  }
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Selected Files */}
          {uploadState.selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Files ({uploadState.selectedFiles.length})</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadState.selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-2 bg-white border rounded-lg">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    {!uploadState.isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="p-1 h-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadState.progress)}%</span>
              </div>
              <Progress value={uploadState.progress} />
            </div>
          )}

          {/* Upload Results */}
          {uploadState.uploadResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Upload Results</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadState.uploadResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-white border rounded-lg">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{result.file.name}</p>
                      {result.error && (
                        <p className="text-xs text-red-600">{result.error}</p>
                      )}
                    </div>
                    <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                      {result.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={uploadState.isUploading}
            >
              Clear All
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadState.isUploading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Files
              </Button>
              
              <Button
                onClick={uploadFiles}
                disabled={uploadState.isUploading || uploadState.selectedFiles.length === 0}
              >
                {uploadState.isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload {uploadState.selectedFiles.length > 0 && `(${uploadState.selectedFiles.length})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}