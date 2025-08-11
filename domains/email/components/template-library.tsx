"use client";

// Template Library Component
// Security Classification: HIGH - Template browsing and management
// SOC2 Compliance: Template access audit and permission checks

import { useQuery, useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import DOMPurify from "isomorphic-dompurify";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  FileText,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetEmailTemplatesDocument,
  SearchEmailTemplatesDocument,
  DeleteEmailTemplateDocument,
  AddTemplateFavoriteDocument,
  RemoveTemplateFavoriteDocument,
  type GetEmailTemplatesQuery,
  type SearchEmailTemplatesQuery,
  type DeleteEmailTemplateMutation,
  type AddTemplateFavoriteMutation,
  type RemoveTemplateFavoriteMutation,
} from "../graphql/generated/graphql";
import type { EmailCategory } from "../types";
import { EMAIL_CATEGORIES } from "../types/template-types";

interface TemplateLibraryProps {
  onSelectTemplate?: (templateId: string) => void;
  onCreateNew?: () => void;
  onEditTemplate?: (templateId: string) => void;
  showActions?: boolean;
  mode?: "browse" | "select" | "manage";
  className?: string;
}

interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  isSystemTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  createdByUser?: {
    name: string;
  } | null;
  variableCount?: number;
  categoryInfo?: any;
  preview?: {
    subject: string;
    htmlContent: string;
  };
}

