import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChartComponent } from './d3chart.component';

describe('D3chartComponent', () => {
  let component: D3ChartComponent;
  let fixture: ComponentFixture<D3ChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [D3ChartComponent]
    });
    fixture = TestBed.createComponent(D3ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});