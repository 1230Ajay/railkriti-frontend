// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      uid: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User extends DefaultUser {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: {
      name: string;
    };
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: {
      uid: string;
      email: string;
      name: string;
      role: string;
    };
  }
}
