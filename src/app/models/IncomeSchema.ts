import mongoose, { Document, Model, Schema } from "mongoose";

export interface IIncome extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    source: string;
    created_at: Date;
    updated_at: Date;
}

const IncomeSchema: Schema<IIncome> = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        min: 0,
        required: true,
    },
    currency: {
        type: String,
        default: "USD",
        enum: ["SEK", "USD", "EUR"],
        required: true,
    },
    source: {
        type: String,
        enum: ["salary", "freelance", "investment", "other"],
        required: true,
    },
}, { timestamps: true });

const Income: Model<IIncome> = mongoose.models.Income || mongoose.model<IIncome>("Income", IncomeSchema);
export default Income;