import { serverEnv } from '@/config/serverEnv';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
    }
    interface User {
        accessToken?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GithubProvider({
            clientId: serverEnv.AUTH_GITHUB_ID,
            clientSecret: serverEnv.AUTH_GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user user:email repo admin:org admin:org_hook',
                },
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user, account }) => {
            if (account?.provider === 'github') {
                user.accessToken = account.access_token;
            }
            return true;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, user, account }) {
            if (account?.provider === 'github') {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
});
