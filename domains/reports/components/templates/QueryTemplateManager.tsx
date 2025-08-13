import { format } from "date-fns";
import { Search, Trash2, Edit, Star, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface QueryTemplateManagerProps {
  templates: any[];
  loading: boolean;
  onSelect: (template: any) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export function QueryTemplateManager({
  templates,
  loading,
  onSelect,
  onDelete,
  onToggleFavorite,
  className,
}: QueryTemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchLower)
      )
    );
  });

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  return (
    <div className={className}>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No templates found
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => onSelect(template)}
                onPreview={() => handlePreview(template)}
                onDelete={onDelete ? () => onDelete(template.id) : undefined}
                onToggleFavorite={
                  onToggleFavorite
                    ? () => onToggleFavorite(template.id)
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Template Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              {selectedTemplate.description && (
                <p className="text-muted-foreground">
                  {selectedTemplate.description}
                </p>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Query</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-80 text-sm">
                  {selectedTemplate.queryText}
                </pre>
              </div>

              {selectedTemplate.parameters &&
                selectedTemplate.parameters.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Parameters</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTemplate.parameters.map((param: any) => (
                        <div key={param.name} className="p-2 border rounded-md">
                          <div className="font-medium">{param.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Type: {param.type}
                            {param.isRequired && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                onSelect(selectedTemplate);
                setShowPreview(false);
              }}
            >
              Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TemplateCardProps {
  template: any;
  onSelect: () => void;
  onPreview: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
}

function TemplateCard({
  template,
  onSelect,
  onPreview,
  onDelete,
  onToggleFavorite,
}: TemplateCardProps) {
  return (
    <Card
      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{template.name}</h3>
            {template.isFavorite && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          {template.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {template.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {template.queryType}
            </Badge>
            {template.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {template.createdAt && (
              <span>
                Created {format(new Date(template.createdAt), "dd/MM/yyyy")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={e => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Star
                className={`h-4 w-4 ${
                  template.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
