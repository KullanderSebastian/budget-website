"use client";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

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
            <h1>Welcome to the dashboard</h1>
            <LogoutButton />
        </div>
    );
}