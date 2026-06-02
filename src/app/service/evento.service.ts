import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private url = '/api/eventos/';
  private urlDepts = '/api/departamentos/';

  listarEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  criar(evento: any): Observable<any> {
    return this.http.post<any>(this.url, evento);
  }

  listarDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.urlDepts);
  }
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}