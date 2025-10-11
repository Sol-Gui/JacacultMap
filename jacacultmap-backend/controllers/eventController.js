import { createEvent, getEvent, getLimitedEvents, getTotalEventsCount } from '../services/eventService.js';

export async function createEventController(req, res) {
  const {
    title, description, event_type, event_image, id, date,
    location_type, location_coordinates
  } = req.body;

  const { creator_token } = req.headers.authorization?.split(' ')[1]

  await createEvent({
    title, description, event_type, event_image, id, creator_token, 
    date, location_type, location_coordinates})
    .then(event => {
      res.status(201).json({
        message: 'Evento criado com sucesso',
        event: event
      });
    })
    .catch(error => {
      console.error('Erro ao criar evento:', error.message);
      res.status(500).json({
        message: error.message || 'Erro ao criar evento, tente novamente mais tarde.'
      });
    });
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