import { ValidatorFn } from '@angular/forms';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'color'
  | 'range';

export type FormFieldSize = 'sm' | 'md' | 'lg';
export type FormFieldVariant = 'default' | 'bordered' | 'filled' | 'ghost';

export interface FormFieldOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FormFieldConfig {
  name: string;
  label?: string;
  type?: FormFieldType;
  placeholder?: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hint?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  prefix?: string;
  suffix?: string;
  validators?: ValidatorFn[];
  options?: FormFieldOption[];
  multiple?: boolean;
  accept?: string; // for file inputs
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number; // for textarea
  cols?: number; // for textarea
  pattern?: string;
  size?: FormFieldSize;
  variant?: FormFieldVariant;
  customClass?: string;
  errorMessages?: { [key: string]: string };
  col?: number; // grid column span (1-12)
  showLabel?: boolean;
  labelPosition?: 'top' | 'left' | 'inline';
}

export interface DynamicFormConfig {
  fields: FormFieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridCols?: number;
  gap?: string;
  submitButtonClass?: string;
  cancelButtonClass?: string;
  formClass?: string;
  resetOnSubmit?: boolean;
}

export interface FormValidationError {
  field: string;
  message: string;
}
