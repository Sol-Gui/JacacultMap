import { createEvent, getEvent, getLimitedEvents, getTotalEventsCount } from '../services/eventService.js';

export async function createEventController(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de autorização não fornecido' });
    }
    
    const creator_token = authHeader.split(' ')[1];
    if (!creator_token) {
      return res.status(401).json({ message: 'Token de autorização inválido' });
    }

    const {
      title, description, event_type, event_image_banner, event_image_header,
      event_images, id, date, location_name, location_coordinates
    } = req.body;

    if (!title || !description || !event_type || !id || !date || !location_coordinates) {
      return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' });
    }

    const newEvent = await createEvent({
      title,
      description,
      event_type,
      event_image_banner,
      event_image_header,
      event_images,
      id,
      creator_token,
      date,
      location_name,
      location_coordinates
    });
    
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ message: 'Erro interno ao criar evento' });
  }
}

export async function getEventController(req, res) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID do evento é obrigatório' });
    }

    const event = await getEvent({ id });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.status(200).json({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      event_image_banner: event.event_image_banner,
      event_image_header: event.event_image_header,
      event_images: event.event_images,
      id: event.id,
      creator_email: event.creator_email,
      date: event.date,
      location: event.location
    });

  } catch (error) {
    console.error('Erro ao buscar evento:', error.message);
    res.status(500).json({
      message: error.message || 'Erro ao buscar evento, tente novamente mais tarde.'
    });
  }
}

export async function getLimitedEventsController(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    
    const events = await getLimitedEvents({ limit, page });
    const totalEvents = await getTotalEventsCount();
    
    res.status(200).json({
      events,
      pagination: {
        total: totalEvents,
        limit,
        page,
        totalPages: Math.ceil(totalEvents / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar eventos limitados:', error.message);
    res.status(500).json({
      message: error.message || 'Erro ao buscar eventos, tente novamente mais tarde.'
    });
  }
}