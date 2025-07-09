import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee, EmployeeService } from '../../services/employee';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  employeeForm!: FormGroup;
  editingEmployee: Employee | null = null;
  private modalInstance: any;
  filter = {
    fullName: '',
    department: '',
    birthDate: '',
    hireDate: '',
    salary: ''
  };

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      department: ['', Validators.required],
      birthDate: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]]
    });

    const modalElement = document.getElementById('employeeModal');
if (modalElement) {
  this.modalInstance = new bootstrap.Modal(modalElement);
}
  }

  allEmployees: Employee[] = [];

loadEmployees() {
  this.employeeService.getEmployees().subscribe(data => {
    this.allEmployees = data;
    this.applyFiltersAndSorting();
  });
}

applyFiltersAndSorting() {
  let filtered = this.allEmployees.filter(e =>
    (!this.filter.fullName || e.fullName.toLowerCase().includes(this.filter.fullName.toLowerCase())) &&
    (!this.filter.department || e.department.toLowerCase().includes(this.filter.department.toLowerCase())) &&
    (!this.filter.birthDate || e.birthDate.startsWith(this.filter.birthDate)) &&
    (!this.filter.hireDate || e.hireDate.startsWith(this.filter.hireDate)) &&
    (!this.filter.salary || e.salary.toString().includes(this.filter.salary))
  );

  if (this.sortColumn) {
    filtered = filtered.sort((a, b) => {
      const aValue = (a as any)[this.sortColumn];
      const bValue = (b as any)[this.sortColumn];

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  this.employees = filtered;
}

  openCreateModal() {
    this.editingEmployee = null;
    this.employeeForm.reset();
    this.modalInstance.show();
  }

  openEditModal(employee: Employee) {
    this.editingEmployee = employee;
    this.employeeForm.patchValue(employee);
    this.modalInstance.show();
  }

  saveEmployee() {
    if (this.employeeForm.invalid) return;

    const data = this.employeeForm.value;

    if (this.editingEmployee) {
      const updated = { ...this.editingEmployee, ...data };
      this.employeeService.updateEmployee(updated).subscribe(() => {
        this.loadEmployees();
        this.modalInstance.hide();
      });
    } else {
      this.employeeService.createEmployee(data).subscribe(() => {
        this.loadEmployees();
        this.modalInstance.hide();
      });
    }
  }

  

  deleteEmployee(id: number) {
    if (!confirm('Вы уверены, что хотите удалить сотрудника?')) return;

    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }
  
  toggleSort(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.applyFiltersAndSorting();
}

  
  
}
