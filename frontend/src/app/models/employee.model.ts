export interface Employee {
  _id?: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDTO {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
}

export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface SystemNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}
