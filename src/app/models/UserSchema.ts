import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name?: string;
    email: string;
    password?: string;
    image?: string;
    googleId?: string;
    emailVerified?: boolean;
    currency: string;
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: function(this: IUser) {
            return !!this.googleId;
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function(this: IUser) {
            return !this.googleId;
        },
    },
    image: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
    },
    emailVerified: {
        type: Boolean,
        default: function(this: IUser) {
            return this.googleId ? true : false;
        },
        required: true,
    },
    currency: {
        type: String,
        default: "USD",
        enum: ["SEK", "USD", "EUR"],
    }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;