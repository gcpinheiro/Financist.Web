import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  providers: [DatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  readonly message = input.required<ChatMessage>();

  constructor(private readonly datePipe: DatePipe) {}

  protected formattedTime(): string {
    return this.datePipe.transform(this.message().timestamp, 'HH:mm') ?? '';
  }
}
