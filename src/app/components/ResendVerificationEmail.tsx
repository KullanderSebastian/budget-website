import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type ExtendedSession = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        emailVerified?: boolean;
    }
}

export default function ResendVerificationEmail() {
    const [message, setMessage] = useState(<p>loading...</p>);


    const { data: session } = useSession();

    const extendedSession = session as ExtendedSession;

    const resendVerificationEmail = async () => {
        try {
            const response = await fetch("/api/auth/resend-verification-email", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ email: extendedSession?.user?.email })
            });

            const data = await response.json();
            setMessage(data.message || "Verification email sent. Please check your inbox.");
        } catch (error) {
            console.error("Error resending verification email: ", error);
            setMessage(<p>An error occurred while resending the verification email.</p>);
        }
    }

    useEffect(() => {
        setMessage(<p>If you dont see an email or if your token has expired click <span onClick={resendVerificationEmail}>here</span> to resend the verification email.</p>);
    }, [extendedSession?.user?.email]);

    return (
        <div>
            {message}
        </div>
    );
}