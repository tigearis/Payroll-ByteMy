import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';


export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // Add your authentication logic here
          if (email === 'demo@demo.com' && password === 'password') {
            return { id: '1', name: 'Demo User', email: 'demo@demo.com' };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
