import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '../../shared/models/ui.models';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly compact = input(false);
  readonly mobileOpen = input(false);
  readonly navigated = output<void>();
  readonly compactToggled = output<void>();

  protected readonly navigation: NavigationItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'AI Assistant', route: '/ai-assistant', icon: 'assistant' },
    { label: 'Transactions', route: '/transactions', icon: 'transactions' },
    { label: 'Categories', route: '/categories', icon: 'categories' },
    { label: 'Cards', route: '/cards', icon: 'cards' },
    { label: 'Goals', route: '/goals', icon: 'goals' },
    { label: 'Documents', route: '/documents', icon: 'documents' },
    { label: 'Settings', route: '/settings', icon: 'settings' }
  ];
}
