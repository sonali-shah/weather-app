import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { tap } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherChartComponent implements OnInit {
  @Input() forecast;
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  weatherForecastData;
  chartProperties;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService
      .getChartProperties()
      .pipe(
        tap((chartProperties) => {
          this.chartProperties = chartProperties;
          this.createChart();
        })
      )
      .subscribe();
  }

  ngOnChanges() {
    this.weatherForecastData = this.forecast.list.map((item) => ({
      dateTime: new Date(item.dt_txt),
      max: item.main.temp_max,
      min: item.main.temp_min,
    }));
  }

  createChart(): void {
    console.log(this.chartContainer.nativeElement.clientWidth);

    // set the dimensions and margins of the graph
    var margin = {
        top: +this.chartProperties.chartMarginTop,
        right: +this.chartProperties.chartMarginRight,
        bottom: +this.chartProperties.chartMarginBottom,
        left: +this.chartProperties.chartMarginLeft,
      },
      width = this.chartContainer.nativeElement.clientWidth,
      height = +this.chartProperties.chartHeight + margin.top + margin.bottom;

    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

    // Add X axis --> it is a date-time format
    var x = d3
      .scaleTime()
      .domain(
        d3.extent(this.weatherForecastData, function (d) {
          return d.dateTime;
        })
      )
      .range([0, width - margin.left]);

    x.ticks(
      d3.timeDay.count(
        this.weatherForecastData[0].dateTime,
        this.weatherForecastData[this.weatherForecastData.length - 1].dateTime
      )
    );

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + (height - margin.bottom - margin.top) + ')')
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        d3.min(this.weatherForecastData, function (d) {
          return d.min;
        }),
        d3.max(this.weatherForecastData, function (d) {
          return d.min;
        }),
      ])
      .range([0, (height - margin.top - margin.bottom)]);

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .call(d3.axisLeft(y));

    // Add the line
    svg
      .append('path')
      .datum(this.weatherForecastData)
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .attr('fill', 'none')
      .attr('stroke', this.chartProperties.minTempStrokeColor)
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.dateTime);
          })
          .y(function (d) {
            return y(d.min);
          })
      );
  }
}
