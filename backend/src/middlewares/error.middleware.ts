import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseWrapper } from '../utils/response.wrapper';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('💥 [GlobalErrorHandler]:', err);

  if (err instanceof ZodError) {
    const rawIssues = (err as any).issues || (err as any).errors || [];
    const issues = rawIssues.map((e: any) => ({
      campo: (e.path || []).join('.'),
      mensaje: e.message,
    }));
    return ResponseWrapper.error(
      res,
      'Validación perimetral fallida',
      issues,
      400
    );
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  return ResponseWrapper.error(res, message, null, statusCode);
};
