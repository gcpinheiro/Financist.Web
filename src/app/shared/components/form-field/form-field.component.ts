import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldOption } from '../../models/ui.models';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
  readonly form = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select'>(
    'text'
  );
  readonly options = input<FormFieldOption[]>([]);
  readonly hint = input('');
  readonly autocomplete = input('off');
  readonly rows = input(4);
  readonly step = input('0.01');

  protected readonly control = computed(
    () => this.form().get(this.controlName()) as AbstractControl | null
  );
  protected readonly fieldId = computed(() => `field-${this.controlName()}`);

  protected showError(): boolean {
    const control = this.control();
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected errorMessage(): string {
    const errors = this.control()?.errors;

    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return 'This field is required.';
    }

    if (errors['email']) {
      return 'Please enter a valid email address.';
    }

    if (errors['minlength']) {
      return `Use at least ${errors['minlength'].requiredLength} characters.`;
    }

    if (errors['min']) {
      return `Value must be at least ${errors['min'].min}.`;
    }

    return 'Please review this value.';
  }
}
