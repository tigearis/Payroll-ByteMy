// app/sso-callback/page.tsx (React Server Component that quickly hydrates)
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function Callback() {
  // Shows a spinner while Clerk exchanges `code` for a session cookie.
  return <AuthenticateWithRedirectCallback />;
}