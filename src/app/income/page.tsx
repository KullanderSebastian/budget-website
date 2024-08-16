"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IIncome } from "@/app/models/IncomeSchema"

export default function incomeList() {
    const [incomes, setIncomes] = useState<IIncome[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchIncomes() {
            const res = await fetch("/api/income");
            const data = await res.json();
            if (data.success) {
                setIncomes(data.data);
            }
        }

        fetchIncomes();
    }, []);

    const handleDelete = async (id: string) => {
        await fetch(`/api/income/${id}`, {
            method: "DELETE",
        });
        setIncomes(incomes.filter(income => income._id.toString() !== id));
    };

    return (
        <div>
            <h1>Income Records</h1>
            <button onClick={() => router.push("/income/add")}>Add Income</button>
            <ul>
                {incomes.map(income => (
                    <li key={income._id.toString()}>
                        {income.source}: {income.amount} {income.currency}
                        <button onClick={() => router.push(`/income/edit/${income._id}`)}>Edit</button>
                        <button onClick={() => handleDelete(income._id.toString())}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}