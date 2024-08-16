import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import connectToDatabase from "@/app/lib/mongodb";
import Saving from "@/app/models/SavingSchema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = session.userId;

    const { method } = req;

    await connectToDatabase();

    switch (method) {
        case "GET":
            try {
                const incomes = await Saving.find({ user_id: userId });
                res.status(200).json({ success: true, data: incomes });
            } catch (error) {
                console.error(error);
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const income = await Saving.create({ ...req.body, user_id: userId });
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