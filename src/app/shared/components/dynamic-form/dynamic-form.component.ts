import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormFieldConfig,
  DynamicFormConfig,
  FormValidationError,
} from '../../interface/form.interface';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  // Inputs
  config = input.required<DynamicFormConfig>();
  initialValues = input<any>({});
  disabled = input<boolean>(false);

  // Outputs
  formSubmit = output<any>();
  formCancel = output<void>();
  formChange = output<any>();
  validationErrors = output<FormValidationError[]>();

  // State
  form!: FormGroup;
  isSubmitting = signal<boolean>(false);
  errors = signal<FormValidationError[]>([]);

  // Computed
  gridClass = computed(() => {
    const cols = this.config().gridCols || 1;
    const colsMap: { [key: number]: string } = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    };
    return colsMap[cols] || 'grid-cols-1';
  });

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.disabled()) {
        this.form?.disable();
      } else {
        this.form?.enable();
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.setupFormListeners();
    this.setInitialValues();
  }

  private buildForm(): void {
    const group: any = {};

    this.config().fields.forEach((field) => {
      const validators = [...(field.validators || [])];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.min !== undefined) {
        validators.push(Validators.min(Number(field.min)));
      }

      if (field.max !== undefined) {
        validators.push(Validators.max(Number(field.max)));
      }

      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      const defaultValue = field.value ?? this.getDefaultValue(field.type);
      group[field.name] = [
        { value: defaultValue, disabled: field.disabled || field.readonly },
        validators,
      ];
    });

    this.form = this.fb.group(group);
  }

  private getDefaultValue(type?: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
      case 'range':
        return 0;
      case 'select':
      case 'radio':
        return null;
      default:
        return '';
    }
  }

  private setupFormListeners(): void {
    this.form.valueChanges.subscribe((value) => {
      this.formChange.emit(value);
      this.validateForm();
    });
  }

  private setInitialValues(): void {
    const values = this.initialValues();
    if (values && Object.keys(values).length > 0) {
      this.form.patchValue(values);
    }
  }

  private validateForm(): void {
    const errors: FormValidationError[] = [];

    this.config().fields.forEach((field) => {
      const control = this.form.get(field.name);
      if (control && control.invalid && control.touched) {
        const errorMessage = this.getFieldErrorMessage(field, control);
        if (errorMessage) {
          errors.push({ field: field.name, message: errorMessage });
        }
      }
    });

    this.errors.set(errors);
    this.validationErrors.emit(errors);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.validateForm();
      return;
    }

    this.isSubmitting.set(true);
    this.formSubmit.emit(this.form.getRawValue());

    if (this.config().resetOnSubmit) {
      setTimeout(() => {
        this.form.reset();
        this.isSubmitting.set(false);
      }, 500);
    } else {
      setTimeout(() => this.isSubmitting.set(false), 500);
    }
  }

  onCancel(): void {
    this.form.reset();
    this.formCancel.emit();
  }

  getFieldControl(fieldName: string): AbstractControl | null {
    return this.form.get(fieldName);
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.getFieldControl(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldErrorMessage(
    field: FormFieldConfig,
    control: AbstractControl
  ): string {
    if (!control.errors) return '';

    const errorKey = Object.keys(control.errors)[0];

    if (field.errorMessages && field.errorMessages[errorKey]) {
      return field.errorMessages[errorKey];
    }

    const label = field.label || field.name;

    switch (errorKey) {
      case 'required':
        return `${label} is required`;
      case 'email':
        return `${label} must be a valid email`;
      case 'min':
        return `${label} must be at least ${field.min}`;
      case 'max':
        return `${label} must be at most ${field.max}`;
      case 'minlength':
        return `${label} must be at least ${control.errors['minlength'].requiredLength} characters`;
      case 'maxlength':
        return `${label} must be at most ${control.errors['maxlength'].requiredLength} characters`;
      case 'pattern':
        return `${label} format is invalid`;
      default:
        return `${label} is invalid`;
    }
  }

  getFieldSizeClass(size?: string): string {
    switch (size) {
      case 'sm':
        return 'text-sm py-1.5 px-3';
      case 'lg':
        return 'text-lg py-3 px-4';
      default:
        return 'text-base py-2 px-3';
    }
  }

  getFieldVariantClass(variant?: string): string {
    switch (variant) {
      case 'bordered':
        return 'border-2 bg-transparent';
      case 'filled':
        return 'border-0 bg-gray-100 dark:bg-gray-800';
      case 'ghost':
        return 'border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800';
      default:
        return 'border bg-white dark:bg-gray-900';
    }
  }

  getColSpanClass(col?: number): string {
    if (!col) return '';
    const spanMap: { [key: number]: string } = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    };
    return spanMap[col] || '';
  }

  reset(): void {
    this.form.reset();
  }

  setValue(values: any): void {
    this.form.patchValue(values);
  }

  getValue(): any {
    return this.form.getRawValue();
  }

  getErrors(): FormValidationError[] {
    return this.errors();
  }
}
