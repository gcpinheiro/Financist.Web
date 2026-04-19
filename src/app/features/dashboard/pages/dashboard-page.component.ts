import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../dashboard.service';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { TableCardComponent } from '../../../shared/components/table-card/table-card.component';
import { DataTableColumn } from '../../../shared/models/ui.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    PageHeaderComponent,
    StatCardComponent,
    ChartCardComponent,
    TableCardComponent,
    DataTableComponent,
    LoadingStateComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dashboardService = inject(DashboardService);

  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly summary = this.dashboardService.summary;
  protected readonly loading = this.dashboardService.loading;

  protected readonly recentTransactionsColumns: DataTableColumn[] = [
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'end' },
    { key: 'status', label: 'Status', type: 'badge', align: 'end' }
  ];

  protected readonly donutSeries = computed(() =>
    this.summary()?.expensesByCategory.map((item) => item.amount) ?? []
  );
  protected readonly donutLabels = computed(
    () => this.summary()?.expensesByCategory.map((item) => item.category) ?? []
  );
  protected readonly donutColors = computed(
    () => this.summary()?.expensesByCategory.map((item) => item.color) ?? []
  );

  protected readonly cashflowSeries = computed<any[]>(() => {
    const summary = this.summary();
    return summary
      ? [
          { name: 'Income', data: summary.cashflow.map((item) => item.income) },
          { name: 'Expenses', data: summary.cashflow.map((item) => item.expenses) }
        ]
      : [];
  });

  protected readonly balanceSeries = computed<any[]>(() => {
    const summary = this.summary();
    return summary
      ? [
          {
            name: 'Balance',
            data: summary.balanceTrend.map((item) => item.balance)
          }
        ]
      : [];
  });

  protected readonly cashflowXAxis = computed<any>(() => ({
    categories: this.summary()?.cashflow.map((item) => item.month) ?? [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: Array(6).fill('#94a7c7') } }
  }));

  protected readonly balanceXAxis = computed<any>(() => ({
    categories: this.summary()?.balanceTrend.map((item) => item.month) ?? [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: Array(6).fill('#94a7c7') } }
  }));

  protected readonly donutChart: any = {
    type: 'donut',
    height: 320,
    toolbar: { show: false },
    background: 'transparent'
  };
  protected readonly lineChart: any = {
    type: 'line',
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    foreColor: '#94a7c7'
  };
  protected readonly areaChart: any = {
    ...this.lineChart,
    type: 'area'
  };
  protected readonly donutLegend: any = {
    position: 'bottom',
    labels: { colors: '#94a7c7' }
  };
  protected readonly lineStroke: any = {
    curve: 'smooth',
    width: [3, 3]
  };
  protected readonly areaStroke: any = {
    curve: 'smooth',
    width: 3
  };
  protected readonly gradientFill: any = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.04,
      stops: [0, 100]
    }
  };
  protected readonly grid: any = {
    borderColor: 'rgba(146, 167, 207, 0.12)',
    strokeDashArray: 4
  };
  protected readonly yAxis: any = {
    labels: {
      style: {
        colors: ['#94a7c7']
      },
      formatter: (value: number) => `$${Math.round(value / 1000)}k`
    }
  };
  protected readonly donutPlotOptions: any = {
    pie: {
      donut: {
        size: '72%'
      }
    }
  };

  constructor() {
    this.dashboardService.load();
  }
}
