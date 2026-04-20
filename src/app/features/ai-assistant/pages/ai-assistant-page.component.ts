import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AiAssistantService } from '../ai-assistant.service';
import { ChatContainerComponent } from '../components/chat-container/chat-container.component';
import { ChatHeaderComponent } from '../components/chat-header/chat-header.component';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-ai-assistant-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ChatHeaderComponent, ChatContainerComponent, ChatInputComponent],
  templateUrl: './ai-assistant-page.component.html',
  styleUrl: './ai-assistant-page.component.scss'
})
export class AiAssistantPageComponent {
  private readonly aiAssistantService = inject(AiAssistantService);

  protected readonly messages = this.aiAssistantService.messages;
  protected readonly loading = this.aiAssistantService.loading;

  protected sendMessage(content: string): void {
    this.aiAssistantService
      .sendMessage(content)
      .pipe(
        catchError(() => {
          this.aiAssistantService.handleError();
          return EMPTY;
        })
      )
      .subscribe();
  }

  protected clearConversation(): void {
    this.aiAssistantService.clearConversation();
  }
}
