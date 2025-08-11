/**
 * Standardized Form Components
 * 
 * Consistent form patterns using React Hook Form + Zod validation
 * for all form implementations across the application
 */

"use client";

import React from "react";
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// =============================================================================
// STANDARDIZED FORM FIELD TYPES
// =============================================================================

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>; // For select fields
  rows?: number; // For textarea
}

// =============================================================================
// STANDARDIZED FORM MODAL
// =============================================================================

interface StandardFormModalProps<T extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  form: UseFormReturn<T>;
  fields: FormFieldConfig[];
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  className?: string;
}

export function StandardFormModal<T extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  form,
  fields,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  className,
}: StandardFormModalProps<T>) {
  const renderField = (field: FormFieldConfig) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as FieldPath<T>}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {(() => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <Textarea
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        {...formField}
                      />
                    );
                  
                  case "select":
                    return (
                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  
                  case "checkbox":
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field.name}
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                        />
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.placeholder}
                        </label>
                      </div>
                    );
                  
                  default:
                    return (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    );
                }
              })()}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className || "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(renderField)}
            
            <DialogFooter className="flex gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// STANDARDIZED INLINE FORM
// =============================================================================

interface StandardInlineFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: FormFieldConfig[];
  onSubmit: (values: T) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function StandardInlineForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  loading = false,
  className,
}: StandardInlineFormProps<T>) {
  const renderField = (field: FormFieldConfig) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as FieldPath<T>}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {(() => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <Textarea
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        {...formField}
                      />
                    );
                  
                  case "select":
                    return (
                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  
                  case "checkbox":
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field.name}
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                        />
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {field.placeholder}
                        </label>
                      </div>
                    );
                  
                  default:
                    return (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    );
                }
              })()}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className || ""}`}>
        {fields.map(renderField)}
        
        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// =============================================================================
// USAGE EXAMPLES AND DOCUMENTATION
// =============================================================================

/*
USAGE EXAMPLE - Modal Form:

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StandardFormModal, FormFieldConfig } from "@/components/ui/standardized-form";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

const fields: FormFieldConfig[] = [
  { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Enter full name" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "role", label: "Role", type: "select", required: true, options: [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "User" }
  ]},
  { name: "isActive", label: "Active", type: "checkbox", placeholder: "User is active" },
];

function MyComponent() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "user", isActive: false }
  });

  const onSubmit = async (values: FormData) => {
    // Handle form submission
    console.log(values);
    setOpen(false);
  };

  return (
    <StandardFormModal
      open={open}
      onOpenChange={setOpen}
      title="Create User"
      description="Add a new user to the system"
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Create User"
    />
  );
}
*/