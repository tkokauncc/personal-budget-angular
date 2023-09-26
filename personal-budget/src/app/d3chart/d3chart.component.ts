import { AfterViewInit, Component } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../app.module';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pb-d3chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3chart.component.html',
  styleUrls: ['./d3chart.component.scss'],
})
export class D3ChartComponent implements AfterViewInit {


  private svg: any;
  private margin = 50;
  private width = 400;
  private height = 400;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  private pieDataD3: any = {
    titles: [],
    values: [],
  };



  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3030/budget').subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.pieDataD3.titles[i] = res.myBudget[i].title;
        this.pieDataD3.values[i] = res.myBudget[i].budget;
      }
      const data = this.getPieDataD3();
      this.createSvgDataD3();
      this.fillColors(data);
      this.drawChart(data);
    });
  }

  private getPieDataD3(): any {
    var mappings = [];
    for (var i = 0; i < this.pieDataD3.titles.length; i++) {
      mappings[i] = {
        label: this.pieDataD3.titles[i],
        value: this.pieDataD3.values[i],
      };
    }
    return mappings;
  }



  private createSvgDataD3(): void {
    this.svg = d3
      .select('figure#pied3chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private fillColors(data: any): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.label.toString()))
      .range(d3.schemeCategory10);
  }

  private getValue(d: any): string {
    return d.data.label;
  }

  private drawChart(data: any) {
    var arc = d3
      .arc()
      .outerRadius(this.radius * 0.8)
      .innerRadius(this.radius * 0.4);

    var outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svg.append('g').attr('class', 'slices');
    this.svg.append('g').attr('class', 'labels');
    this.svg.append('g').attr('class', 'lines');

    const pie = d3.pie<any>().value((d: any) => Number(d.value));
    this.svg
      .select('.slices')
      .selectAll('path.slice')
      .data(pie(data))
      .enter()
      .insert('path')
      .style('fill', (d: any, i: any) => this.colors(i))
      .attr('class', 'slice')
      .attr('d', arc)
      .exit()
      .remove();

    var radius = this.radius;
    function midAngle(d: any) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    this.svg
      .select('.labels')
      .selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .text((d: any) => d.data.label)
      .attr('transform', (d: any) => 'translate(' + outerArc.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15)
      .transition()
      .attrTween('transform', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        };
      })
      .styleTween('text-anchor', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start' : 'end';
        };
      });


    this.svg
      .select('.lines')
      .selectAll('polyline')
      .data(pie(data), this.getValue)
      .enter()
      .append('polyline')
      .transition()
      .attrTween('points', function (d: any, i: any, n: any) {
        const currentElement = d3.select(n[i]) as typeof d;
        currentElement._current = currentElement._current || d;
        var interpolate = d3.interpolate(currentElement._current, d);
        currentElement._current = interpolate(0);
        return function (t: any) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });
  }
}