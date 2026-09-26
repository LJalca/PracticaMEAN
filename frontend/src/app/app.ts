import { Component } from '@angular/core';
import { EmployeeSmartComponent } from './components/employee-smart/employee-smart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeSmartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
