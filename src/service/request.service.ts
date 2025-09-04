import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  Name: string;
}

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient) {}

  getEmployeeNames(): Observable<Employee[]> {
    return this.http.get<Employee[]>('http://localhost:3000/api/requests');
  }
}
