import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../model/departamento.model';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private apiUrl = '/api/departamentos/';

  constructor(private http: HttpClient) {}

  listar(): Observable<Departamento[]> { return this.http.get<Departamento[]>(this.apiUrl); }
  
  criar(d: Departamento): Observable<Departamento> { return this.http.post<Departamento>(this.apiUrl, d); }
  
  atualizar(id: number, d: Departamento): Observable<Departamento> { return this.http.put<Departamento>(`${this.apiUrl}${id}/`, d); }
  
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}${id}/`); }
}