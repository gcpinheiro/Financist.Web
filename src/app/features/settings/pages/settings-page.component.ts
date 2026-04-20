import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeService, AppTheme } from '../../../core/theme/theme.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, SectionCardComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly currentTheme = this.themeService.theme;

  protected setTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
  }
}
