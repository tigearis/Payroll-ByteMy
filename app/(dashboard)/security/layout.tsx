import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Compliance",
  description: "Monitor security events and compliance status",
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
