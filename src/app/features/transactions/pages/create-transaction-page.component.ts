import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../categories/categories.service';
import { TransactionsService } from '../transactions.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { FormFieldOption } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-create-transaction-page',
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
  templateUrl: './create-transaction-page.component.html',
  styleUrl: './create-transaction-page.component.scss'
})
export class CreateTransactionPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly saving = signal(false);
  protected readonly categories = this.categoriesService.categories;

  protected readonly form = this.formBuilder.group({
    description: ['', [Validators.required]],
    type: ['expense', [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
    category: ['', [Validators.required]],
    paymentMethod: ['Credit card', [Validators.required]],
    account: ['Operations', [Validators.required]],
    status: ['Completed', [Validators.required]]
  });

  protected readonly categoryOptions = computed<FormFieldOption[]>(() =>
    this.categories().map((category) => ({
      label: category.name,
      value: category.name
    }))
  );

  protected readonly typeOptions: FormFieldOption[] = [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' }
  ];

  protected readonly statusOptions: FormFieldOption[] = [
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Scheduled', value: 'Scheduled' }
  ];

  constructor() {
    this.categoriesService.load();
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.transactionsService.create(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/transactions');
      },
      error: () => this.saving.set(false)
    });
  }
}
