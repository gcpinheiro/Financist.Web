import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/api/api.service';
import { ChatRequest, ChatResponse } from '../models/ai-chat.models';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly api = inject(ApiService);

  sendMessage(message: string, systemPrompt?: string): Observable<string> {
    const payload: ChatRequest = {
      message,
      systemPrompt
    };

    return this.api.post<ChatResponse, ChatRequest>('/ai/chat', payload).pipe(map((response) => response.content));
  }
}
