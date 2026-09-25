export interface EmployeeRepositoryInterface {
  createEmployee(employeeData: any): Promise<any>;
  getEmployeeById(employeeId: string): Promise<any>;
  updateEmployee(employeeId: string, employeeData: any): Promise<any>;
  deleteEmployee(employeeId: string): Promise<void>;
  getAllEmployees(): Promise<any[]>;
}

export abstract class IEmpleadoRepository implements EmployeeRepositoryInterface {
  abstract createEmployee(employeeData: any): Promise<any>;
  abstract getEmployeeById(employeeId: string): Promise<any>;
  abstract updateEmployee(employeeId: string, employeeData: any): Promise<any>;
  abstract deleteEmployee(employeeId: string): Promise<void>;
  abstract getAllEmployees(): Promise<any[]>;
}

export { IEmpleadoRepository as IEmployeeRepository };
export default IEmpleadoRepository;
