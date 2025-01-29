export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  chat_id: string;
}

export interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  expires_at: string;
}