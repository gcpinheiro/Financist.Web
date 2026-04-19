import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardsService } from '../cards.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { FormFieldOption } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-create-card-page',
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
  templateUrl: './create-card-page.component.html',
  styleUrl: './create-card-page.component.scss'
})
export class CreateCardPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cardsService = inject(CardsService);

  protected readonly saving = signal(false);
  protected readonly statusOptions: FormFieldOption[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Locked', value: 'Locked' }
  ];

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    brand: ['Visa', [Validators.required]],
    lastDigits: ['', [Validators.required, Validators.minLength(4)]],
    creditLimit: [null as number | null, [Validators.required, Validators.min(1)]],
    availableLimit: [null as number | null, [Validators.required, Validators.min(0)]],
    closingDay: [15, [Validators.required, Validators.min(1)]],
    dueDay: [1, [Validators.required, Validators.min(1)]],
    status: ['Active', [Validators.required]]
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.cardsService.create(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/cards');
      },
      error: () => this.saving.set(false)
    });
  }
}
