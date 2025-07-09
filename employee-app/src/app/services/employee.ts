import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  department: string;
  fullName: string;
  birthDate: string;
  hireDate: string;
  salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'https://localhost:7226/api/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  createEmployee(employee: Employee): Observable<any> {
  return this.http.post(this.apiUrl, employee);
}

updateEmployee(employee: Employee): Observable<any> {
  return this.http.put(`${this.apiUrl}/${employee.id}`, employee);
}

deleteEmployee(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

}
