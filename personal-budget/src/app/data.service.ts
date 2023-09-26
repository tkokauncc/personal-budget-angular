import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private monthlyBudget: Budget[] = []
  constructor(private http: HttpClient) {
  }
  getMyBudget(): Observable<Budget[]> {
    if (this.monthlyBudget.length == 0) {
      return this.http.get<any>('http://localhost:3030/budget')
      .pipe(map((res: any) => {
        this.monthlyBudget = res.myBudget
        return this.monthlyBudget
      }))
    } else {
      return of(this.monthlyBudget)
    }
  }
}
export interface Budget {
  title: string;
  budget: number;
}