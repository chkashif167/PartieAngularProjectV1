import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';

//models
import { UserRoomStats, TotalUserRoomStats } from '@partie/modules/room/models/room.model';

//services
import { RoomService } from '@partie/modules/room/services/room.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilityService } from '@partie/core/services/utility.service';

@Component({
    selector: 'partie-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
@Input() userId : string;

    roomStats: UserRoomStats;
    parties = [];
    badges = [];
    weekTitle: string;
    timeInParties: string;
    partiesCompleted: string;
    badgesReceived: string;
    totalTimeInParties: string;
    totalPartiesCompleted: string;
    totalBadgesReceived: string;
    lastCurrentDate: Date;
    isCurrentWeek: boolean;

    private teardown$ = new Subject<void>();

    barChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            xAxes: [{
                gridLines: { display: false },
                barPercentage: 1.0,
                barThickness: 15
            }], yAxes: [{
                gridLines: { display: false },
                ticks: {
                  beginAtZero: true
                }

            }]
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };
    barChartLabels: Label[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    barChartType: ChartType = 'bar';
    barChartLegend = false;
    barChartPlugins = [{
        beforeDraw(chart, easing) {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const top = chartArea.top;

            ctx.save();
            ctx.fillStyle = '#141423';

            ctx.fillRect(chartArea.left, top, chartArea.right - chartArea.left, chartArea.bottom - top);

            ctx.restore();

        }
    }];

    barChartData: ChartDataSets[] = [];

    barChartColors: Color[] = [
        { backgroundColor: '#1CB3BD' },
        { backgroundColor: '#9C42AB' }
    ];

    constructor(private readonly roomService: RoomService, private readonly utilityService: UtilityService) {
      this.roomStats = new UserRoomStats();
    }

    ngOnInit() {
      this.lastCurrentDate = new Date();
      this.calculateWeekDays(0);
      this.getPartieStatsCount();
    }

    getPartieStatsCount() {

        this.roomService.getUserPartieStats(this.userId)
            .pipe(takeUntil(this.teardown$))
            .subscribe((result: TotalUserRoomStats) => {
                this.totalTimeInParties = result.totalTimeInParties;
                this.totalBadgesReceived = result.totalBadges;
                this.totalPartiesCompleted = result.totalParties;
            });

    }

    getLastWeekData() {
        this.calculateWeekDays(-7);
    }

    getNextWeekData() {
        this.calculateWeekDays(7);
    }

    calculateWeekDays(days: number): void {

        let currentDate = new Date(this.lastCurrentDate);

        currentDate.setDate(currentDate.getDate() + days);

        

        this.lastCurrentDate = new Date(currentDate);

        var first = new Date(currentDate).getDate() - new Date(currentDate).getDay();
        var last = (first) + 6;

        var startDate = new Date(currentDate.setDate(first));
        currentDate = new Date(this.lastCurrentDate);
        var endDate = new Date(currentDate.setDate(last));

        if (endDate >= new Date())
          this.isCurrentWeek = true;
        else
          this.isCurrentWeek = false;


        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.weekTitle = months[startDate.getMonth()] + " " + startDate.getDate() + " - " + months[endDate.getMonth()] + " " + endDate.getDate();


        this.populateChart(this.utilityService.formatDate(startDate), this.utilityService.formatDate(endDate));

    }

    populateChart(startDate: string, endDate: string) {

      this.roomService.getUserPartieStatsWeekwise(this.userId, startDate, endDate)
        .pipe(takeUntil(this.teardown$))
        .subscribe((result: UserRoomStats) => {
          this.roomStats = result;
          this.timeInParties = result.weeklyHours;
          this.badgesReceived = result.weeklyTotalBadges;
          this.partiesCompleted = result.weeklyTotalParties;

          this.barChartData = [
            { data: this.roomStats.chartData.map(x => x.weeklyParties) },
            { data: this.roomStats.chartData.map(x => x.weeklyBadges) }
          ];

        });
    }

    

}
