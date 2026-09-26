import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SystemNotification,
} from '../../models/employee.model';

import { EmployeeHeaderComponent } from '../employee-dumb/employee-header/employee-header.component';
import { EmployeeTableComponent } from '../employee-dumb/employee-table/employee-table.component';
import { EmployeeFormComponent } from '../employee-dumb/employee-form/employee-form.component';
import { EmployeeDeleteModalComponent } from '../employee-dumb/employee-delete-modal/employee-delete-modal.component';

@Component({
  selector: 'app-employee-smart',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeHeaderComponent,
    EmployeeTableComponent,
    EmployeeFormComponent,
    EmployeeDeleteModalComponent,
  ],
  templateUrl: './employee-smart.component.html',
  styleUrl: './employee-smart.component.css',
})
export class EmployeeSmartComponent implements OnInit {
  public readonly employees$: Observable<Employee[]>;
  public readonly loading$: Observable<boolean>;
  public readonly selectedEmployee$: Observable<Employee | null>;
  public readonly notification$: Observable<SystemNotification | null>;

  isSubmitting = false;
  isDeleting = false;
  isDeleteModalOpen = false;
  employeeToEdit: Employee | null = null;
  employeeToDelete: Employee | null = null;

  constructor(private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.employees$;
    this.loading$ = this.employeeService.loading$;
    this.selectedEmployee$ = this.employeeService.selectedEmployee$;
    this.notification$ = this.employeeService.notification$;
  }

  ngOnInit(): void {
    this.employeeService.loadEmployees().subscribe();
  }

  handleSelect(employee: Employee): void {
    this.employeeService.selectEmployee(employee);
  }

  handleEdit(employee: Employee): void {
    this.employeeToEdit = { ...employee };
  }

  handlePromptDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.isDeleteModalOpen = true;
  }

  handleSave(dto: CreateEmployeeDTO): void {
    this.isSubmitting = true;
    this.employeeService.createEmployee(dto).subscribe({
      next: () => {
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  handleUpdate(event: { id: string; dto: UpdateEmployeeDTO }): void {
    this.isSubmitting = true;
    this.employeeService.updateEmployee(event.id, event.dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.employeeToEdit = null;
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  handleConfirmDelete(id: string): void {
    this.isDeleting = true;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.employeeToDelete = null;
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }

  handleCloseForm(): void {
    this.employeeToEdit = null;
  }

  handleCancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.employeeToDelete = null;
  }

  handleCloseNotification(): void {
    this.employeeService.clearNotification();
  }
}
