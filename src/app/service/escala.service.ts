import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Escala {
  id?: number;
  data: string;
  evento?: number;
  pessoa: number;
  departamento: number;
}

// Payload conforme sua especificação
export type EscalaPayload = {
  data: string;
  evento?: number;
  pessoa: number;
  departamento: number;
};

@Injectable({ providedIn: 'root' })
export class EscalaService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  listar(): Observable<Escala[]> {
    return this.http.get<Escala[]>(`${this.baseUrl}/escalas/`);
  }
  criar(pessoa: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/escalas/`, pessoa).pipe(
      catchError((error: HttpErrorResponse) => {
        
        return throwError(() => error);
      }),
    );
  }
  atualizar(id: number, e: EscalaPayload): Observable<Escala> {
  return this.http.put<Escala>(`${this.baseUrl}/escalas/${id}/`, e).pipe(
    catchError((error: HttpErrorResponse) => throwError(() => error))
  );
  }
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/escalas/${id}/`);
  }

  // Métodos de apoio para os selects
  listarPessoasPorDepartamento(departamentoId: number) {
    const params = new HttpParams().set('departamento', departamentoId.toString());
    return this.http.get<any[]>(`${this.baseUrl}/pessoas/`, { params });
  }
  listarDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/departamentos/`);
  }
  listarEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/eventos/`);
  }
  listarPessoas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pessoas/`);
  }
}
