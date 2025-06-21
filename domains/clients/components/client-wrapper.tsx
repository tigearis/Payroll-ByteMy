// components/client-wrapper.tsx
'use client';

import { ReactNode } from "react";

interface ClientWrapperProps {
  children: ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <div>
      {children}
    </div>
  );
}
