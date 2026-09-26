import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnChanges {
  @Input() employee: Employee | null = null;
  @Input() isSubmitting: boolean = false;

  @Output() save = new EventEmitter<CreateEmployeeDTO>();
  @Output() update = new EventEmitter<{ id: string; dto: UpdateEmployeeDTO }>();
  @Output() close = new EventEmitter<void>();

  employeeForm: FormGroup;
  isEditMode = false;

  departmentOptions = [
    'Innovación y Desarrollo',
    'Tecnologías de la Información (TI)',
    'Arquitectura de Software',
    'Finanzas y Contabilidad',
    'Recursos Humanos y Talento',
    'Operaciones y Logística',
  ];

  constructor(private fb: FormBuilder) {
    // Validaciones sincronizadas estrictamente con el esquema Zod del backend (Reto 2)
    this.employeeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cargo: ['', [Validators.required, Validators.minLength(2)]],
      departamento: ['', [Validators.required, Validators.minLength(2)]],
      sueldo: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      if (this.employee && this.employee._id) {
        this.isEditMode = true;
        this.employeeForm.patchValue({
          nombre: this.employee.nombre,
          cargo: this.employee.cargo,
          departamento: this.employee.departamento,
          sueldo: this.employee.sueldo,
        });
      } else {
        this.isEditMode = false;
        this.employeeForm.reset();
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValues = this.employeeForm.value;
    const dto: CreateEmployeeDTO = {
      nombre: (formValues.nombre || '').trim(),
      cargo: (formValues.cargo || '').trim(),
      departamento: (formValues.departamento || '').trim(),
      sueldo: Number(formValues.sueldo),
    };

    if (this.isEditMode && this.employee?._id) {
      this.update.emit({ id: this.employee._id, dto });
    } else {
      this.save.emit(dto);
    }
  }

  onNew(): void {
    this.employeeForm.reset();
    this.close.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
