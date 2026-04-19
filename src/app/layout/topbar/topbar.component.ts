import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly userName = input('Gabriel Costa');
  readonly userRole = input('Finance Lead');
  readonly userInitials = input('GC');
  readonly sidebarCompact = input(false);

  readonly menuPressed = output<void>();
  readonly compactPressed = output<void>();
  readonly logoutPressed = output<void>();
}
