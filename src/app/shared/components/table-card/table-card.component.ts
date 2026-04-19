import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-card',
  standalone: true,
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.scss'
})
export class TableCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
