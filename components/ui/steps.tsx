"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Steps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    activeStep?: number;
    onStepClick?: (step: number) => void;
  }
>(({ className, activeStep = 0, onStepClick, children, ...props }, ref) => {
  const steps = React.Children.toArray(children);

  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                activeStep > index
                  ? "border-primary bg-primary text-primary-foreground"
                  : activeStep === index
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground",
                onStepClick && "cursor-pointer"
              )}
              onClick={() => onStepClick?.(index)}
            >
              {activeStep > index ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] flex-1",
                  activeStep > index ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div>{steps[activeStep]}</div>
    </div>
  );
});
Steps.displayName = "Steps";

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
  }
>(({ className, title, description, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {title && <h3 className="font-medium">{title}</h3>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
});
Step.displayName = "Step";

export { Steps, Step };
