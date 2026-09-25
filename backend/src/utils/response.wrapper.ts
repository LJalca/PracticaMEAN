import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export class ResponseWrapper {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operación realizada exitosamente',
    statusCode: number = 200
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    error: string = 'Error en la operación',
    details: any = null,
    statusCode: number = 400
  ): Response {
    const payload: ApiResponse = {
      success: false,
      error,
      ...(details ? { details } : {}),
    };
    return res.status(statusCode).json(payload);
  }
}
