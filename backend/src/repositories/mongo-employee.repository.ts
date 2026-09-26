import { EmployeeRepositoryInterface } from './employee.repository.interface.js';
import Empleado from '../models/empleado.js';

export class MongoEmployeeRepository implements EmployeeRepositoryInterface {
  async createEmployee(employeeData: any): Promise<any> {
    const newEmployee = new Empleado(employeeData);
    return await newEmployee.save();
  }

  async getEmployeeById(employeeId: string): Promise<any> {
    return await Empleado.findById(employeeId);
  }

  async getAllEmployees(): Promise<any[]> {
    return await Empleado.find();
  }

  async findAllEmployees(): Promise<any[]> {
    return await this.getAllEmployees();
  }

  async updateEmployee(employeeId: string, employeeData: any): Promise<any> {
    return await Empleado.findByIdAndUpdate(employeeId, employeeData, { new: true });
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await Empleado.findByIdAndDelete(employeeId);
  }
}

export default MongoEmployeeRepository;
