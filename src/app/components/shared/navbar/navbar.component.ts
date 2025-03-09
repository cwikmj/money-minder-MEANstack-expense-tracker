import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentTime$: BehaviorSubject<string> = new BehaviorSubject(this.getCurrentTime());
  countdown: string = '';
  private timeSubscription!: Subscription;
  private countdownSubscription!: Subscription;
  private countdownValue: number = environment.sessionTime
  countdownClass: string = 'is-success';
  userCreds: string | null = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime$.next(this.getCurrentTime());
    });

    this.userCreds = this.authService.getCredentials();
    this.initializeCountdown();
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private initializeCountdown(): void {
    const timeStart = localStorage.getItem('timeStart');
    
    if (timeStart) {
      const startTime = new Date(parseInt(timeStart, 10));
      const currentTime = new Date();
      const elapsedSeconds = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
      
      const sessionTimeInSeconds = this.countdownValue;
      this.countdownValue = Math.max(sessionTimeInSeconds - elapsedSeconds, 0);
      
      this.updateCountdownDisplay();
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    this.countdownSubscription = interval(1000).subscribe(() => {
      if (this.countdownValue > 0) {
        this.countdownValue--;
        this.updateCountdownDisplay();
        this.countdownClass = this.getCountdownClass();
      } else {
        this.countdownSubscription.unsubscribe();
        this.authService.forceLogout();
        setTimeout(() => this.alertService.showAlert('Your session has expired<br>You\'ve been looged out'), 100);
      }
    });
  }

  private updateCountdownDisplay(): void {
    const minutes = Math.floor(this.countdownValue / 60);
    const seconds = this.countdownValue % 60;
    this.countdown = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private getCountdownClass(): string {
    if (this.countdownValue < 60) {
      return 'is-danger';
    } else if (this.countdownValue < 300) {
      return 'is-warning';
    } else {
      return 'is-success';
    }
  }

  refreshToken() {
    this.authService.refreshToken().subscribe({
      next: () => {
        this.countdownValue = environment.sessionTime
        this.updateCountdownDisplay();
      },
      error: (error) => {
        console.error('Error Refreshing:', error);
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  private getCurrentTime(): string {
    return new Date().toLocaleString();
  }
}