import { useState } from "react";
import { Plus, Star, StarOff, Share2, Tags } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateForm } from "./TemplateForm";
import { useReportTemplates } from "../../hooks/useReportTemplates";
import type { ReportTemplate, ReportConfig } from "../../types/report.types";

interface TemplateManagerProps {
  templates: ReportTemplate[];
  onSelect: (template: ReportTemplate) => void;
  currentConfig?: ReportConfig;
  className?: string;
}

export function TemplateManager({
  templates,
  onSelect,
  currentConfig,
  className,
}: TemplateManagerProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "all" | "favorites" | "shared"
  >("all");
  const { saveTemplate, updateTemplate, deleteTemplate } = useReportTemplates();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = async (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);

    // Update template in backend
    const template = templates.find(t => t.id === templateId);
    if (template) {
      await updateTemplate(templateId, {
        ...template,
        isFavorite: !favorites.has(templateId),
      });
    }
  };

  const handleSaveTemplate = async (template: Omit<ReportTemplate, "id">) => {
    await saveTemplate(template);
    setShowForm(false);
  };

  const handleShare = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      await updateTemplate(templateId, {
        ...template,
        isPublic: !template.isPublic,
      });
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags?.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "favorites" && favorites.has(template.id!)) ||
      (selectedTab === "shared" && template.isPublic);

    return matchesSearch && matchesTab;
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(template.id!)}
                      >
                        {favorites.has(template.id!) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      {template.createdBy === user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(template.id!)}
                        >
                          <Share2
                            className={`h-4 w-4 ${
                              template.isPublic ? "text-green-500" : ""
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tags className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {template.tags?.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {template.domains.length} domain
                        {template.domains.length !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span>
                        {Object.values(template.fields).reduce(
                          (acc, fields) => acc + fields.length,
                          0
                        )}{" "}
                        fields
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Tabs>

      {showForm && (
        <TemplateForm
          initialData={currentConfig}
          onSave={handleSaveTemplate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
