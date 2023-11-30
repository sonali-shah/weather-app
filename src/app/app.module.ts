import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CitySelectComponent } from './components/city-select/city-select.component';
import { FutureWeatherComponent } from './components/future-weather/future-weather.component';
import { TodayWeatherComponent } from './components/today-weather/today-weather.component';
import { WeatherChartComponent } from './components/weather-chart/weather-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CitySelectComponent,
    TodayWeatherComponent,
    FutureWeatherComponent,
    WeatherChartComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
