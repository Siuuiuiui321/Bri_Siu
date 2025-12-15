
export interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  tags: string[];
  mapQuery: string;
  imageUrl?: string;
  matchType?: 'match' | 'wildcard';
}

export interface DayPlan {
  date: string;
  activities: Activity[];
}

export interface TripContext {
  destination: string;
  startDate: string;
  endDate: string;
  interests: string[];
  approvedActivities: Activity[];
}

export enum AppStep {
  SETUP = 'SETUP',
  DISCOVERY = 'DISCOVERY',
  ITINERARY = 'ITINERARY'
}

export const INTEREST_OPTIONS = [
  { value: 'food', label: 'Food & Gastronomy', icon: '🍕' },
  { value: 'art', label: 'Art & Museums', icon: '🎨' },
  { value: 'nature', label: 'Nature & Outdoors', icon: '🌿' },
  { value: 'nightlife', label: 'Nightlife & Bars', icon: '🌙' },
  { value: 'history', label: 'History & Culture', icon: '🏛️' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'coffee', label: 'Coffee Shops', icon: '☕' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'romantic', label: 'Romantic Spots', icon: '💕' },
  { value: 'tech', label: 'Tech & Modernity', icon: '💻' },
];
