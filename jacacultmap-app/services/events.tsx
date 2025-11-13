import axios from 'axios';
import Constants from 'expo-constants';
import { getData } from './localStorage';

const API_URL = Constants.expoConfig?.extra?.apiUrl
//const API_URL = "http://localhost:3000";

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
  event_type: string;
  event_image_banner: {
    imageBase64: string;
  };
  event_image_header: {
    imageBase64: string;
  };
  event_images: {
    imageBase64: string[];
  };
  date: Date;
  location_name?: string;
  location_coordinates: [number, number];
}) {
  try {
    const token = await getData('userToken');
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;

    const response = await axios.post(`${API_URL}/send-event`, eventData, config);
    return response.data;
  } catch (error) {
    console.error('Error sending event:', error);
    throw error;
  }
}