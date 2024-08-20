import express from "express";
import cron from "node-cron";
import connectToDatabase from "../../src/app/lib/mongodb";
import User from "../../src/app/models/UserSchema";
import Expense from "../../src/app/models/ExpenseSchema";
import Income from "../../src/app/models/IncomeSchema";
import Investment from "../../src/app/models/InvestmentSchema";
import Saving from "../../src/app/models/SavingSchema";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Cron job server is running");
});

cron.schedule("0 0 * * *", async () => {
    try {
        await connectToDatabase();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const usersToDelete = await User.find({
            emailVerified: false,
            createdAt: { $lte: sevenDaysAgo },
        });

        for (const user of usersToDelete) {
            await Expense.deleteMany({ userId: user._id });
            await Income.deleteMany({ userId: user._id });
            await Investment.deleteMany({ userId: user._id });
            await Saving.deleteMany({ userId: user._id });

            await User.findByIdAndDelete(user._id);
        }

        console.log(`Deleted ${usersToDelete.length} unverified accounts and related documents`);
    } catch (error) {
        console.error("Error deleting unverified accounts:", error);
    }
});

app.listen(PORT, () => {
    console.log(`Cron job server running on port ${PORT}`);
});