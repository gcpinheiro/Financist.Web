import { FormsModule } from '@angular/forms';
import { Component, input, output, signal } from '@angular/core';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button/primary-button.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, PrimaryButtonComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  readonly loading = input(false);
  readonly messageSubmitted = output<string>();
  protected readonly draft = signal('');

  protected submit(): void {
    const message = this.draft().trim();

    if (!message || this.loading()) {
      return;
    }

    this.messageSubmitted.emit(message);
    this.draft.set('');
  }
}
