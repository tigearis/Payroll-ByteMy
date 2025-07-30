"use client";

import {
  File,
  Image,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  User,
  Building,
  Briefcase,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";

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

interface DocumentListProps {
  clientId?: string;
  payrollId?: string;
  uploadedBy?: string;
  showFilters?: boolean;
  className?: string;
  onDocumentClick?: (document: Document) => void;
  onDocumentUpdate?: () => void;
}

interface Filters {
  search: string;
  category: string;
  isPublic: string;
  uploadedBy: string;
}

const DOCUMENT_CATEGORIES = [
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'report', label: 'Report' },
  { value: 'timesheet', label: 'Timesheet' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'other', label: 'Other' },
];

function getFileIcon(mimetype: string) {
  if (mimetype.startsWith('image/')) {
    return <Image className="w-4 h-4 text-blue-500" />;
  } else if (mimetype === 'application/pdf') {
    return <FileText className="w-4 h-4 text-red-500" />;
  } else if (mimetype.includes('word') || mimetype.includes('document')) {
    return <FileText className="w-4 h-4 text-blue-600" />;
  } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) {
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DocumentList({
  clientId,
  payrollId,
  uploadedBy,
  showFilters = true,
  className,
  onDocumentClick,
  onDocumentUpdate,
}: DocumentListProps) {
  const { can } = usePermissions();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    isPublic: '',
    uploadedBy: uploadedBy || '',
  });

  const itemsPerPage = 20;

  // Check permissions
  const canView = can('files', 'read');
  const canEdit = can('files', 'update');
  const canDelete = can('files', 'delete');

  // Load documents
  const loadDocuments = async (page = 1, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((page - 1) * itemsPerPage).toString(),
      });

      // Add filters
      if (clientId) params.append('clientId', clientId);
      if (payrollId) params.append('payrollId', payrollId);
      if (filters.uploadedBy) params.append('uploadedBy', filters.uploadedBy);
      if (filters.category) params.append('category', filters.category);
      if (filters.isPublic) params.append('isPublic', filters.isPublic);

      const response = await fetch(`/api/documents/list?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        let filteredDocuments = result.documents;

        // Apply client-side search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredDocuments = filteredDocuments.filter((doc: Document) =>
            doc.filename.toLowerCase().includes(searchLower) ||
            (doc.metadata?.description || '').toLowerCase().includes(searchLower) ||
            (doc.clientName || '').toLowerCase().includes(searchLower) ||
            (doc.payrollName || '').toLowerCase().includes(searchLower)
          );
        }

        setDocuments(filteredDocuments);
        setTotalCount(result.totalCount);
      } else {
        toast.error('Failed to load documents', {
          description: result.error,
        });
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load documents on mount and filter changes
  useEffect(() => {
    if (canView) {
      loadDocuments(1);
    }
  }, [canView, clientId, payrollId, filters.uploadedBy, filters.category, filters.isPublic]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canView) {
        loadDocuments(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle document actions
  const handleView = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}/view`);
      const result = await response.json();

      if (result.success) {
        window.open(result.viewUrl, '_blank');
      } else {
        toast.error('Failed to open document', {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error('Failed to open document');
    }
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

  const handleDelete = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Document deleted successfully');
        loadDocuments(currentPage);
        onDocumentUpdate?.();
      } else {
        toast.error('Failed to delete document', {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleRefresh = () => {
    loadDocuments(currentPage, true);
  };

  if (!canView) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">You don't have permission to view documents.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <File className="w-5 h-5" />
            Documents
            {totalCount > 0 && (
              <Badge variant="secondary">{totalCount}</Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search documents..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="visibility">Visibility</Label>
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

            {!uploadedBy && (
              <div className="space-y-2">
                <Label htmlFor="uploader">Uploaded By</Label>
                <Input
                  id="uploader"
                  placeholder="User ID..."
                  value={filters.uploadedBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, uploadedBy: e.target.value }))}
                />
              </div>
            )}
          </div>
        )}

        {/* Documents Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Associations</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <File className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No documents found</p>
                      {(filters.search || filters.category || filters.isPublic) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFilters({ search: '', category: '', isPublic: '', uploadedBy: uploadedBy || '' })}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((document) => (
                  <TableRow
                    key={document.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onDocumentClick?.(document)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getFileIcon(document.mimetype)}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{document.filename}</p>
                          {document.metadata?.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {document.metadata.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {DOCUMENT_CATEGORIES.find(cat => cat.value === document.category)?.label || 'Other'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatFileSize(document.size)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatDate(document.createdAt)}</div>
                        {document.uploaderName && (
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {document.uploaderName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {document.clientName && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Building className="w-3 h-3 mr-1" />
                            {document.clientName}
                          </div>
                        )}
                        {document.payrollName && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {document.payrollName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={document.isPublic ? "default" : "secondary"}>
                        {document.isPublic ? "Public" : "Private"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleView(document);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(document);
                          }}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open edit modal
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(document);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} documents
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadDocuments(newPage);
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadDocuments(newPage);
                }}
                disabled={currentPage * itemsPerPage >= totalCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}