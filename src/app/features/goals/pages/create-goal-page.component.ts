import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoalsService } from '../goals.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { CreateGoalRequest } from '../../../shared/models/goal.model';

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
  private readonly goalsService = inject(GoalsService);

  protected readonly saving = signal(false);

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    description: [''],
    targetAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    currency: ['BRL', [Validators.required]],
    initialAmount: [0, [Validators.required, Validators.min(0)]]
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const rawValue = this.form.getRawValue();
    const payload: CreateGoalRequest = {
      name: (rawValue.name ?? '').trim(),
      description: (rawValue.description ?? '').trim(),
      targetAmount: rawValue.targetAmount ?? 0,
      currency: (rawValue.currency ?? 'BRL').trim().toUpperCase(),
      initialAmount: rawValue.initialAmount ?? 0
    };

    this.goalsService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/goals');
      },
      error: () => this.saving.set(false)
    });
  }
}
