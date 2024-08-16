import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import connectToDatabase from "@/app/lib/mongodb";
import Expense from "@/app/models/ExpenseSchema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { method } = req;
    const { id } = req.query;

    await connectToDatabase();

    switch (method) {
        case "GET":
            try {
                const income = await Expense.findById(id);

                if (!income) {
                    return res.status(404).json({ success: false });
                }

                res.status(200).json({ success: true, data: income });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
            break;
        case "PUT":
            try {
                const income = await Expense.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!income) {
                    return res.status(404).json({ success: false });
                }

                res.status(200).json({ success: true, data: income });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
            break;
        case "DELETE":
            try {
                const deletedIncome = await Expense.deleteOne({ _id: id });
                
                if (!deletedIncome) {
                    return res.status(404).json({ success: false });
                }

                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}