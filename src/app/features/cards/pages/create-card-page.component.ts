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
import { CreateCardRequest } from '../../../shared/models/card.model';

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

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    last4Digits: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    limitAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    currency: ['USD', [Validators.required]],
    closingDay: [15, [Validators.required, Validators.min(1), Validators.max(31)]],
    dueDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]]
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const rawValue = this.form.getRawValue();
    const payload: CreateCardRequest = {
      name: (rawValue.name ?? '').trim(),
      last4Digits: rawValue.last4Digits,
      limitAmount: rawValue.limitAmount ?? 0,
      currency: (rawValue.currency ?? 'USD').trim().toUpperCase(),
      closingDay: rawValue.closingDay ?? 1,
      dueDay: rawValue.dueDay ?? 1
    };

    this.cardsService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/cards');
      },
      error: () => this.saving.set(false)
    });
  }
}
