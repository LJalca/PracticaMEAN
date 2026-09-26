import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
})
export class EmployeeTableComponent {
  // [Reto 4]: Componente Dumb conectado exclusivamente mediante @Input() y @Output()
  @Input() employees: Employee[] = [];
  @Input() loading: boolean = false;
  @Input() selectedEmployeeId: string | null = null;

  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();
  @Output() select = new EventEmitter<Employee>();

  sortColumn: keyof Employee = 'nombre';
  sortDirection: 'asc' | 'desc' = 'asc';

  getInitials(name: string): string {
    if (!name) return 'EMP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  getDepartmentBadgeClass(dept: string): string {
    const d = (dept || '').toLowerCase();
    if (d.includes('innova') || d.includes('desarr')) return 'dept-innovacion';
    if (d.includes('ti') || d.includes('sist') || d.includes('softw')) return 'dept-ti';
    if (d.includes('finan') || d.includes('contab')) return 'dept-finanzas';
    if (d.includes('rrhh') || d.includes('talento') || d.includes('pers')) return 'dept-rrhh';
    return 'dept-general';
  }

  getAvatarColor(name: string): string {
    const colors = ['#0078d4', '#107c41', '#d83b01', '#8764b8', '#038387', '#b146c2', '#498205'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  }

  sortBy(column: keyof Employee): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get sortedEmployees(): Employee[] {
    return [...this.employees].sort((a, b) => {
      const valA = a[this.sortColumn] ?? '';
      const valB = b[this.sortColumn] ?? '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = valA.toString().toLowerCase();
      const strB = valB.toString().toLowerCase();
      return this.sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }
}
