"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditIncome() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [source, setSource] = useState("");
    const router = useRouter();
    const params = useParams();

    const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

    useEffect(() => {
        async function fetchIncome() {
            const res = await fetch(`/api/income/${id}`);
            const data = await res.json();
            if (data.success) {
                setAmount(data.data.amount);
                setCurrency(data.data.currency);
                setSource(data.data.source);
            }
        }

        fetchIncome();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/income/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                currency,
                source,
            }),
        });

        if (res.ok) {
            router.push("/income");
        }
    };

    return (
        <div>
            <h1>Edit Income</h1>
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
                <button type="submit">Update Income</button>
            </form>
        </div>
    );
}