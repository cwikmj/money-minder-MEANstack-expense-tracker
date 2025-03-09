import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as echarts from 'echarts';
import { OperationService } from '../../services/operation.service';
import { MonthlyData } from '../../models/monthly-data.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private reportChart!: echarts.ECharts;
  currentDate: Date = new Date();
  monthRange: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  selectedYear: number;
  selectedMonth: number;
  years: number[] = [];
  monthData: MonthlyData[] = [];
  total: number = 0;

  constructor(private operationService: OperationService) {
    this.selectedMonth = this.currentDate.getMonth();
    this.selectedYear = this.currentDate.getFullYear();
    const currentYear = this.currentDate.getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

  ngAfterViewInit(): void {
    this.updateReport()
    this.initChart(this.monthData);
    window.addEventListener('resize', () => this.reportChart.resize());
  }

  updateReport() {
    const month = Number(this.selectedMonth) + 1;
    this.operationService.getMonthReport({month: month.toString(), year: this.selectedYear.toString()}).subscribe({
      next: (res: { message: string, result: MonthlyData[] }) => {
        this.monthData = res.result.sort((a, b) => b.value - a.value);
        this.initChart(this.monthData);
        this.total = this.monthData.reduce((total, month) => total + month.value, 0)
      }, error: err => {
        console.log(err)
      }
    })
  }

  private initChart(data: MonthlyData[]): void {
    this.reportChart = echarts.init(this.chartContainer.nativeElement, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: `${this.monthNames[this.selectedMonth]} ${this.selectedYear}`,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    if (option && typeof option === 'object') {
      this.reportChart.setOption(option);
    }
  }
}
