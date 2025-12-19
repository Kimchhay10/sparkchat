import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth-service';
import { LoginRequest } from '../../../../interface/login-interface';
import { InputField } from '../../../../shared/ui/input-field/input-field';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputField, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isUsernameError(): boolean {
    const control = this.loginForm.controls.username;
    return control.invalid && control.touched;
  }

  isPasswordError(): boolean {
    const control = this.loginForm.controls.password;
    return control.invalid && control.touched;
  }

  onSubmitLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const payload: LoginRequest = this.loginForm.getRawValue();

    this.authService.login(payload).subscribe((success) => {
      this.loading = false;

      if (!success) {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
