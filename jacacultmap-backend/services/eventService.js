import { connectToDatabase } from "./database.js";
import { getUserRoleByEmail } from "./userService.js";
import Event from '../models/event_model.js'
import { verifyToken } from './authService.js';

export async function createEvent({
    title, description, event_type, event_image_banner, event_image_header, event_images, id, creator_token, date,
    location_name, location_coordinates
}) {
    await connectToDatabase();
    const creator_email = await verifyToken(creator_token);
    console.log("token do criador:", creator_token);
    if (!creator_email) {
        throw new Error('Token inválido ou expirado. Por favor, faça login novamente.');
    }
    try {

        if (!title || !description || !event_type || !id || !creator_email || !date || !location_name || !location_coordinates) {
            throw new Error("Todos os campos são obrigatórios para criar um evento.");
        }

        const userRole = await getUserRoleByEmail(creator_email);
        if (userRole.role !== 'admin' && userRole.role !== 'event-manager') {
            throw new Error('Apenas administradores e gerentes de eventos podem criar eventos.');
        }

        const eventData = {
            title,
            description,
            event_type,
            event_image_banner,
            event_image_header,
            event_images,
            id,
            creator_email,
            date,
            location: {
                name: location_name,
                coordinates: location_coordinates
            }
        }
        
        const event = new Event(eventData);
        await event.save();
        console.log("evento criado: ", event);
        return event;
    } catch (error) {
        console.error("Erro ao criar evento:", error.message);
        throw new Error(error.message || "Erro ao criar evento, tente novamente mais tarde.");
    }
}

export async function getEvent({
    id
}) {
    await connectToDatabase();
    try {
        return Event.findOne(
            { id },
            {_id: 0, __v: 0}
        );
    } catch (error) {
        console.error("Erro ao buscar evento:", error.message);
        throw new Error(error.message || "Erro ao buscar evento, tente novamente mais tarde.");
    }
}

export async function getLimitedEvents({ 
    limit = 10, 
    page = 1
}) {
    await connectToDatabase();
    try {
        const skip = (page - 1) * limit;
        
        const events = await Event
            .find({})
            .select('-_id -__v') // Excluir _id e __v do MongoDB
            .sort({ date: -1 }) // Ordenar por data decrescente (mais recente primeiro)
            .limit(limit)
            .skip(skip)
            .lean(); // Retorna objetos JavaScript simples
        
        return events;
        
    } catch (error) {
        console.error('Erro ao buscar eventos limitados:', error.message);
        throw new Error(error.message || 'Erro ao buscar eventos, tente novamente mais tarde.');
    }
}

export async function getTotalEventsCount() {
    await connectToDatabase();
    try {
        const count = await Event.countDocuments({});
        return count;
        
    } catch (error) {
        console.error('Erro ao contar eventos:', error.message);
        throw new Error(error.message || 'Erro ao contar eventos, tente novamente mais tarde.');
    }
}