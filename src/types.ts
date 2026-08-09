export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  tokens?: number;
  status?: 'sending' | 'thinking' | 'done' | 'error';
  attachment?: {
    type: 'image' | 'file';
    name: string;
    url?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  model: string;
  isPinned?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  selectedModel: string;
  systemInstruction: string;
  temperature: number;
  autoScroll: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  createdAt: string;
  usageCount?: number;
  usageLimit?: number;
  role?: 'user' | 'admin' | 'premium';
  preferences?: {
    theme?: 'dark' | 'light';
    selectedModel?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isPaid?: boolean;
}
