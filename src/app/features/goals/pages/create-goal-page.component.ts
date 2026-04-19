import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../categories/categories.service';
import { GoalsService } from '../goals.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { FormFieldOption } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-create-goal-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    SectionCardComponent,
    FormFieldComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent
  ],
  templateUrl: './create-goal-page.component.html',
  styleUrl: './create-goal-page.component.scss'
})
export class CreateGoalPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly goalsService = inject(GoalsService);

  protected readonly saving = signal(false);
  protected readonly categories = this.categoriesService.categories;

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    targetAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    currentAmount: [0, [Validators.required, Validators.min(0)]],
    deadline: ['', [Validators.required]],
    color: ['#6ea8fe', [Validators.required]]
  });

  protected readonly categoryOptions = computed<FormFieldOption[]>(() =>
    this.categories().map((category) => ({
      label: category.name,
      value: category.name
    }))
  );

  constructor() {
    this.categoriesService.load();
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.goalsService.create(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/goals');
      },
      error: () => this.saving.set(false)
    });
  }
}
