"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

// Simple accordion implementation without Radix UI dependency
interface AccordionContextValue {
  value?: string | string[];
  onValueChange?: (value: string) => void;
  type?: "single" | "multiple";
  collapsible?: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue>({});

interface AccordionProps extends AccordionContextValue {
  className?: string;
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, value, onValueChange, type = "single", collapsible = false, ...props }, ref) => {
    return (
      <AccordionContext.Provider value={{ value, onValueChange, type, collapsible }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps {
  className?: string;
  children: React.ReactNode;
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, value, ...props }, ref) => (
    <div ref={ref} className={cn("border-b", className)} data-value={value} {...props}>
      {children}
    </div>
  )
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = () => {
      setIsOpen(!isOpen);
      context.onValueChange?.(isOpen ? "" : "item");
      onClick?.();
    };

    return (
      <div className="flex">
        <button
          ref={ref}
          className={cn(
            "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            className
          )}
          onClick={handleClick}
          data-state={isOpen ? "open" : "closed"}
          {...props}
        >
          {children}
          <ChevronDown className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </button>
      </div>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const [isOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden text-sm transition-all duration-200",
          isOpen ? "animate-accordion-down" : "animate-accordion-up"
        )}
        {...props}
      >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };