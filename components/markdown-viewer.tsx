import { clsx, type ClassValue } from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";

// Local utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isImportant?: boolean;
}

export function MarkdownViewer({
  content,
  className,
  isImportant = false,
}: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-full",
        isImportant && "border-l-4 border-red-500 pl-4 bg-red-50/20",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ _node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            />
          ),
          code: ({ _node, ...props }) => (
            <code {...props} className="bg-muted px-1 py-0.5 rounded text-sm" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
