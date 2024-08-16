import mongoose, { Document, Model, Schema } from "mongoose";

interface IInvestment extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    type: string;
    created_at: Date;
    updated_at: Date;
}

const InvestmentSchema: Schema<IInvestment> = new Schema({
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
    type: {
        type: String,
        enum: ["stocks", "bonds", "real estate", "crypto", "mutual funds", "retirement", "other"],
        required: true,
    },
}, { timestamps: true });

const Investment: Model<IInvestment> = mongoose.models.Ivestment || mongoose.model<IInvestment>("Investment", InvestmentSchema);
export default Investment;