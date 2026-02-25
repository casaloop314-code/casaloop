export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'sale' | 'rent';
  category: 'house' | 'apartment' | 'land' | 'shop';
  status?: 'active' | 'inactive'; // inactive = sold/rented
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  imageUrl?: string;
  images?: string[]; // Multiple images for gallery
  userId: string;
  username: string;
  sellerName: string; // Pi Network username of the seller
  views?: number; // View counter
  createdAt: number;
  verified?: boolean; // Verification badge
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Number of reviews
  latitude?: number; // For map integration
  longitude?: number; // For map integration
}

export interface User {
  uid: string;
  username: string;
  casaPoints: number;
  lastClaimDate?: number;
  createdAt: number;
  favorites?: string[]; // Array of property IDs
}

export interface Reservation {
  id: string;
  userId: string;
  username: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyLocation: string;
  reservationDate: number;
  status: 'reserved' | 'completed' | 'cancelled';
  paymentId?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  username: string;
  rating: number; // 1-5 stars
  comment: string;
  images?: string[]; // Photo reviews
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  receiverId: string;
  receiverUsername: string;
  propertyId?: string; // Optional - for property inquiries
  message: string;
  read: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  participantNames: string[]; // Array of usernames
  lastMessage: string;
  lastMessageTime: number;
  propertyId?: string;
  propertyTitle?: string;
  unreadCount: Record<string, number>; // userId: count
}

export type ServiceCategory = 
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'painter'
  | 'cleaner'
  | 'landscaper'
  | 'hvac'
  | 'roofing'
  | 'locksmith'
  | 'pest-control'
  | 'handyman'
  | 'mason'
  | 'welder'
  | 'tiler'
  | 'other';

export interface ServiceProvider {
  id: string;
  userId: string;
  username: string;
  title: string;
  category: ServiceCategory;
  description: string;
  pricePerHour: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  experience: string; // e.g., "5 years"
  availability: string; // e.g., "Mon-Fri, 9AM-5PM"
  skills: string[]; // Array of specific skills
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  views?: number;
  createdAt: number;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerUsername: string;
  clientId: string;
  clientUsername: string;
  bookingDate: number;
  scheduledDate: number;
  hours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
  notes?: string;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  providerId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: number;
}
