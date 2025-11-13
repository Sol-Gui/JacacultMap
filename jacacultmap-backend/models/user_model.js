import mongoose from "mongoose";
import Counter from "./counter_model.js";

const UserSchema = new mongoose.Schema({
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
    provider: {
        type: String,
        required: true,
        default: 'local',
        enum: ['local', 'google']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'event-manager', 'admin']
    },
    profilePicture: {
        imageBase64: { 
            type: String, 
            required: true,
            default: 'NO-IMAGE'
        },
    },
    favoritedEventsById: {
        type: [Number],
        default: [],
        validate: {
            validator: function(arr) {
                return arr.every(id => Number.isInteger(id) && id > 0);
            },
            message: 'IDs de eventos favoritos devem ser números inteiros positivos'
        }
    },
    favoritedCategories: {
        type: [String],
        default: [],
        validate: {
            validator: function(arr) {
                return arr.every(cat => typeof cat === 'string' && cat.trim() !== '');
            },
            message: 'Categorias não devem ser strings vazias'
        }
    },
    friends: {
        type: [String],
        default: [],
        validate: {
            validator: function(arr) {
                return arr.every(friend => typeof friend === 'string' && friend.trim() !== '');
            },
            message: 'Amigos não devem ser strings vazias'
        }
    },
    id: {
        type: Number,
        unique: true,
        sparse: true,
        validate: {
            validator: function(value) {
                return value === undefined || (Number.isInteger(value) && value > 0);
            },
            message: 'ID do usuário deve ser um número inteiro positivo'
        }
    }
});

UserSchema.pre('save', async function(next) {
    try {
        if (this.id === undefined || this.id === null) {
            const counter = await Counter.findOneAndUpdate(
                { model: 'Users' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = counter.seq;
        }
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model("Users", UserSchema);

export default User;