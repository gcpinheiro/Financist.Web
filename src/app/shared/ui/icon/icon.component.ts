import { Component, computed, input } from '@angular/core';

const ICONS: Record<string, string[]> = {
  dashboard: [
    'M4 13.5h6.5V20H4v-6.5Zm9.5-9.5H20v16h-6.5V4ZM4 4h6.5v6.5H4V4Zm9.5 9.5H20v6.5h-6.5v-6.5Z'
  ],
  transactions: ['M7 7h10M7 12h8m-8 5h10M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
  categories: ['M12 3 21 8l-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5'],
  cards: ['M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9ZM3 10.5h18'],
  goals: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 0V21m0-18v2m9 7h-2M5 12H3m15.36 6.36-1.42-1.42M7.05 7.05 5.64 5.64m12.72 0-1.42 1.41M7.05 16.95l-1.41 1.41'],
  documents: ['M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5 0v5h5'],
  settings: ['M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm8.36 4.5-1.81.52a6.94 6.94 0 0 1-.57 1.38l.95 1.62-1.77 1.77-1.62-.95c-.44.24-.9.43-1.38.57l-.52 1.81h-2.5l-.52-1.81a6.94 6.94 0 0 1-1.38-.57l-1.62.95-1.77-1.77.95-1.62a6.94 6.94 0 0 1-.57-1.38l-1.81-.52v-2.5l1.81-.52c.13-.48.33-.94.57-1.38l-.95-1.62 1.77-1.77 1.62.95c.44-.24.9-.43 1.38-.57l.52-1.81h2.5l.52 1.81c.48.14.94.33 1.38.57l1.62-.95 1.77 1.77-.95 1.62c.24.44.44.9.57 1.38l1.81.52v2.5Z'],
  search: ['m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'],
  bell: ['M14.86 18H9.14m9.36 0H5.5c.77-.82 1.5-2.23 1.5-4.5 0-3.2 1.64-5.45 5-5.45s5 2.25 5 5.45c0 2.27.73 3.68 1.5 4.5ZM13.73 18a1.82 1.82 0 0 1-3.46 0'],
  menu: ['M4 7h16M4 12h16M4 17h16'],
  collapse: ['M15 19l-7-7 7-7'],
  expand: ['M9 5l7 7-7 7'],
  logout: ['M10 17l-5-5 5-5M5 12h10m-4-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6'],
  plus: ['M12 5v14M5 12h14'],
  upload: ['M12 16V7m0 0-3.5 3.5M12 7l3.5 3.5M5 17.5V19h14v-1.5'],
  wallet: ['M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1H6.5A2.5 2.5 0 0 0 4 10.5v7A2.5 2.5 0 0 0 6.5 20H18a2 2 0 0 0 2-2v-1H6.5A2.5 2.5 0 0 1 4 14.5v-7ZM20 10h-6a1.5 1.5 0 0 0 0 3h6v-3Z'],
  trend: ['M4 16 9 11l3 3 8-8M15 6h5v5'],
  target: ['M12 3v3m0 12v3m9-9h-3M6 12H3m15.36 6.36-2.12-2.12M7.76 7.76 5.64 5.64m12.72 0-2.12 2.12M7.76 16.24l-2.12 2.12M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z']
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [style.display]="'block'"
    >
      @for (path of paths(); track path) {
        <path
          [attr.d]="path"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          [attr.stroke-width]="strokeWidth()"
        />
      }
    </svg>
  `
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(20);
  readonly strokeWidth = input(1.8);

  protected readonly paths = computed(() => ICONS[this.name()] ?? ICONS['dashboard']);
}
