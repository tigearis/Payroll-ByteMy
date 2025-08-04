"use client";

import {
  File,
  Image,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Minimize,
  AlertCircle,
  Loader2,
  Upload,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  filename: string;
  size: number;
  mimetype: string;
  url: string;
  category: string;
  isPublic: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  clientName?: string;
  payrollName?: string;
  uploaderName?: string;
}

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onDocumentUpdated?: (document: Document) => void;
  className?: string;
}

interface ViewerState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  viewUrl: string | null;
  zoom: number;
  rotation: number;
  isFullscreen: boolean;
  officeViewerFailed: boolean;
  isReplacing: boolean;
}

function getFileIcon(mimetype: string, className?: string) {
  if (mimetype.startsWith("image/")) {
    return <Image className={cn("text-blue-500", className)} />;
  } else if (mimetype === "application/pdf") {
    return <FileText className={cn("text-red-500", className)} />;
  } else if (mimetype.includes("word") || mimetype.includes("document")) {
    return <FileText className={cn("text-blue-600", className)} />;
  } else if (mimetype.includes("excel") || mimetype.includes("spreadsheet")) {
    return <FileText className={cn("text-green-600", className)} />;
  }
  return <File className={cn("text-gray-500", className)} />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function canPreview(mimetype: string): boolean {
  return (
    mimetype.startsWith("image/") ||
    mimetype === "application/pdf" ||
    mimetype === "text/plain" ||
    isOfficeDocument(mimetype)
  );
}

function isOfficeDocument(mimetype: string): boolean {
  const officeMimeTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  return officeMimeTypes.includes(mimetype);
}

export function DocumentViewer({
  document,
  isOpen,
  onClose,
  onDocumentUpdated,
  className,
}: DocumentViewerProps) {
  const [viewerState, setViewerState] = useState<ViewerState>({
    isLoading: false,
    hasError: false,
    errorMessage: "",
    viewUrl: null,
    zoom: 100,
    rotation: 0,
    isFullscreen: false,
    officeViewerFailed: false,
    isReplacing: false,
  });

  const viewerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { can } = usePermissions();

  // Load document view URL when opened
  useEffect(() => {
    if (document && isOpen) {
      loadViewUrl();
    }
    return () => {
      // Reset state when closing
      if (!isOpen) {
        setViewerState({
          isLoading: false,
          hasError: false,
          errorMessage: "",
          viewUrl: null,
          zoom: 100,
          rotation: 0,
          isFullscreen: false,
          officeViewerFailed: false,
          isReplacing: false,
        });
      }
    };
  }, [document, isOpen]);

  // Auto-open PDFs in new tab when URL is available
  useEffect(() => {
    if (
      document?.mimetype === "application/pdf" &&
      viewerState.viewUrl &&
      !viewerState.hasError
    ) {
      handleOpenInNewTab();
    }
  }, [viewerState.viewUrl, document?.mimetype, viewerState.hasError]);

  const loadViewUrl = async () => {
    if (!document) return;

    setViewerState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      errorMessage: "",
    }));

    try {
      let viewUrl: string;

      // For Office documents, use proxy endpoint for better compatibility with external viewers
      if (isOfficeDocument(document.mimetype)) {
        const baseUrl = window.location.origin;
        viewUrl = `${baseUrl}/api/documents/${document.id}/proxy`;
      } else if (document.url) {
        // Use the existing presigned URL from the document record for other file types
        // This avoids the authentication issue and is more efficient
        viewUrl = document.url;
      } else {
        // Fallback to API if no URL is available
        const response = await fetch(
          `/api/documents/${document.id}/view?expiryMinutes=60`
        );
        const result = await response.json();

        if (result.success) {
          viewUrl = result.viewUrl;
        } else {
          setViewerState(prev => ({
            ...prev,
            isLoading: false,
            hasError: true,
            errorMessage: result.error || "Failed to load document",
          }));
          return;
        }
      }

      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        viewUrl,
      }));
    } catch (error) {
      console.error("Error loading document view URL:", error);
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: "Failed to load document",
      }));
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      const response = await fetch(`/api/documents/${document.id}/download`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.filename;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Download started");
      } else {
        const result = await response.json();
        toast.error("Failed to download document", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const handleOpenInNewTab = () => {
    if (viewerState.viewUrl) {
      window.open(viewerState.viewUrl, "_blank");
    }
  };

  const handleZoomIn = () => {
    setViewerState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 25, 200),
    }));
  };

  const handleZoomOut = () => {
    setViewerState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 25, 50),
    }));
  };

  const handleRotate = () => {
    setViewerState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const toggleFullscreen = () => {
    setViewerState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  };

  const handleReplaceDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileReplace = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !document) return;

    // Validate file type matches original
    const originalExt = document.filename.split('.').pop()?.toLowerCase();
    const newExt = file.name.split('.').pop()?.toLowerCase();
    
    if (originalExt !== newExt) {
      toast.error(`File type mismatch. Expected .${originalExt} file.`);
      return;
    }

    setViewerState(prev => ({ ...prev, isReplacing: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', document.category);
      formData.append('isPublic', document.isPublic.toString());
      formData.append('replaceDocumentId', document.id);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Document updated successfully');
        // Notify parent component of the updated document
        if (onDocumentUpdated && result.document) {
          onDocumentUpdated(result.document);
        }
        // Reload the document view
        await loadViewUrl();
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Failed to update document', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Error replacing document:', error);
      toast.error('Failed to update document');
    } finally {
      setViewerState(prev => ({ ...prev, isReplacing: false }));
    }
  };

  if (!document) return null;

  const isPreviewable = canPreview(document.mimetype);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-4xl max-h-[90vh] overflow-hidden",
          viewerState.isFullscreen && "max-w-[95vw] max-h-[95vh]",
          className
        )}
      >
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0 flex-1">
              {getFileIcon(document.mimetype, "w-6 h-6 mt-1 flex-shrink-0")}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-left truncate">
                  {document.filename}
                </DialogTitle>
                <DialogDescription className="text-left space-y-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span>{formatFileSize(document.size)}</span>
                    <Badge variant="outline">{document.category}</Badge>
                    <Badge
                      variant={document.isPublic ? "default" : "secondary"}
                    >
                      {document.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Uploaded {formatDate(document.createdAt)}
                    {document.uploaderName && ` by ${document.uploaderName}`}
                  </div>
                  {(document.clientName || document.payrollName) && (
                    <div className="text-xs text-gray-600 space-y-1">
                      {document.clientName && (
                        <div>Client: {document.clientName}</div>
                      )}
                      {document.payrollName && (
                        <div>Payroll: {document.payrollName}</div>
                      )}
                    </div>
                  )}
                  {document.metadata?.description && (
                    <div className="text-xs text-gray-600">
                      {document.metadata.description}
                    </div>
                  )}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            {viewerState.viewUrl && (
              <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            )}

            {isPreviewable && viewerState.viewUrl && !viewerState.hasError && (
              <>
                <div className="h-4 border-l border-gray-300" />
                <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{viewerState.zoom}%</span>
                <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>

                {document.mimetype.startsWith("image/") && (
                  <Button variant="ghost" size="sm" onClick={handleRotate}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                )}

                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  {viewerState.isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogHeader>

        {/* Document Preview Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {viewerState.isLoading ? (
            <div className="flex items-center justify-center h-96 space-y-4">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500">Loading document...</p>
              </div>
            </div>
          ) : viewerState.hasError ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Failed to load document
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {viewerState.errorMessage}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadViewUrl}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : !isPreviewable ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                {getFileIcon(document.mimetype, "w-16 h-16 mx-auto")}
                <div>
                  <p className="font-medium text-gray-900">
                    Preview not available
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This file type cannot be previewed in the browser
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download to view
                  </Button>
                  {viewerState.viewUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenInNewTab}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in new tab
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={viewerRef}
              className="w-full h-full overflow-auto bg-gray-50 rounded-lg"
              style={{ minHeight: "400px" }}
            >
              {document.mimetype.startsWith("image/") ? (
                <div className="flex items-center justify-center min-h-full p-4">
                  <img
                    src={viewerState.viewUrl!}
                    alt={document.filename}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `scale(${viewerState.zoom / 100}) rotate(${viewerState.rotation}deg)`,
                      transformOrigin: "center",
                    }}
                    onError={() => {
                      setViewerState(prev => ({
                        ...prev,
                        hasError: true,
                        errorMessage: "Failed to load image",
                      }));
                    }}
                  />
                </div>
              ) : document.mimetype === "application/pdf" ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 mx-auto text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        PDF opened in new tab
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF documents are automatically opened in a new tab for
                        better viewing
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {viewerState.viewUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenInNewTab}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open again
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ) : document.mimetype === "text/plain" ? (
                <div className="p-4">
                  <iframe
                    src={viewerState.viewUrl!}
                    className="w-full h-full min-h-[400px] border border-gray-200 rounded"
                    style={{
                      transform: `scale(${viewerState.zoom / 100})`,
                      transformOrigin: "top left",
                    }}
                    onError={() => {
                      setViewerState(prev => ({
                        ...prev,
                        hasError: true,
                        errorMessage: "Failed to load text file",
                      }));
                    }}
                  />
                </div>
              ) : isOfficeDocument(document.mimetype) ? (
                <div className="w-full h-full min-h-[500px]">
                  {!viewerState.officeViewerFailed ? (
                    <>
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewerState.viewUrl!)}`}
                        className="w-full h-full border border-gray-200 rounded"
                        style={{
                          transform: `scale(${viewerState.zoom / 100})`,
                          transformOrigin: "top left",
                          minHeight: "500px",
                        }}
                        onError={() => {
                          console.log("Microsoft Office viewer failed, trying Google Docs viewer");
                          // Add a small delay to allow the error to be processed
                          setTimeout(() => {
                            setViewerState(prev => ({
                              ...prev,
                              officeViewerFailed: true,
                            }));
                          }, 1000);
                        }}
                        onLoad={() => {
                          console.log("Office document loaded successfully with Microsoft viewer");
                        }}
                      />
                      <div className="text-xs text-gray-500 mt-2 px-4">
                        Document is displayed using Microsoft Office Online viewer
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded mb-2">
                        <div className="text-sm text-blue-700">
                          Microsoft Office viewer unavailable, using Google Docs viewer...
                        </div>
                      </div>
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(viewerState.viewUrl!)}&embedded=true`}
                        className="w-full h-full border border-gray-200 rounded"
                        style={{
                          transform: `scale(${viewerState.zoom / 100})`,
                          transformOrigin: "top left",
                          minHeight: "500px",
                        }}
                        onError={() => {
                          setViewerState(prev => ({
                            ...prev,
                            hasError: true,
                            errorMessage: "Failed to load Office document using both Microsoft Office Online and Google Docs viewers. The document might not be publicly accessible or might be corrupted.",
                          }));
                        }}
                        onLoad={() => {
                          console.log("Office document loaded successfully with Google Docs viewer");
                        }}
                      />
                      <div className="text-xs text-gray-500 mt-2 px-4">
                        Document is displayed using Google Docs viewer (fallback)
                      </div>
                    </>
                  )}
                  <div className="space-y-4 mt-4 px-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-900 mb-1">
                            Want to edit this document?
                          </h4>
                          <p className="text-sm text-blue-700 mb-2">
                            To make changes to this {document.mimetype.includes('word') ? 'Word document' : 
                            document.mimetype.includes('excel') || document.mimetype.includes('spreadsheet') ? 'Excel spreadsheet' :
                            document.mimetype.includes('powerpoint') || document.mimetype.includes('presentation') ? 'PowerPoint presentation' : 'Office document'}:
                          </p>
                          <ol className="text-sm text-blue-700 space-y-1 ml-4">
                            <li>1. Download the document using the button below</li>
                            <li>2. Open it in Microsoft Office or compatible software</li>
                            <li>3. Make your changes and save the file</li>
                            <li>4. Upload the updated version to replace this document</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download to Edit
                      </Button>
                      {can('documents', 'update') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReplaceDocument}
                          disabled={viewerState.isReplacing}
                        >
                          {viewerState.isReplacing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          {viewerState.isReplacing ? 'Uploading...' : 'Replace Document'}
                        </Button>
                      )}
                      {viewerState.viewUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenInNewTab}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in new tab
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Hidden file input for document replacement */}
        <input
          ref={fileInputRef}
          type="file"
          accept={isOfficeDocument(document.mimetype) 
            ? ".doc,.docx,.xls,.xlsx,.ppt,.pptx" 
            : document.mimetype}
          onChange={handleFileReplace}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
