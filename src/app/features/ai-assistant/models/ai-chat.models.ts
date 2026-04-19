import { ChatMessage } from './chat-message.model';

export interface AiChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface AiChatResponse {
  message: ChatMessage;
}
