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
    { label: 'Visão geral', route: '/dashboard', icon: 'dashboard' },
    { label: 'Assistente financeiro', route: '/ai-assistant', icon: 'assistant' },
    { label: 'Transações', route: '/transactions', icon: 'transactions' },
    { label: 'Categorias', route: '/categories', icon: 'categories' },
    { label: 'Cartões', route: '/cards', icon: 'cards' },
    { label: 'Metas', route: '/goals', icon: 'goals' },
    { label: 'Documentos', route: '/documents', icon: 'documents' },
    { label: 'Configurações', route: '/settings', icon: 'settings' }
  ];
}
