import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  effect,
  input,
  untracked,
  viewChild
} from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss'
})
export class ChatContainerComponent implements AfterViewInit {
  readonly messages = input.required<ChatMessage[]>();
  readonly loading = input(false);

  private readonly scrollHost = viewChild<ElementRef<HTMLDivElement>>('scrollHost');

  constructor() {
    effect(() => {
      this.messages();
      this.loading();
      untracked(() => queueMicrotask(() => this.scrollToBottom()));
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.scrollToBottom());
  }

  private scrollToBottom(): void {
    const host = this.scrollHost()?.nativeElement;

    if (!host) {
      return;
    }

    host.scrollTo({
      top: host.scrollHeight,
      behavior: 'smooth'
    });
  }
}
