import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from "bcrypt";
import clientPromise from '@/app/lib/mongodbAdapter';
import dotenv from "dotenv";

dotenv.config();

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB);
                const user = await db.collection("users").findOne({
                    email: credentials?.email,
                });

                if (user && !user.password) {
                    throw new Error("Invalid username or password");
                }

                if (user && credentials?.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) {
                        return { id: user._id.toString(), email: user.email };
                    }
                }
                return null;
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session, token }) {
            session.userId = token.sub;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async redirect({ url, baseUrl}) {
            return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : url;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/signin"
    },
});