import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  // Inputs
  title = input<string>('');
  submitLabel = input<string>('Submit');
  fields = input<Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    icon?: string;
    validators?: any[];
  }>>([]);

  // Outputs
  formSubmit = output<any>();
  formChange = output<any>();

  // Internal state
  form: FormGroup;
  isSubmitting = signal<boolean>(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges.subscribe((value) => {
      this.formChange.emit(value);
    });
  }

  private buildForm(): void {
    const group: any = {};
    this.fields().forEach((field) => {
      const validators = field.validators || [];
      if (field.required) {
        validators.push(Validators.required);
      }
      group[field.name] = ['', validators];
    });
    this.form = this.fb.group(group);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      this.formSubmit.emit(this.form.value);
      
      // Reset submitting state after a delay (for animation)
      setTimeout(() => {
        this.isSubmitting.set(false);
      }, 1000);
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required') && control.touched) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.fields().find((f) => f.name === fieldName);
    return field?.label || fieldName;
  }
}

