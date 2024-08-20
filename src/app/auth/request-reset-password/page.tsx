"use client";
import { useState } from "react";

export default function requestResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleRequestResetPassword = async () => {
        const response = await fetch("/api/auth/request-reset-password", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setMessage(data.message);
        setEmail("");
    };

    return (
        <div>
            <h1>Reset your password</h1>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRequestResetPassword}>Request Password Reset</button>
            {message}
        </div>
    );
}