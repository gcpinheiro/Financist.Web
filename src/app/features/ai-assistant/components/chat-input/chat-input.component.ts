import { FormsModule } from '@angular/forms';
import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  readonly loading = input(false);
  readonly messageSubmitted = output<string>();
  protected readonly draft = signal('');
  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  protected submit(): void {
    const message = this.draft().trim();

    if (!message || this.loading()) {
      return;
    }

    this.messageSubmitted.emit(message);
    this.draft.set('');
    queueMicrotask(() => this.resizeTextarea());
  }

  protected updateDraft(message: string): void {
    this.draft.set(message);
    queueMicrotask(() => this.resizeTextarea());
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  private resizeTextarea(): void {
    const element = this.textarea()?.nativeElement;

    if (!element) {
      return;
    }

    element.style.height = '0';
    element.style.height = `${Math.min(element.scrollHeight, 240)}px`;
    element.style.overflowY = element.scrollHeight > 240 ? 'auto' : 'hidden';
  }
}
