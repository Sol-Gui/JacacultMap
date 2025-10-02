import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl
//const API_URL = 'http://localhost:3000';

export async function getEvent(id: number) {
  try {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

export async function getLimitedEvents(limit: number, page: number) {
  try {
    console.log(`Fetching events with limit=${limit} and page=${page}`);
    const response = await axios.get(`${API_URL}/events?limit=${limit}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching limited events:', error);
    throw error;
  }
}

export async function sendEvent(eventData: {
  title: string;
  description: string;
  id: number;
  creator_email: string;
  date: Date;
  location_type: string;
  location_coordinates: [number, number];
  event_type: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/send-event`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error sending event:', error);
    throw error;
  }
}