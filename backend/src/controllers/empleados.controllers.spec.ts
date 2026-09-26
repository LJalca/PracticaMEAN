import { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { EmpleadoController } from './empleados.controllers';
import type IEmpleadoRepository from '../repositories/employee.repository.interface';

describe('EmpleadoController: 3 positivos y 3 negativos', () => {
  let controller: EmpleadoController;
  let mockRepository: jest.Mocked<IEmpleadoRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let nextMock: jest.MockedFunction<NextFunction>;

  const id = '507f1f77bcf86cd799439011';
  const empleadoOk = {
    _id: id,
    nombre: 'Andrés Mendoza',
    cargo: 'Arquitecto',
    departamento: 'TI',
    sueldo: 4000,
  };

  beforeEach(() => {
    mockRepository = {
      getAllEmployees: jest.fn(),
      getEmployeeById: jest.fn(),
      createEmployee: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
    };

    controller = new EmpleadoController(mockRepository);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    nextMock = jest.fn();
    mockResponse = {
      status: statusMock,
      setHeader: jest.fn(),
    };
    mockRequest = { params: { id }, body: empleadoOk };
  });

  describe('positivos', () => {
    it('CP01 GET lista: responde 200 con los empleados del repositorio falso', async () => {
      mockRepository.getAllEmployees.mockResolvedValue([empleadoOk]);

      await controller.getAllEmployees(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Lista de empleados obtenida exitosamente',
        data: [empleadoOk],
      });
      expect(mockRepository.getAllEmployees).toHaveBeenCalledTimes(1);
    });

    it('CP02 PUT actualiza: responde 200 con el empleado modificado', async () => {
      const actualizado = { ...empleadoOk, sueldo: 4500 };
      mockRepository.updateEmployee.mockResolvedValue(actualizado);
      mockRequest = { params: { id }, body: { sueldo: 4500 } };

      await controller.updateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(mockRepository.updateEmployee).toHaveBeenCalledWith(id, { sueldo: 4500 });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Empleado actualizado exitosamente',
        data: actualizado,
      });
    });

    it('CP03 DELETE elimina: responde 200 cuando el repositorio borra el id', async () => {
      mockRepository.deleteEmployee.mockResolvedValue(undefined);

      await controller.deleteEmployee(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(mockRepository.deleteEmployee).toHaveBeenCalledWith(id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Empleado eliminado correctamente',
        data: null,
      });
    });
  });

  describe('negativos', () => {
    it('CE01 GET por id: responde 404 si el empleado no existe', async () => {
      mockRepository.getEmployeeById.mockResolvedValue(null);

      await controller.getEmployeeById(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Empleado no encontrado',
        details: { id },
      });
    });

    it('CE02 PUT: responde 404 si el id a actualizar no existe', async () => {
      mockRepository.updateEmployee.mockResolvedValue(null);
      mockRequest = { params: { id }, body: { sueldo: 4500 } };

      await controller.updateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Empleado a actualizar no encontrado',
        details: { id },
      });
    });

    it('CE03 DELETE: si el repositorio falla, el controlador entrega el error', async () => {
      const fallo = new Error('No se pudo eliminar el empleado');
      mockRepository.deleteEmployee.mockRejectedValue(fallo);

      await controller.deleteEmployee(
        mockRequest as Request,
        mockResponse as Response,
        nextMock
      );

      expect(nextMock).toHaveBeenCalledWith(fallo);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
