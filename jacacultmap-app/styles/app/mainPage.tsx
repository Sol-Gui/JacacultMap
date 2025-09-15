// Shared types and constants for the main page

// Types
export interface Category {
  id: string;
  name: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  category: string;
}

export interface User {
  name: string;
  email: string;
}

// Base themes (primary will be injected dynamically)
export const baseLight = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export const baseDark = {
  background: '#0B1220',
  card: '#111827',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#1F2937',
};

// Accent palette
export const ACCENTS = {
  emerald: '#10B981',
  indigo: '#6366F1',
  orange: '#F59E0B',
  rose: '#F43F5E',
};

// Category color utils
export const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'intelectual':
      return { bg: '#DBEAFE', fg: '#1E40AF' };
    case 'turistico':
      return { bg: '#FED7AA', fg: '#EA580C' };
    case 'social':
      return { bg: '#E9D5FF', fg: '#7C3AED' };
    default:
      return { bg: '#F3F4F6', fg: '#374151' };
  }
};


