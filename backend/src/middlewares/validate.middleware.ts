import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseWrapper } from '../utils/response.wrapper';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const rawIssues = (error as any).issues || (error as any).errors || [];
        const issues = rawIssues.map((err: any) => ({
          campo: (err.path || []).join('.') || 'body',
          mensaje: err.message,
        }));
        return ResponseWrapper.error(
          res,
          'Validación perimetral fallida en el cuerpo de la petición',
          issues,
          400
        );
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const rawIssues = (error as any).issues || (error as any).errors || [];
        const issues = rawIssues.map((err: any) => ({
          parametro: (err.path || []).join('.') || 'params',
          mensaje: err.message,
        }));
        return ResponseWrapper.error(
          res,
          'Validación perimetral fallida en los parámetros de la URL',
          issues,
          400
        );
      }
      next(error);
    }
  };
};
