import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { OperationService } from '../../services/operation.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { AddOperationComponent } from '../shared/add-operation/add-operation.component';
import { Operation } from '../../models/operation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AlertComponent, AddOperationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('modal') modal!: AddOperationComponent;
  currentDate: Date = new Date();
  monthRange: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  selectedYear: number;
  selectedMonth: number;
  daysInMonth: number[] = [];
  weeksCalc: number = 0;
  firstDayOfMonth: number = 0;
  today: number | null;
  years: number[] = [];
  operations: Operation[] = [];
  operationDays: number[] = [];

  constructor(
    private alertService: AlertService,
    private operationService: OperationService
  ) {
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    this.today = this.currentDate.getDate();
    const currentYear = this.currentDate.getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    this.updateCalendar();
    this.onDayClick(this.today);
  }

  updateCalendar(): void {
    this.firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    this.firstDayOfMonth = this.firstDayOfMonth === 0 ? 6 : this.firstDayOfMonth - 1;
    const daysInMonthMap = [31, this.isLeapYear(this.selectedYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const daysInMonthCount = daysInMonthMap[this.selectedMonth];
    this.daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);
    this.weeksCalc = Math.ceil((this.daysInMonth.length + this.firstDayOfMonth) / 7);
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  openModal(operation: Operation | null) {
    this.modal.open(operation);
  }

  isToday(day: number): boolean {
    return day === this.today
  }

  updateMonthYear() {
    this.updateCalendar();
    this.onDayClick(this.today!);
  }

  onDayClick(day: number): void {
    this.today = day;
    this.operations = [];
    this.operationDays = [];
    const date = `${this.selectedYear}-${Number(this.selectedMonth) + 1}-${this.today}`
    this.operationService.getDayOperation({ date }).subscribe({
      next: (res: { message: string, result: Operation[], dates: number[] }) => {
        if (res.message === 'Success') {
          this.operations = res.result;
          this.operationDays = res.dates;
        }
      }, error: error => {
        this.alertService.showAlert(error.error.message)
      }
    })
  }

  addOperation(event: any) {
    event.date = `${this.selectedYear}-${this.selectedMonth + 1}-${this.today}`;
    const isAddOperation = event._id === null;
    const operationObservable = isAddOperation ? this.operationService.addOperation(event) : this.operationService.editOperation(event);

    operationObservable.subscribe({
      next: (res: { message: string }) => {
        if (res.message === 'Success') {
          if (!isAddOperation) {
            const index = this.operations.findIndex(op => op._id === event._id);
            if (index !== -1) this.operations.splice(index, 1);
          }
          this.operations.push(event);
          this.alertService.showAlert(`Operation ${isAddOperation ? 'saved' : 'edited'} successfully`);
        }
      },
      error: (error) => {
        this.alertService.showAlert(error.error.message);
      }
    });
  }

  removeOperation(id: string) {
    this.operationService.removeOperation(id).subscribe({
      next: (res: { message: string }) => {
        if (res.message === 'Success') {
          this.operations = this.operations.filter(item => item._id !== id);
          this.alertService.showAlert('Operation saved successfully')

        }
      }, error: error => {
        this.alertService.showAlert(error.error.message)
      }
    })
  }
}
