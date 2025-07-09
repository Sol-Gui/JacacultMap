import mongoose from "mongoose";

const User = mongoose.model("Users", new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    provider: String
}));
export default User;