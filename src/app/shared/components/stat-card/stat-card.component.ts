import { Component, input } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | null>();
  readonly icon = input<string>('dashboard');
  readonly change = input<string>('');
  readonly helper = input<string>('');
  readonly tone = input<'primary' | 'success' | 'warning' | 'info'>('primary');
}
