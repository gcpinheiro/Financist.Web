import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  protected readonly sidebarCompact = signal(false);
  protected readonly mobileSidebarOpen = signal(false);
  protected readonly pageTitle = signal('Visão geral');
  protected readonly pageSubtitle = signal(
    'Acompanhe saldos, fluxo de caixa e prioridades financeiras.'
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        map(() => this.findRouteData(this.route)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.pageTitle.set((data['title'] as string | undefined) ?? 'Financist');
        this.pageSubtitle.set((data['subtitle'] as string | undefined) ?? 'Painel financeiro');
      });
  }

  protected toggleSidebarMode(): void {
    this.sidebarCompact.update((value) => !value);
  }

  protected toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((value) => !value);
  }

  protected closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
  }

  protected userName(): string {
    return this.authService.currentUser()?.fullName ?? 'Usuário Financist';
  }

  protected userRole(): string {
    return 'Membro da conta';
  }

  protected userInitials(): string {
    const fullName = this.authService.currentUser()?.fullName ?? 'Usuário Financist';
    const initials = fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || 'UF';
  }

  private findRouteData(route: ActivatedRoute): Data {
    let current = route;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return current.snapshot.data;
  }
}
