import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  height = "300px",
  className,
  readOnly = false,
}: CodeEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Apply syntax highlighting class based on language
  const languageClass = language ? `language-${language}` : "";

  return (
    <div
      className={cn("relative border rounded-md overflow-hidden", className)}
      style={{ height }}
    >
      <div className="absolute top-0 right-0 p-2 text-xs text-muted-foreground bg-muted rounded-bl-md">
        {language.toUpperCase()}
      </div>
      <textarea
        value={localValue}
        onChange={handleChange}
        className={cn(
          "w-full h-full p-4 font-mono text-sm resize-none bg-black text-white",
          "focus:outline-none focus:ring-1 focus:ring-primary",
          readOnly && "opacity-90 cursor-default"
        )}
        style={{ height: "100%" }}
        spellCheck="false"
        readOnly={readOnly}
      />
    </div>
  );
}
