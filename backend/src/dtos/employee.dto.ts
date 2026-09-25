import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cargo: z
    .string()
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres'),
  departamento: z
    .string()
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres'),
  sueldo: z
    .number()
    .positive('El sueldo debe ser un número positivo mayor a 0'),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const EmployeeParamsSchema = z.object({
  id: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      'El ID proporcionado no tiene un formato válido de MongoDB ObjectId'
    ),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeParamsDTO = z.infer<typeof EmployeeParamsSchema>;
