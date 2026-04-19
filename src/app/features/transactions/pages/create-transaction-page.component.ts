import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardsService } from '../../cards/cards.service';
import { CategoriesService } from '../../categories/categories.service';
import { TransactionsService } from '../transactions.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { CreateTransactionRequest } from '../../../shared/models/transaction.model';
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
  private readonly cardsService = inject(CardsService);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly saving = signal(false);
  protected readonly categories = this.categoriesService.categories;
  protected readonly cards = this.cardsService.cards;

  protected readonly form = this.formBuilder.group({
    description: ['', [Validators.required]],
    type: ['Expense', [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    currency: ['USD', [Validators.required]],
    occurredOn: [new Date().toISOString().slice(0, 10), [Validators.required]],
    categoryId: [''],
    cardId: [''],
    notes: ['']
  });

  protected readonly categoryOptions = computed<FormFieldOption[]>(() =>
    this.categories().map((category) => ({
      label: category.name ?? 'Unnamed category',
      value: category.id
    }))
  );

  protected readonly cardOptions = computed<FormFieldOption[]>(() =>
    this.cards().map((card) => ({
      label: `${card.name ?? 'Card'} • ${card.last4Digits ?? '----'}`,
      value: card.id
    }))
  );

  protected readonly typeOptions: FormFieldOption[] = [
    { label: 'Expense', value: 'Expense' },
    { label: 'Income', value: 'Income' }
  ];

  constructor() {
    this.categoriesService.load();
    this.cardsService.load();
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const rawValue = this.form.getRawValue();
    const payload: CreateTransactionRequest = {
      description: (rawValue.description ?? '').trim(),
      amount: rawValue.amount ?? 0,
      currency: (rawValue.currency ?? 'USD').trim().toUpperCase(),
      type: rawValue.type as CreateTransactionRequest['type'],
      occurredOn: rawValue.occurredOn ?? new Date().toISOString().slice(0, 10),
      categoryId: rawValue.categoryId || null,
      cardId: rawValue.cardId || null,
      notes: (rawValue.notes ?? '').trim() || null
    };

    this.transactionsService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/transactions');
      },
      error: () => this.saving.set(false)
    });
  }
}
