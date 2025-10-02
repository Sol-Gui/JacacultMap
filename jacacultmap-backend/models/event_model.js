import mongoose from "mongoose";
import { getUserRoleByEmail } from "../services/userService.js";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        default: 'Evento sem título'
    },
    description: {
        type: String,
        default: 'Descrição não fornecida'
    },
    event_type: {
        type: String,
        required: true,
        enum: ['social', 'turistico', 'intelectual'], // ADICIONAR MAIS TIPOS DEPOIS
        default: 'social'
    },
    id: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value > 0;
            },
            message: 'ID do evento deve ser um número inteiro positivo'
        }
    },
    creator_email: {
        type: String,
        required: true,
        validate: {
            validator: async function(value) {
                let regexStatus = false;
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                regexStatus = emailRegex.test(value);

                const userRole = await getUserRoleByEmail(value);
                
                if (regexStatus == true && (userRole.role == 'admin' || userRole.role == 'event-manager')) {
                    return true;
                }

                return false;
            },
            message: 'Email inválido'
        }
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length === 2;
                },
                message: 'Coordenadas devem ter exatamente dois números: [longitude, latitude]'
            }
        }
    }
});


EventSchema.index({ location: '2dsphere' });

const Event = mongoose.model("Events", EventSchema);

export default Event;