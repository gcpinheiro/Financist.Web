import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss'
})
export class PrimaryButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  readonly icon = input<string | null>(null);
  readonly pressed = output<MouseEvent>();
}
