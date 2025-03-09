import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value as { email: string; password: string };
      this.authService.login(formValue).subscribe({
        next: () => { }, error: error => {
          this.alertService.showAlert(error.error.message)
        }
      })
    }
  }
}