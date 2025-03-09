import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.model';
import { environment } from '../../environments/environment.development';
import { MonthlyData } from '../models/monthly-data.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private readonly BACKEND_URL = `${environment.apiUrl}/operation`;

  constructor(
    private http: HttpClient,
  ) { }


    getDayOperation(data: { date: string }): Observable<{ message: string, result: Operation[], dates: number[] }> {
      return this.http.post<{ message: string, result: Operation[], dates: number[] }>(this.BACKEND_URL + '/get-day-operations', data);
    }

    addOperation(data: Operation): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(this.BACKEND_URL + '/add-operation', data);
    }

    editOperation(data: Operation): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(this.BACKEND_URL + '/edit-operation', data);
    }

    removeOperation(id: string): Observable<{ message: string }> {
      return this.http.get<{ message: string }>(this.BACKEND_URL + '/remove-operation/' + id);
    }

    getMonthReport(data: { month: string, year: string }): Observable<{ message: string, result: MonthlyData[] }> {
      return this.http.post<{ message: string, result: MonthlyData[] }>(this.BACKEND_URL + '/get-month-report/', data);
    }

    getStatistics(): Observable<{ message: string, result: any }> {
      return this.http.get<{ message: string, result: any }>(this.BACKEND_URL + '/get-statistics/');
    }

    getAccountSummary(): Observable<{ message: string, result: {} }> {
      return this.http.get<{ message: string, result: {} }>(this.BACKEND_URL + '/get-account-summary/');
    }
}