export function TemplateLibrary({
  onSelectTemplate,
  onCreateNew,
  onEditTemplate,
  showActions = true,
  mode = "browse",
  className,
}: TemplateLibraryProps) {
  // State
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<
    EmailCategory | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSystemOnly, setShowSystemOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // GraphQL queries and mutations
  const {
    data: templatesData,
    loading: templatesLoading,
    refetch,
  } = useQuery<GetEmailTemplatesQuery>(GetEmailTemplatesDocument, {
    variables: {
      category: selectedCategory === "all" ? undefined : selectedCategory,
      isActive: true,
    },
  });

  const { data: searchData, loading: searchLoading } =
    useQuery<SearchEmailTemplatesQuery>(SearchEmailTemplatesDocument, {
      variables: {
        searchTerm: `%${searchTerm}%`,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      },
      skip: !searchTerm,
    });

  const [deleteTemplate, { loading: deleting }] =
    useMutation<DeleteEmailTemplateMutation>(DeleteEmailTemplateDocument, {
      onCompleted: () => {
        toast.success("Template deleted successfully");
        refetch();
        setShowDeleteConfirm(false);
        setTemplateToDelete(null);
      },
      onError: error => {
        toast.error(`Failed to delete template: ${error.message}`);
      },
    });

  const [addFavorite] = useMutation<AddTemplateFavoriteMutation>(
    AddTemplateFavoriteDocument,
    {
      onCompleted: () => toast.success("Added to favorites"),
      onError: () => toast.error("Failed to add to favorites"),
    }
  );

  const [removeFavorite] = useMutation<RemoveTemplateFavoriteMutation>(
    RemoveTemplateFavoriteDocument,
    {
      onCompleted: () => toast.success("Removed from favorites"),
      onError: () => toast.error("Failed to remove from favorites"),
    }
  );

  // Get templates to display
  const templates =
    searchTerm && searchData
      ? searchData.emailTemplates
      : templatesData?.emailTemplates || [];

  const filteredTemplates = templates.filter(template => {
    if (showSystemOnly && !template.isSystemTemplate) return false;
    return true;
  });

  // Handle template selection
  const handleSelectTemplate = useCallback(
    (template: TemplateItem) => {
      if (mode === "select") {
        onSelectTemplate?.(template.id);
      } else {
        setSelectedTemplate(template);
      }
    },
    [mode, onSelectTemplate]
  );

  // Handle preview
  const handlePreview = useCallback(async (template: TemplateItem) => {
    try {
      const response = await fetch(`/api/email/templates/${template.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview" }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.preview) {
          setSelectedTemplate((prev: any) => ({
            ...template,
            preview: data.preview,
          }));
          setShowPreview(true);
        }
      }
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  }, []);

  // Handle delete
  const handleDelete = useCallback((templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (templateToDelete) {
      deleteTemplate({ variables: { templateId: templateToDelete } });
    }
  }, [templateToDelete, deleteTemplate]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(
    (templateId: string, isFavorite: boolean) => {
      if (!user?.id) {
        console.error("User not authenticated");
        return;
      }

      if (isFavorite) {
        removeFavorite({ variables: { userId: user.id, templateId } });
      } else {
        addFavorite({ variables: { userId: user.id, templateId } });
      }
    },
    [addFavorite, removeFavorite, user?.id]
  );

  // Get category info
  const getCategoryInfo = useCallback((categoryId: string) => {
    return EMAIL_CATEGORIES[categoryId as EmailCategory];
  }, []);

  return (
    <div className={className}>
      {/* Header and Controls */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Email Templates</h2>
            <p className="text-muted-foreground">
              Browse and manage email templates for all business communications
            </p>
          </div>

          {showActions && onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={selectedCategory}
            onValueChange={(value: EmailCategory | "all") =>
              setSelectedCategory(value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(EMAIL_CATEGORIES).map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" style={{ color: category.color }}>
                      {category.name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showSystemOnly ? "default" : "outline"}
            onClick={() => setShowSystemOnly(!showSystemOnly)}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            System Only
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      {templatesLoading || searchLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading templates...</span>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No templates match your search criteria."
              : "No templates available in this category."}
          </p>
          {showActions && onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => {
            const categoryInfo = getCategoryInfo(template.category);

            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  handleSelectTemplate({
                    id: template.id,
                    name: template.name,
                    category: template.category,
                    description: template.description || "",
                    isSystemTemplate: template.isSystemTemplate ?? false,
                    isActive: template.isActive ?? false,
                    createdAt: template.createdAt || new Date().toISOString(),
                  })
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {template.name}
                      </CardTitle>
                      {template.description && (
                        <CardDescription className="text-sm mt-1 line-clamp-2">
                          {template.description}
                        </CardDescription>
                      )}
                    </div>

                    {showActions && (
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handleFavoriteToggle(template.id, false); // TODO: Get actual favorite status
                          }}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {categoryInfo && (
                      <Badge
                        variant="outline"
                        style={{ color: categoryInfo.color }}
                      >
                        {categoryInfo.name}
                      </Badge>
                    )}

                    {template.isSystemTemplate && (
                      <Badge variant="secondary">System</Badge>
                    )}

                    {!template.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {(template as any).createdByUser && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {(template as any).createdByUser.computedName ||
                            `${(template as any).createdByUser.firstName || ""} ${(template as any).createdByUser.lastName || ""}`.trim() ||
                            "Unknown User"}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {template.createdAt
                          ? new Date(template.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </div>
                    </div>

                    {showActions && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            handlePreview({
                              id: template.id,
                              name: template.name,
                              category: template.category,
                              description: template.description || "",
                              isSystemTemplate:
                                template.isSystemTemplate ?? false,
                              isActive: template.isActive ?? false,
                              createdAt:
                                template.createdAt || new Date().toISOString(),
                            });
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>

                        {onEditTemplate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onEditTemplate(template.id);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}

                        {!template.isSystemTemplate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(template.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Template Preview: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Preview how this template will appear when processed
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate?.preview && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject:</label>
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {selectedTemplate.preview.subject}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Content:</label>
                <div
                  className="border rounded p-4 bg-white min-h-[300px]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedTemplate.preview.htmlContent
                    ),
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            {onSelectTemplate && selectedTemplate && (
              <Button
                onClick={() => {
                  onSelectTemplate(selectedTemplate.id);
                  setShowPreview(false);
                }}
              >
                Use This Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
