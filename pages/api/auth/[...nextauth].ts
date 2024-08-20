import NextAuth, { NextAuthOptions, Session, SessionStrategy, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import connectToDatabase from '@/app/lib/mongodb';
import bcrypt from "bcrypt";
import clientPromise from '@/app/lib/mongodbAdapter';
import dotenv from "dotenv";
import User from '@/app/models/UserSchema';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';

dotenv.config();

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();

                const user = await User.findOne({ email: credentials?.email });

                if (user && !user.password) {
                    throw new Error("Invalid credentials");
                }

                if (user && credentials?.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password as string);
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
        async signIn({ user, account, profile }: { user: NextAuthUser | AdapterUser; account: any; profile?: any }) {
            if (account?.provider === "google") {
                await connectToDatabase();
                const existingUser = await User.findOne({ email: user.email});

                if (existingUser && !existingUser.googleId) {
                    existingUser.googleId = account?.providerAccountId;
                    await existingUser.save();
                } else if (!existingUser) {
                    const newUser = new User({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: account?.providerAccountId,
                        emailVerified: true,
                    });
                    await newUser.save();
                }
            }

            return true;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            const user = await User.findById(token.sub);

            if (user) {
                (session.user as any).emailVerified = user.emailVerified;
            }

            session.userId = token.sub;
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : url;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/signin"
    },
};

export default NextAuth(authOptions);