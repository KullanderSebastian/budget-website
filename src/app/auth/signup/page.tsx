"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/app/validation/signUpSchema";
import * as yup from "yup";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touchedFields, setTouchedFields] = useState<{ email?: boolean, password?: boolean, confirmPassword?: boolean }>({})
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState<{ email?: string, password?: string, confirmPassword?: string }>({});
    const router = useRouter();

    const validateField = async (field: string, value: string) => {
        try {
            await SignUpSchema.validateAt(field, { [field]: value });
            setFormErrors((prevErrors) => ({ ...prevErrors, [field]: ""}));
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setFormErrors((prevErrors) => ({ ...prevErrors, [field]: err.message }));
            }
        }
    };

    const handleBlur = (field: string) => {
        setTouchedFields((prev) => ({ ...prev, [field]: true }));
        validateField(field, getFieldValue(field));
    }

    const handleChange = (field: keyof typeof touchedFields, value: string) => {
        setFormFieldValue(field, value);
        if (touchedFields[field]) {
            validateField(field, value);
        }
    }

    const setFormFieldValue = (field: string, value: string) => {
        switch (field) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    const getFieldValue = (field: string) => {
        switch (field) {
            case "email":
                return email;
            case "password":
                return password;
            case "confirmPassword":
                return confirmPassword;
            default:
                return "";
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setFormErrors({ confirmPassword: "Passwords must match" });
            return;
        }

        try {
            await SignUpSchema.validate({ email, password, confirmPassword }, { abortEarly: false });

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (res.ok) {
                router.push("/auth/signin");
            } else {
                const data = await res.json();
                setError(data.message);
            }
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors:  { email?: string, password?: string, confirmPassword?: string } = {};
                err.inner.forEach((validationError) => {
                    const path = validationError.path as keyof typeof errors;
                    if (path) {
                        errors[path] = validationError.message;
                    }
                });
                setFormErrors(errors)
            }
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    required
                />
                {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    required
                />
                {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
                <input
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    required
                />
                {formErrors.confirmPassword && <p style={{ color: "red" }}>{formErrors.confirmPassword}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
      );
}