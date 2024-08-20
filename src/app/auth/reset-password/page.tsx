"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const router = useRouter();

    if (!token) {
        return <div>No token found</div>;
    }

    const [newPassword, setNewPassword] = useState("");

    const handleResetPassword = async () => {
        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();
        if (data.success) {
            alert(data.message);
            router.push("/auth/signin");
        } else {
            alert(data.message);
        }
    };

    return (
        <div>
            <h1>Reset Your Password</h1>
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Set new password</button>
        </div>
    );
}

