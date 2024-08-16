import mongoose, { Document, Model, Schema } from "mongoose";

interface IExpense extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    type: string;
    category: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

const allowedCategoriesByType: { [key: string]: string[] } = {
    Essentials: ["rent", "mortgage", "utilities", "insurance", "property tax", "healthcare", "childcare", "phone", "internet"],
    "Living costs": ["groceries", "transportation", "entertainment", "clothing", "subscriptions", "pet care"],
    Wants: ["dining out", "hobbies", "shopping", "travel", "fitness"],
    Debt: ["loans", "credit cards", "student loans"]
};

const ExpenseSchema: Schema<IExpense> = new Schema({
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
        enum: ["Essentials", "Living costs", "Wants", "Debt"],
        required: true,
    },
    category: {
        type: String,
        enum: [
            // Essentials
            "rent", "mortgage", "utilities", "insurance", "property tax", "healthcare", "childcare", "phone", "internet",
            // Living costs
            "groceries", "transportation", "entertainment", "clothing", "subscriptions", "pet care",
            // Wants
            "dining out", "hobbies", "shopping", "travel", "fitness",
            // Debt
            "loans", "credit cards", "student loans",
        ],
        validate: {
            validator: function (value: string) {
                // Check if the selected category is valid for the chosen type
                const selectedType = (this as IExpense).type;
                return allowedCategoriesByType[selectedType].includes(value);
            },
            message: (props) => `The category '${props.value}' is not valid for the selected type '${(props as any).instance.type}'`
        },
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
export default Expense;