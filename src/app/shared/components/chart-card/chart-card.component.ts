import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss'
})
export class ChartCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
