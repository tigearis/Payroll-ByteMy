"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface UseUnauthorizedModalProps {
  onNavigateHome?: () => void;
  onGoBack?: () => void;
  autoShow?: boolean;
}

export function useUnauthorizedModal({
  onNavigateHome,
  onGoBack,
  autoShow = false,
}: UseUnauthorizedModalProps = {}) {
  const [isOpen, setIsOpen] = useState(autoShow);
  const [reason, setReason] = useState<string | undefined>();
  const router = useRouter();

  const show = useCallback((errorReason?: string) => {
    setReason(errorReason);
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => {
    setIsOpen(false);
    setReason(undefined);
  }, []);

  const handleNavigateHome = useCallback(() => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      router.push("/dashboard");
    }
    hide();
  }, [onNavigateHome, router, hide]);

  const handleGoBack = useCallback(() => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
    hide();
  }, [onGoBack, router, hide]);

  return {
    isOpen,
    reason,
    show,
    hide,
    handleNavigateHome,
    handleGoBack,
  };
}
