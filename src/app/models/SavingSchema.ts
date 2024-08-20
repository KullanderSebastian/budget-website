import mongoose, { Document, Model, Schema } from "mongoose";

interface ISaving extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    amount: number;
    target_amount?: number;
    is_completed: boolean;
    currency: string;
    goal: string;
    recurring: boolean;
    created_at: Date;
    updated_at: Date;
}

const SavingSchema: Schema<ISaving> = new Schema({
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
    target_amount: {
        type: Number,
        min: 0,
        required: false,
    },
    is_completed: {
        type: Boolean,
        default: false,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    recurring: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

const Saving: Model<ISaving> = mongoose.models.Saving || mongoose.model<ISaving>("Saving", SavingSchema);
export default Saving;