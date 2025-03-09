import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {
  message: string = '';
  isVisible: boolean = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alertEmitter.subscribe((status) => {
      if (status === 'show' && this.alertService.message) {
        this.message = this.alertService.message;
        this.isVisible = true;
      } else if (status === 'close') {
        this.isVisible = false;
      }
    });
  }

  close() {
    this.isVisible = false;
    this.alertService.closeAlert();
  }
}
