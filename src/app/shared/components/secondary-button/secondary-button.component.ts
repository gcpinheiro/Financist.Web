import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss'
})
export class SecondaryButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly icon = input<string | null>(null);
  readonly pressed = output<MouseEvent>();
}
