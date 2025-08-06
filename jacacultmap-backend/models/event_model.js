import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Evento sem título'
    },
    description: {
        type: String,
        default: 'Descrição não fornecida'
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