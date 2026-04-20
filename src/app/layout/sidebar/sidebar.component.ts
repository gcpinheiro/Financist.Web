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
    { label: 'Visao geral', route: '/dashboard', icon: 'dashboard' },
    { label: 'Assistente IA', route: '/ai-assistant', icon: 'assistant' },
    { label: 'Transacoes', route: '/transactions', icon: 'transactions' },
    { label: 'Categorias', route: '/categories', icon: 'categories' },
    { label: 'Cartoes', route: '/cards', icon: 'cards' },
    { label: 'Metas', route: '/goals', icon: 'goals' },
    { label: 'Documentos', route: '/documents', icon: 'documents' },
    { label: 'Configuracoes', route: '/settings', icon: 'settings' }
  ];
}
