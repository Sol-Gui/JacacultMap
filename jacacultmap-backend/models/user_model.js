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
    }
}));

export default User;