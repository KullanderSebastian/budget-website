import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/app/lib/mongodb";
import Income from "@/app/models/IncomeSchema";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = session.userId;

    const { method } = req;

    await connectToDatabase();

    switch (method) {
        case "GET":
            try {
                const incomes = await Income.find({ user_id: userId });
                res.status(200).json({ success: true, data: incomes });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const income = await Income.create({ ...req.body, user_id: userId });
                res.status(201).json({ success: true, data: income });
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