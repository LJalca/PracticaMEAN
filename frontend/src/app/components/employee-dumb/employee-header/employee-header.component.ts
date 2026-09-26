import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-header',
  standalone: true,
  templateUrl: './employee-header.component.html',
  styleUrl: './employee-header.component.css',
})
export class EmployeeHeaderComponent {
  @Input() employeeCount: number = 0;
}
