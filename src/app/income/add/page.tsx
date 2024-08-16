"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddIncome() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [source, setSource] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/income", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                currency,
                source,
                date: new Date(),
            }),
        });

        if (res.ok) {
            router.push("/income");
        }
    };

    return (
        <div>
            <h1>Add New Income</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="SEK">SEK</option>
                </select>
                <button type="submit">Add Income</button>
            </form>
        </div>
    );
}