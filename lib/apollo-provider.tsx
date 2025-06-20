"use client";

import { ApolloProvider } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { clientApolloClient } from "./apollo/unified-client";

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();

  // Clear Apollo cache on sign out
  useEffect(() => {
    if (!isSignedIn) {
      clientApolloClient.clearStore();
    }
  }, [isSignedIn]);

  return <ApolloProvider client={clientApolloClient}>{children}</ApolloProvider>;
}
