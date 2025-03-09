import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertEmitter: EventEmitter<string> = new EventEmitter();
  message: string | null = null;

  constructor() {}

  showAlert(message: string) {
    this.message = message;
    this.alertEmitter.emit('show');
  }

  closeAlert() {
    this.message = null;
    this.alertEmitter.emit('close');
  }
}
