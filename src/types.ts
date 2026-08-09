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

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  isPaid?: boolean;
}
