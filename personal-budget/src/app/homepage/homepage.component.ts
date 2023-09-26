import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
        {
            data: [] as any[],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: [] as any[]
};


  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://localhost:3030/budget')
    .subscribe((res: any) => {

      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
    }
    this.createChart();

    });
  }

  createChart() {
    console.log("axiosdata:" + this.dataSource);
    var ctx = document.getElementById('myChart') as HTMLCanvasElement | null;

    if (!ctx) {
        console.error("Canvas element not found!");
        return;
    }

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}

}