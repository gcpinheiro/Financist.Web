import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PrimaryButtonComponent } from '../../../shared/components/primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../../../shared/components/secondary-button/secondary-button.component';
import { SectionCardComponent } from '../../../shared/components/section-card/section-card.component';
import { CreateCategoryRequest } from '../../../shared/models/category.model';
import { FormFieldOption } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-create-category-page',
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
  templateUrl: './create-category-page.component.html',
  styleUrl: './create-category-page.component.scss'
})
export class CreateCategoryPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);

  protected readonly saving = signal(false);
  protected readonly typeOptions: FormFieldOption[] = [
    { label: 'Expense', value: 'Expense' },
    { label: 'Income', value: 'Income' }
  ];

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    type: ['Expense', [Validators.required]]
  });

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const rawValue = this.form.getRawValue();
    const payload: CreateCategoryRequest = {
      name: (rawValue.name ?? '').trim(),
      type: rawValue.type as CreateCategoryRequest['type']
    };

    this.categoriesService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigateByUrl('/categories');
      },
      error: () => this.saving.set(false)
    });
  }
}
