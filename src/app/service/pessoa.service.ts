import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../model/pessoa.model';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pessoas/`;

  listar(): Observable<Pessoa[]> { return this.http.get<Pessoa[]>(this.apiUrl); }
  criar(p: Pessoa): Observable<Pessoa> { return this.http.post<Pessoa>(this.apiUrl, p); }
  deletar(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}${id}/`); }
  listarPorDataEDepto(data: string, deptoId: number): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(`${this.apiUrl}voluntarios/?data=${data}&departamento=${deptoId}`);
  }
  atualizar(id: number, p: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}${id}/`, p);
  }
}