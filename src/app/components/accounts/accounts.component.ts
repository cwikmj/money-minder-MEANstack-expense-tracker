import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OperationService } from '../../services/operation.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  user: string | null = '';
  summary: any = {};

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.operationService.getAccountSummary().subscribe({
      next: (res: { message: string, result: {} }) => {
        this.summary = res.result;
        this.user = localStorage.getItem('creds');
      }
    })
  }
}
