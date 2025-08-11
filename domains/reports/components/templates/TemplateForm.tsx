import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { ReportTemplate, ReportConfig } from "../../types/report.types";

interface TemplateFormProps {
  initialData?: ReportConfig;
  onSave: (template: Omit<ReportTemplate, "id">) => void;
  onCancel: () => void;
}

export function TemplateForm({
  initialData,
  onSave,
  onCancel,
}: TemplateFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<ReportTemplate>>({
    name: "",
    description: "",
    domains: initialData?.domains || [],
    fields: initialData?.fields || {},
    filters: initialData?.filters || [],
    sorts: initialData?.sorts || [],
    limit: initialData?.limit || 100,
    isPublic: false,
    tags: [],
    createdBy: user?.id,
  });

  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !user?.id) return;

    onSave({
      ...formData,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ReportTemplate);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <Dialog open onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save Report Template</DialogTitle>
            <DialogDescription>
              Save your current report configuration as a reusable template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter template name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter template description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                id="tags"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tags (press Enter)"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Make Public</Label>
                <div className="text-sm text-muted-foreground">
                  Allow other users to use this template
                </div>
              </div>
              <Switch
                id="public"
                checked={formData.isPublic}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isPublic: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Template Contents</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  {formData.domains?.length || 0} domain
                  {formData.domains?.length !== 1 ? "s" : ""}
                </p>
                <p>
                  {Object.values(formData.fields || {}).reduce(
                    (acc, fields) => acc + fields.length,
                    0
                  )}{" "}
                  fields
                </p>
                <p>
                  {formData.filters?.length || 0} filter
                  {formData.filters?.length !== 1 ? "s" : ""}
                </p>
                <p>
                  {formData.sorts?.length || 0} sort rule
                  {formData.sorts?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
