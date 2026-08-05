// Shared domain types and theme helpers used by the app screens.
export const baseDark = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  primary: '#10B981'
};

export const baseLight = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#10B981'
};

export const ACCENTS = {
  emerald: '#10B981',
  blue: '#3B82F6',
  violet: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
};

export interface Category {
  id: string;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_image_banner: { imageBase64: string; imageFormat: string };
  event_image_header: { imageBase64: string; imageFormat: string };
  event_images: { imageBase64: string; imageFormat: string }[];
  creator_email: string;
  location: { name: String; type: String; coordinates: [number, number] };
  date: string;
  event_type: string;
}

export interface User {
  name: string;
  email: string;
}

export const getCategoryStyles = (categoryId: string) => {
  switch (categoryId) {
    case 'intelectual': return { bg: '#DCFCE7', fg: '#166534' };
    case 'turistico': return { bg: '#DBEAFE', fg: '#1E40AF' };
    case 'social': return { bg: '#F3E8FF', fg: '#6B21A8' };
    case 'gastronomico': return { bg: '#FFEDD5', fg: '#C2410C' };
    case 'fisico': return { bg: '#E0E7FF', fg: '#3730A3' };
    case 'virtual': return { bg: '#E0F2FE', fg: '#0369A1' };
    case 'artistico': return { bg: '#FCE7F3', fg: '#9D174D' };
    default: return { bg: '#F3F4F6', fg: '#374151' };
  }
};
