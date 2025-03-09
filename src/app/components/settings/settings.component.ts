import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  passwordForm = new FormGroup({
    currentPassword: new FormControl<string>('', [Validators.required]),
    newPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl<string>('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  onSubmit() {
    if (this.passwordForm.valid) {
      const formValue = this.passwordForm.value as { currentPassword: string; newPassword: string, confirmNewPassword: string };
      this.authService.changePassword(formValue).subscribe({
        next: (res: { message: string }) => {
          this.router.navigate(['/login']).then(() => {
            setTimeout(() => {
              this.alertService.showAlert(res.message);
            }, 100);
          })
        }, error: error => {
          this.alertService.showAlert(error.error.message)
        }
      })
    }
  }
}