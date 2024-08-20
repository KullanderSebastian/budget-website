"use client";
import { Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import IsEmailVerified from "../components/IsEmailVerified";
import ResendVerificationEmail from "../components/ResendVerificationEmail";

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        async function checkSession() {
            const session = await getSession();
            
            if (!session) {
                router.push("/auth/signin");
            } else {
                setSession(session);
            }
            setLoading(false);
        }

        checkSession();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <SessionProvider>
                <IsEmailVerified />
            </SessionProvider>
            <h1>Welcome to the dashboard</h1>
            <LogoutButton />
        </div>
    );
}