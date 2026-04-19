import { Component, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { SecondaryButtonComponent } from '../../../../shared/components/secondary-button/secondary-button.component';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [IconComponent, SecondaryButtonComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  readonly clearPressed = output<void>();
}
