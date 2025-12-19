import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { RegisterRequest } from '../../../../interface/register-interface';
import { InputField } from '../../../../shared/ui/input-field/input-field';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputField, Button],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = false;
  errorMessage = '';

  registerForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
  });

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.registerForm.controls;
    return (
      password.touched &&
      confirmPassword.touched &&
      password.value !== confirmPassword.value
    );
  }

  isUsernameError(): boolean {
    const control = this.registerForm.controls.username;
    return control.invalid && control.touched;
  }

  isPasswordError(): boolean {
    const control = this.registerForm.controls.password;
    return control.invalid && control.touched;
  }

  isConfirmPasswordError(): boolean {
    const control = this.registerForm.controls.confirmPassword;
    return (control.invalid && control.touched) || this.passwordMismatch;
  }

  onSubmitRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || this.passwordMismatch) {
      this.errorMessage = this.passwordMismatch
        ? 'Passwords do not match'
        : 'Please fix the highlighted fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.registerForm.getRawValue();
    const payload: RegisterRequest = { username, password };

    this.authService.register(payload).subscribe((success) => {
      this.loading = false;
      if (!success) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
