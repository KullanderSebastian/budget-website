"use client";
import { signIn } from 'next-auth/react';
import { useSearchParams } from "next/navigation";

export default function SignIn() {
    const searchParams = useSearchParams();
    const error = searchParams ? searchParams.get("error") : null;

    const getErrorMessage = (error: string | string[] | undefined) => {
        if (error) {
            return "Invalid credentials. Please try again.";
        }

        return "";
    }

    return (
        <div>
            <h1>Sign In</h1>
            {error && <div style={{ color: "red" }}>{getErrorMessage(error)}</div>}
            <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Sign in with Google</button>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const email = e.currentTarget.email.value;
                    const password = e.currentTarget.password.value;
                    await signIn('credentials', { 
                        email, 
                        password,
                        callbackUrl: "/dashboard",
                     });
                }}
            >
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Sign in with Email</button>
            </form>
            <p>
                Don't have an account? <a href="/auth/signup">Sign up</a>
            </p>
            <p>
                Forgot your password? <a href="/auth/request-reset-password">Click here</a>
            </p>
        </div>
    );
}