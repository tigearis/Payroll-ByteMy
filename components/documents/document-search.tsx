"use client";

import {
  Search,
  Filter,
  X,
  File,
  Image,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Building,
  Briefcase,
  Clock,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { DocumentViewer } from "./document-viewer";

interface Document {
  id: string;
  filename: string;
  size: number;
  mimetype: string;
  url: string;
  clientId?: string;
  payrollId?: string;
  uploadedBy: string;
  category: string;
  isPublic: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  // Related data
  clientName?: string;
  payrollName?: string;
  uploaderName?: string;
}

interface DocumentSearchProps {
  className?: string;
  onDocumentSelect?: (document: Document) => void;
  presetFilters?: {
    clientId?: string;
    payrollId?: string;
    uploadedBy?: string;
    category?: string;
  };
}

interface SearchFilters {
  query: string;
  clientId: string;
  payrollId: string;
  category: string;
  uploadedBy: string;
  isPublic: string;
}

const DOCUMENT_CATEGORIES = [
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'report', label: 'Report' },
  { value: 'timesheet', label: 'Timesheet' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'other', label: 'Other' },
];

function getFileIcon(mimetype: string, className?: string) {
  if (mimetype.startsWith('image/')) {
    return <Image className={cn("text-blue-500", className)} />;
  } else if (mimetype === 'application/pdf') {
    return <FileText className={cn("text-red-500", className)} />;
  } else if (mimetype.includes('word') || mimetype.includes('document')) {
    return <FileText className={cn("text-blue-600", className)} />;
  } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) {
    return <FileText className={cn("text-green-600", className)} />;
  }
  return <File className={cn("text-gray-500", className)} />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

export function DocumentSearch({ 
  className, 
  onDocumentSelect,
  presetFilters = {} 
}: DocumentSearchProps) {
  const { can } = usePermissions();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    clientId: presetFilters.clientId || '',
    payrollId: presetFilters.payrollId || '',
    category: presetFilters.category || '',
    uploadedBy: presetFilters.uploadedBy || '',
    isPublic: '',
  });

  // Check permissions
  const canSearch = can('files', 'read');

  // Search documents
  const searchDocuments = async () => {
    if (!filters.query.trim() && !filters.clientId && !filters.payrollId && !filters.category && !filters.uploadedBy) {
      toast.error('Please enter a search query or select filters');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      
      if (filters.query.trim()) params.append('q', filters.query.trim());
      if (filters.clientId) params.append('clientId', filters.clientId);
      if (filters.payrollId) params.append('payrollId', filters.payrollId);
      if (filters.category) params.append('category', filters.category);
      if (filters.uploadedBy) params.append('uploadedBy', filters.uploadedBy);
      if (filters.isPublic) params.append('isPublic', filters.isPublic);
      
      params.append('limit', '50'); // Limit to 50 results for search

      const response = await fetch(`/api/documents/search?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setDocuments(result.documents);
      } else {
        toast.error('Search failed', {
          description: result.error,
        });
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      toast.error('Search failed');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      searchDocuments();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: '',
      clientId: presetFilters.clientId || '',
      payrollId: presetFilters.payrollId || '',
      category: presetFilters.category || '',
      uploadedBy: presetFilters.uploadedBy || '',
      isPublic: '',
    });
    setDocuments([]);
    setHasSearched(false);
  };

  // Handle document actions
  const handleView = async (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
    onDocumentSelect?.(document);
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.filename;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const result = await response.json();
        toast.error('Failed to download document', {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.clientId) count++;
    if (filters.payrollId) count++;
    if (filters.category) count++;
    if (filters.uploadedBy) count++;
    if (filters.isPublic) count++;
    return count;
  }, [filters]);

  if (!canSearch) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">You don't have permission to search documents.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Document Search
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Documents</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search-query"
                  placeholder="Search by filename, description, client, or payroll..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={searchDocuments} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Label>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {DOCUMENT_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-visibility">Visibility</Label>
                <Select
                  value={filters.isPublic}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, isPublic: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All documents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All documents</SelectItem>
                    <SelectItem value="true">Public only</SelectItem>
                    <SelectItem value="false">Private only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-uploader">Uploaded By</Label>
                <Input
                  id="filter-uploader"
                  placeholder="User ID..."
                  value={filters.uploadedBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, uploadedBy: e.target.value }))}
                />
              </div>

              {!presetFilters.clientId && (
                <div className="space-y-2">
                  <Label htmlFor="filter-client">Client ID</Label>
                  <Input
                    id="filter-client"
                    placeholder="Client ID..."
                    value={filters.clientId}
                    onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value }))}
                  />
                </div>
              )}

              {!presetFilters.payrollId && (
                <div className="space-y-2">
                  <Label htmlFor="filter-payroll">Payroll ID</Label>
                  <Input
                    id="filter-payroll"
                    placeholder="Payroll ID..."
                    value={filters.payrollId}
                    onChange={(e) => setFilters(prev => ({ ...prev, payrollId: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-500">Searching documents...</span>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Search Results</h3>
                <Badge variant="outline">{documents.length} documents found</Badge>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">No documents found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {documents.map((document) => (
                    <Card key={document.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getFileIcon(document.mimetype, "w-8 h-8")}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{document.filename}</h4>
                                
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                  <span>{formatFileSize(document.size)}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {DOCUMENT_CATEGORIES.find(cat => cat.value === document.category)?.label || 'Other'}
                                  </Badge>
                                  <Badge variant={document.isPublic ? "default" : "secondary"} className="text-xs">
                                    {document.isPublic ? "Public" : "Private"}
                                  </Badge>
                                </div>

                                {document.metadata?.description && (
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {document.metadata.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {getTimeAgo(document.createdAt)}
                                  </div>
                                  {document.uploaderName && (
                                    <div className="flex items-center">
                                      <User className="w-3 h-3 mr-1" />
                                      {document.uploaderName}
                                    </div>
                                  )}
                                  {document.clientName && (
                                    <div className="flex items-center">
                                      <Building className="w-3 h-3 mr-1" />
                                      {document.clientName}
                                    </div>
                                  )}
                                  {document.payrollName && (
                                    <div className="flex items-center">
                                      <Briefcase className="w-3 h-3 mr-1" />
                                      {document.payrollName}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(document);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(document);
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">Enter search criteria above</p>
              <p className="text-sm text-gray-400">Search by filename, description, or use filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer */}
      <DocumentViewer
        document={selectedDocument}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </>
  );
}