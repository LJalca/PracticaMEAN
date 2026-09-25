import type { Request, Response, NextFunction } from 'express';
import IEmpleadoRepository from '../repositories/employee.repository.interface';
import { ResponseWrapper } from '../utils/response.wrapper';

export class EmpleadoController {
  constructor(private empleadoRepository: IEmpleadoRepository) {}

  getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.empleadoRepository.getAllEmployees();
      return ResponseWrapper.success(
        res,
        employees,
        'Lista de empleados obtenida exitosamente'
      );
    } catch (error) {
      next(error);
    }
  };

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newEmployee = await this.empleadoRepository.createEmployee(req.body);
      return ResponseWrapper.success(
        res,
        newEmployee,
        'Empleado creado exitosamente',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.empleadoRepository.getEmployeeById(req.params.id as string);
      if (!employee) {
        return ResponseWrapper.error(
          res,
          'Empleado no encontrado',
          { id: req.params.id },
          404
        );
      }
      return ResponseWrapper.success(
        res,
        employee,
        'Empleado obtenido exitosamente'
      );
    } catch (error) {
      next(error);
    }
  };

  updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedEmployee = await this.empleadoRepository.updateEmployee(
        req.params.id as string,
        req.body
      );
      if (!updatedEmployee) {
        return ResponseWrapper.error(
          res,
          'Empleado a actualizar no encontrado',
          { id: req.params.id },
          404
        );
      }
      return ResponseWrapper.success(
        res,
        updatedEmployee,
        'Empleado actualizado exitosamente'
      );
    } catch (error) {
      next(error);
    }
  };

  deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.empleadoRepository.deleteEmployee(req.params.id as string);
      return ResponseWrapper.success(
        res,
        null,
        'Empleado eliminado correctamente'
      );
    } catch (error) {
      next(error);
    }
  };
}

export default EmpleadoController;
