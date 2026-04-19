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
  protected readonly pageTitle = signal('Dashboard');
  protected readonly pageSubtitle = signal('A live pulse of balances, cashflow, and spending patterns.');

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
        this.pageSubtitle.set((data['subtitle'] as string | undefined) ?? 'Finance cockpit');
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
    return this.authService.currentUser()?.name ?? 'Financist user';
  }

  protected userRole(): string {
    return this.authService.currentUser()?.role ?? 'Workspace member';
  }

  protected userInitials(): string {
    return this.authService.currentUser()?.initials ?? 'FN';
  }

  private findRouteData(route: ActivatedRoute): Data {
    let current = route;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return current.snapshot.data;
  }
}
