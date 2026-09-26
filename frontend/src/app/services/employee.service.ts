import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import {
  Employee,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  ApiResponse,
  SystemNotification,
} from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/empleados';
  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8',
  });

  // [Reto 3]: BehaviorSubject privados para encapsular y gobernar el estado de manera atómica
  private readonly _employees$ = new BehaviorSubject<Employee[]>([]);
  private readonly _selectedEmployee$ = new BehaviorSubject<Employee | null>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _notification$ = new BehaviorSubject<SystemNotification | null>(null);

  // [Reto 3]: Flujos exponenciales de solo lectura (Observable$) hacia las capas consumidoras
  public readonly employees$: Observable<Employee[]> = this._employees$.asObservable();
  public readonly selectedEmployee$: Observable<Employee | null> = this._selectedEmployee$.asObservable();
  public readonly loading$: Observable<boolean> = this._loading$.asObservable();
  public readonly notification$: Observable<SystemNotification | null> = this._notification$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Carga el inventario completo de empleados aplicando mutación inmutable de referencia.
   */
  public loadEmployees(): Observable<Employee[]> {
    this._loading$.next(true);

    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl, { headers: this.defaultHeaders }).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      tap((employees) => {
        // Mutación inmutable de referencia ([...current])
        this._employees$.next([...employees]);
        this._loading$.next(false);
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMsg = this.extractErrorMessage(err);
        this._loading$.next(false);
        this.notify('error', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Registra un nuevo empleado e integra el nuevo elemento al estado inmutable ([...current, new]).
   */
  public createEmployee(dto: CreateEmployeeDTO): Observable<Employee> {
    this._loading$.next(true);

    return this.http.post<ApiResponse<Employee>>(this.apiUrl, dto, { headers: this.defaultHeaders }).pipe(
      map((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error || 'Error al crear empleado');
        }
        return res.data;
      }),
      tap((newEmployee) => {
        // [Reto 3]: Patrón de mutación de referencias inmutables [...current, new]
        const currentList = this._employees$.getValue();
        this._employees$.next([...currentList, newEmployee]);
        this._loading$.next(false);
        this.notify('success', `Empleado ${newEmployee.nombre} registrado exitosamente.`);
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMsg = this.extractErrorMessage(err);
        this._loading$.next(false);
        this.notify('error', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Actualiza un empleado existente mutando inmutablemente el arreglo vía proyección map.
   */
  public updateEmployee(id: string, dto: UpdateEmployeeDTO): Observable<Employee> {
    this._loading$.next(true);

    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, dto, { headers: this.defaultHeaders }).pipe(
      map((res) => {
        if (!res.success || !res.data) {
          throw new Error(res.error || 'Error al actualizar empleado');
        }
        return res.data;
      }),
      tap((updatedEmployee) => {
        // [Reto 3]: Mutación inmutable preservando inmutabilidad estructural
        const currentList = this._employees$.getValue();
        const updatedList = currentList.map((emp) =>
          emp._id === id ? { ...emp, ...updatedEmployee } : emp
        );
        this._employees$.next([...updatedList]);
        this._loading$.next(false);
        this.notify('success', `Empleado ${updatedEmployee.nombre} actualizado exitosamente.`);
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMsg = this.extractErrorMessage(err);
        this._loading$.next(false);
        this.notify('error', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Elimina un empleado por identificador único actualizando el flujo de manera inmutable (filter).
   */
  public deleteEmployee(id: string): Observable<void> {
    this._loading$.next(true);

    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        // [Reto 3]: Mutación inmutable excluyendo el registro
        const currentList = this._employees$.getValue();
        const filteredList = currentList.filter((emp) => emp._id !== id);
        this._employees$.next([...filteredList]);
        this._loading$.next(false);
        this.notify('success', 'Empleado eliminado del registro.');
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMsg = this.extractErrorMessage(err);
        this._loading$.next(false);
        this.notify('error', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Selecciona un empleado para edición o vista de detalles
   */
  public selectEmployee(employee: Employee | null): void {
    this._selectedEmployee$.next(employee ? { ...employee } : null);
  }

  /**
   * Despacha notificaciones flotantes temporizadas
   */
  public notify(type: 'success' | 'error' | 'info', message: string): void {
    this._notification$.next({ type, message });
    setTimeout(() => {
      if (this._notification$.getValue()?.message === message) {
        this._notification$.next(null);
      }
    }, 4500);
  }

  public clearNotification(): void {
    this._notification$.next(null);
  }

  /**
   * Extracción inteligente de errores provenientes del ResponseWrapper y Zod del backend
   */
  private extractErrorMessage(err: any): string {
    if (err?.error?.error) {
      if (err.error.details && Array.isArray(err.error.details)) {
        const firstIssue = err.error.details[0]?.message;
        return `${err.error.error}: ${firstIssue || ''}`;
      }
      return err.error.error;
    }
    if (err?.message) {
      return err.message;
    }
    return 'Ocurrió un error inesperado de comunicación con el servidor.';
  }
}
