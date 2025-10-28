// Local storage utilities for data persistence
export class LocalStorage {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
}

// Data types
export interface Field {
  id: number;
  name: string;
  capacity: number;
  location: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  bookings: number;
  description?: string;
  amenities?: string[];
}

export interface EventType {
  id: number;
  name: string;
  color: string;
  events: number;
  active: boolean;
  description?: string;
  category?: string;
  subEvents?: string[];
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  contact: string;
  email: string;
  address: string;
  website?: string;
}

export interface ContentPage {
  id: number;
  title: string;
  content: string;
  status: 'Published' | 'Draft';
  lastModified: string;
  slug: string;
}

export interface MediaItem {
  id: number;
  name: string;
  type: 'Image' | 'Document' | 'Video';
  size: string;
  uploaded: string;
  url?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
  views: number;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  portfolioLink?: string;
  address?: string;
  organisation?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  FIELDS: 'admin_eve_fields',
  EVENT_TYPES: 'admin_eve_event_types',
  VENDORS: 'admin_eve_vendors',
  CONTENT_PAGES: 'admin_eve_content_pages',
  MEDIA_ITEMS: 'admin_eve_media_items',
  NEWS_ITEMS: 'admin_eve_news_items',
  STUDENTS: 'admin_eve_students',
} as const;
