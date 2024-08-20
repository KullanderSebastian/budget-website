"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");

    if (!token) {
        return <div>No token found</div>;
    }

    const [message, setMessage] = useState("Verifying your email...");
    const isEffectExecuted = useRef(false);

    useEffect(() => {
        if (!token || isEffectExecuted.current) return;

        isEffectExecuted.current = true;

        fetch(`/api/auth/verify-email?token=${token}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Email verified successfully") {
                    setMessage("Your email has been verified successfully!");
                } else {
                    setMessage(data.message);
                }
            })
            .catch((error) =>  {
                console.error("Error verifying email:", error);
                setMessage("An error has occured while verifying your email.");
            });
    }, [token]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}