"use client";

import { ApolloProvider } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import client, { clearAuthCache } from "./apollo-client";

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();

  // Clear cache on sign out
  useEffect(() => {
    if (!isSignedIn) {
      clearAuthCache();
    }
  }, [isSignedIn]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
