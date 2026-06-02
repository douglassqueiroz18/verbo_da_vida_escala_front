import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/eventos/`;
  private urlDepts = `${environment.apiUrl}/departamentos/`;

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