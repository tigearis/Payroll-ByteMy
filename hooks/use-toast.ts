// Enhanced toast hook using sonner
import { toast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const showToast = (options: ToastOptions) => {
    const { title, description, variant, duration = 5000 } = options;

    if (variant === "destructive") {
      toast.error(title, {
        description,
        duration,
      });
    } else {
      toast(title, {
        description,
        duration,
      });
    }
  };

  return { toast: showToast };
}
