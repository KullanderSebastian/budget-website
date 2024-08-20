import { useSession } from "next-auth/react";
import ResendVerificationEmail from "./ResendVerificationEmail";

type ExtendedSession = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        emailVerified?: boolean;
    }
}

export default function IsEmailVerified() {
    const { data: session } = useSession();

    const extendedSession = session as ExtendedSession;

    return (
        <div>
            {extendedSession?.user?.emailVerified ? <div></div> : (
                <div>
                    <p>Please verify your email. Accounts with an unverified email with be removed after 7 days.</p>
                    <ResendVerificationEmail />
                </div>
            )}
        </div>
    );
}