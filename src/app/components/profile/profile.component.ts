import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  nameForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    surname: new FormControl<string>('', [Validators.required, Validators.minLength(3)])
  })

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const creds = this.authService.getCredentials()!.split(' ');
    this.nameForm.patchValue({
      name: creds[0],
      surname: creds[1]
    });
  }

  onSubmit(): void {
    if (this.nameForm.valid) {
      const formValue = this.nameForm.value as { name: string, surname: string };
      this.authService.updateProfile(formValue).subscribe({
        next: (res: { message: string }) => {
          localStorage.setItem('creds', `${formValue.name} ${formValue.surname}`);
          this.router.navigate(['/dashboard']);
          setTimeout(() => this.alertService.showAlert(res.message), 100);
        }, error: error => {
          this.alertService.showAlert(error.error.message)
        }
      })
    }
  }
}