import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OperationService } from '../../services/operation.service';
import { Statistics } from '../../models/statistics.model';
import * as echarts from 'echarts';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private statisticChart!: echarts.ECharts;
  chartsData: any = {};
  scaleData: any = {};

  constructor(private operationService: OperationService) { }

  ngOnInit(): void {
    this.operationService.getStatistics().subscribe({
      next: (res: { message: string, result: Statistics[] }) => {
        res.result.forEach((item: any) => {
          Object.keys(item).forEach(key => {
            if (!this.chartsData[key]) {
              this.chartsData[key] = [];
            }
            this.chartsData[key].push(item[key])
          })
        })
        this.scaleData = {
          incomeMax: Math.round((Math.max(...this.chartsData.income) + 1000) / 2000) * 2000,
          totalMax: Math.round((Math.max(...this.chartsData.total) + 1000) / 2000) * 2000,
        }
        this.initChart();
        window.addEventListener('resize', () => this.statisticChart.resize());
        console.log(this.chartsData)
      }
    })
  }

  private initChart(): void {
    this.statisticChart = echarts.init(this.chartContainer.nativeElement, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['expenses', 'incomes', 'total']
      },
      xAxis: [
        {
          type: 'category',
          data: this.chartsData.month,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'incomes & expenses',
          min: 0,
          max: this.scaleData.incomeMax,
          interval: Math.round((this.scaleData.incomeMax / 5) / 1000) * 1000,
          axisLabel: {
            formatter: '{value} PLN'
          }
        },
        {
          type: 'value',
          name: 'trend',
          min: 0,
          max: this.scaleData.totalMax,
          interval: Math.round((this.scaleData.totalMax / 5) / 1000) * 1000,
          axisLabel: {
            formatter: '{value} PLN'
          }
        }
      ],
      series: [
        {
          name: 'expenses',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' PLN';
            }
          },
          data: this.chartsData.expense
        },
        {
          name: 'incomes',
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' PLN';
            }
          },
          data: this.chartsData.income
        },
        {
          name: 'total',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return (value as number) + ' PLN';
            }
          },
          data: this.chartsData.total
        }
      ]
    };

    if (option && typeof option === 'object') {
      this.statisticChart.setOption(option);
    }
  }
}
