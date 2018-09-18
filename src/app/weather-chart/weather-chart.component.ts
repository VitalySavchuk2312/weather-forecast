import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.css']
})
export class WeatherChartComponent implements OnInit {

  constructor(private http: HttpClient) { }

  dateToDisplay = [];
  // arr of days for chart
  neededDays:number[] = [];
  weatherInfo = [
    {
      city: "Lviv",
      temperature: []
    },
    {
      city: "Kiev",
      temperature: []
    },
    {
      city: "New York",
      temperature: []
    }
  ];
  getDateToDisplay() {
    const date = new Date();
    let day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear();
    const prevYear = year - 1,
          prevMonth = month - 1,
          /* 
          days' arr of the previous month. It is a case, if 
          start point will be the beginning of a new month
          for example: 2nd of September, then 1, then the last day of the previous month
          */
          prevMonthDays = new Date(year, month, 0).getDate(),
          // last days of December of previous year
          prevMonthDaysOfPrevYear = new Date(prevYear, 12, 0).getDate();
          // 8 - this api shows history of weather for 8 previous days
    for (let i = 0; i < 8; i++) {
      if (day === 0) {
        day = prevMonthDays;
        month = prevMonth;
        /* 
        the case if it is the beginning of January and one week back 
        will be in December of the previous year
        */
        if (month === 0) {
          day = prevMonthDaysOfPrevYear;
          month = 12;
          year = prevYear;
        }
      }
      // get arr of days for chart
      this.neededDays.push(day);
      this.dateToDisplay.push(
          {
            day: day,
            month: month,
            year: year
          }
        );
      day--;
    }
  }
  getApiResults() {
    const citiesLength = this.weatherInfo.length,
          daysLength = this.dateToDisplay.length;
    for (let i = 0; i < citiesLength; i++) {
      for (let j = 0; j < daysLength; j++) {
        this.http.get(`http://api.apixu.com/v1/history.json?key=e79b30662c3b4c44b5e45653181809&q=${this.weatherInfo[i].city}&dt=${this.dateToDisplay[j].year}-${this.dateToDisplay[j].month + 1}-${this.dateToDisplay[j].day}`)
        .subscribe(response => {
          this.weatherInfo[i].temperature.push(response.forecast.forecastday[0].day.avgtemp_c);
        });
      }
    }
  }
  getSelectedCity(val) {
    for (let i = 0; i < this.weatherInfo.length; i++) {
      if (val === this.weatherInfo[i].city) {
        this.barChartData[0].data = this.weatherInfo[i].temperature;
      }
    }
  }
  ngOnInit() {
    this.getDateToDisplay();
    this.getApiResults();
    // needs to be resolved in a better way.
    setTimeout(() => {
      this.barChartData[0].data = this.weatherInfo[0].temperature;
    }, 1000);
  }


  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType:string = 'bar';
 
  public barChartData:any[] = [
    {data: []}
  ];



}
