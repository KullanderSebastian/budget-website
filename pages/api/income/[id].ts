import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "@/app/lib/mongodb";
import Income from "@/app/models/IncomeSchema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { method } = req;
    const { id } = req.query;

    await connectToDatabase();

    switch (method) {
        case "GET":
            try {
                const income = await Income.findById(id);

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
                const income = await Income.findByIdAndUpdate(id, req.body, {
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
                const deletedIncome = await Income.deleteOne({ _id: id });
                
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