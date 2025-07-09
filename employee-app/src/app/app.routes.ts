import { Routes } from '@angular/router';
import { CompanyComponent } from './components/company/company';
import { EmployeesComponent } from './components/employees/employees';

export const routes: Routes = [
  { path: '', component: CompanyComponent },
  { path: 'employees', component: EmployeesComponent }
];
