import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    () => this.form().get(this.controlName()) as FormControl | null
  );
  protected readonly fieldId = computed(() => `field-${this.controlName()}`);

  protected resolvedControl(): FormControl {
    const control = this.control();

    if (!control) {
      throw new Error(`Control "${this.controlName()}" was not found in the provided form group.`);
    }

    return control;
  }

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
      return 'Este campo é obrigatório.';
    }

    if (errors['email']) {
      return 'Digite um e-mail válido.';
    }

    if (errors['minlength']) {
      return `Use pelo menos ${errors['minlength'].requiredLength} caracteres.`;
    }

    if (errors['min']) {
      return `O valor mínimo é ${errors['min'].min}.`;
    }

    if (errors['max']) {
      return `O valor máximo é ${errors['max'].max}.`;
    }

    if (errors['pattern']) {
      return 'Digite um valor no formato esperado.';
    }

    return 'Revise este valor.';
  }
}
