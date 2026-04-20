export interface ChatRequest {
  message: string;
  systemPrompt?: string;
}

export interface ChatResponse {
  content: string;
}
