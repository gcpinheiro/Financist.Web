import { inject, Injectable, signal } from '@angular/core';
import { finalize, Observable, of, tap } from 'rxjs';
import { ChatMessage } from './models/chat-message.model';
import { AiService } from './services/ai.service';

const DEFAULT_SYSTEM_PROMPT =
  'Você é um assistente financeiro que ajuda o usuário a entender seus gastos, receitas e metas. Seja claro, direto e útil.';

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private readonly aiService = inject(AiService);
  private readonly messagesState = signal<ChatMessage[]>([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'Olá! Sou seu assistente financeiro. Posso ajudar você a entender gastos, receitas e metas com respostas claras e objetivas.',
      timestamp: new Date().toISOString()
    }
  ]);

  readonly messages = this.messagesState.asReadonly();
  readonly loading = signal(false);

  sendMessage(content: string): Observable<string> {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      return of('Digite uma pergunta antes de enviar.');
    }

    const userMessage = this.buildMessage('user', normalizedContent);
    this.messagesState.set([...this.messagesState(), userMessage]);
    this.loading.set(true);

    return this.aiService.sendMessage(normalizedContent, DEFAULT_SYSTEM_PROMPT).pipe(
      tap((responseContent) => {
        this.messagesState.set([...this.messagesState(), this.buildAssistantMessage(responseContent)]);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  handleError(): void {
    this.messagesState.set([
      ...this.messagesState(),
      this.buildAssistantMessage('Erro ao consultar o assistente. Tente novamente.')
    ]);
  }

  clearConversation(): void {
    this.messagesState.set([
      {
        id: 'assistant-reset',
        role: 'assistant',
        content: 'Conversa reiniciada. Pergunte sobre gastos, receitas ou metas para continuar.',
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
}
