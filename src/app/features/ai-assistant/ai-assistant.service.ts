import { inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api/api.service';
import { AiChatRequest, AiChatResponse } from './models/ai-chat.models';
import { ChatMessage } from './models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private readonly api = inject(ApiService);
  private readonly messagesState = signal<ChatMessage[]>([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'Hello. I am your Financist assistant. I can help summarize spending, prepare financial questions, and guide your next actions.',
      timestamp: new Date().toISOString()
    }
  ]);

  readonly messages = this.messagesState.asReadonly();
  readonly loading = signal(false);

  sendMessage(content: string): Observable<AiChatResponse> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      return of({
        message: this.buildAssistantMessage('Please type a message before sending.')
      });
    }

    const userMessage = this.buildMessage('user', normalizedContent);
    const history = [...this.messagesState(), userMessage];

    this.messagesState.set(history);
    this.loading.set(true);

    const request: AiChatRequest = {
      message: normalizedContent,
      history
    };

    const request$ = environment.useMockAiAssistant
      ? of({
          message: this.buildAssistantMessage(this.buildMockReply(normalizedContent, history))
        }).pipe(delay(750))
      : this.api.post<AiChatResponse, AiChatRequest>('/ai/chat', request);

    return request$.pipe(
      tap((response) => {
        this.messagesState.set([...this.messagesState(), response.message]);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  clearConversation(): void {
    this.messagesState.set([
      {
        id: 'assistant-reset',
        role: 'assistant',
        content:
          'Conversation cleared. Ask me for a summary, cashflow insight, or help drafting a finance action plan.',
        timestamp: new Date().toISOString()
      }
    ]);
  }

  private buildMessage(role: ChatMessage['role'], content: string): ChatMessage {
    return {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role,
      content,
      timestamp: new Date().toISOString()
    };
  }

  private buildAssistantMessage(content: string): ChatMessage {
    return this.buildMessage('assistant', content);
  }

  private buildMockReply(content: string, history: ChatMessage[]): string {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('expense') || lowerContent.includes('spend')) {
      return 'Your spending question is noted. This chat foundation is ready to connect to real finance analytics later, and for now I can help frame category-level reviews and next actions.';
    }

    if (lowerContent.includes('goal') || lowerContent.includes('save')) {
      return 'A useful next step is to compare current goal progress with monthly free cashflow and define whether contributions should be fixed, percentage-based, or event-driven.';
    }

    if (lowerContent.includes('transaction') || lowerContent.includes('ledger')) {
      return 'For transaction analysis, I would typically group recent movement by category, payment method, and status before surfacing anomalies or summarizing trends.';
    }

    return `I received your message "${content}". The modular chat service is using a simple request-response contract and is ready for the future POST /api/v1/ai/chat backend endpoint. This conversation currently contains ${history.length} message${history.length === 1 ? '' : 's'}.`;
  }
}
