import conf from '@/lib/conf/conf';
import myInterceptor from '@/lib/interceptor';
import axios from 'axios';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials ?? {};

        try {
          const response = await axios.post(`${conf.API_GATEWAY}/auth/sign-in`, {
            identifier: identifier,
            password: password
          });
         

          if (response.data?.status === 200 && response.data?.jwt && response.data?.user) {
            const { jwt, user } = response.data;
     
            return {
              ...user,
              token: jwt,
            };
          }

         console.log("upper sectin details not verified");
          return null;
        } catch (error:any) {
            console.log(error.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60,
  },
  pages: {
    signIn: '/sign-in',
    error:undefined
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          uid: user.uid,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role?.name ?? 'user', 
        };
        token.exp = Math.floor(Date.now() / 1000) + 5 * 60;
      }
  
      return token;
    },
    async session({ session, token }):Promise<any> {
        const currentTime = Math.floor(Date.now() / 1000);
      
       
        const tokenWithExp = token as typeof token & { exp?: number };
      

        if (tokenWithExp.exp && currentTime > tokenWithExp.exp) {
          return null;
        }
      
        if (tokenWithExp.user) {
          session.user = tokenWithExp.user;
        }
      
        session.accessToken = tokenWithExp.accessToken as string;
        return session;
      }
      
  }
  
};
