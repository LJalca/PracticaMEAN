import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository.js';
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
  EmployeeParamsSchema,
} from '../dtos/employee.dto.js';
import {
  validateBody,
  validateParams,
} from '../middlewares/validate.middleware.js';

const router = Router();
const employeeRepository = new MongoEmployeeRepository();
const empleadoController = new EmpleadoController(employeeRepository);

// Rutas exclusivamente en español: /empleados
router.get('/empleados', empleadoController.getAllEmployees);

router.post(
  '/empleados',
  validateBody(CreateEmployeeSchema),
  empleadoController.createEmployee
);

router.get(
  '/empleados/:id',
  validateParams(EmployeeParamsSchema),
  empleadoController.getEmployeeById
);

router.put(
  '/empleados/:id',
  validateParams(EmployeeParamsSchema),
  validateBody(UpdateEmployeeSchema),
  empleadoController.updateEmployee
);

router.delete(
  '/empleados/:id',
  validateParams(EmployeeParamsSchema),
  empleadoController.deleteEmployee
);

export default router;