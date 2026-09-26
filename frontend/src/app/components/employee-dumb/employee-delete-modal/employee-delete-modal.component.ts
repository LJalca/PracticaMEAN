import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-delete-modal',
  standalone: true,
  templateUrl: './employee-delete-modal.component.html',
  styleUrl: './employee-delete-modal.component.css',
})
export class EmployeeDeleteModalComponent {
  // [Reto 4]: Componente Dumb conectado exclusivamente mediante @Input() y @Output()
  @Input() isOpen = false;
  @Input() employee: Employee | null = null;
  @Input() isDeleting = false;

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.employee?._id) {
      this.confirm.emit(this.employee._id);
    }
  }
}
