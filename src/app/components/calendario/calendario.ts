import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartamentoService } from '../../service/departamento.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Escala, EscalaService } from '../../service/escala.service';
import { EventoService } from '../../service/evento.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss'],
})
export class CalendarioComponent implements OnInit {
  selectedDate: Date = new Date();
  weekDays: Date[] = [];
  eventos: any[] = [];

  private eventoService = inject(EventoService);
  private dialog = inject(MatDialog);
  private deptoService = inject(DepartamentoService);
  private escalaService = inject(EscalaService);
  private location = inject(Location);
  escalas: Escala[] = [];
  departamentos: any[] = [];
  pessoas: any[] = [];
  constructor() {
  }
  ngOnInit() {
  // Usamos forkJoin para garantir que tudo carregue antes de atualizar a semana
  // Isso evita que a tela tente renderizar nomes antes de ter os dados
  import('rxjs').then(({ forkJoin }) => {
    forkJoin({
      eventos: this.eventoService.listar(),
      depts: this.escalaService.listarDepartamentos(),
      pessoas: this.escalaService.listarPessoas()
    }).subscribe(({ eventos, depts, pessoas }) => {
      this.eventos = eventos;
      this.departamentos = depts;
      this.pessoas = pessoas;
      
      // Agora que temos os catálogos, podemos buscar as escalas
      this.updateWeek(new Date());
    });
  });
}
  getNomeEvento(id: number | undefined) {
    if (id === undefined) return 'Evento';
    return this.eventos.find((e) => e.id === id)?.nome || 'Evento';
  }
  getNomeDepto(id: number) {
    return this.departamentos.find((d) => d.id === id)?.nome || 'Depto';
  }
  getNomePessoa(id: number) {
    return this.pessoas.find((p) => p.id === id)?.nome || 'Pessoa';
  }
  updateWeek(date: Date) {
    this.selectedDate = date; // Atualiza a data selecionada
    this.weekDays = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    // Calcula o final da semana para filtrar
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      this.weekDays.push(d);
    }
    this.escalaService.listar().subscribe((data) => {
      // Filtra as escalas que caem nesta semana
      this.escalas = data.filter((e) => {
        const eDate = new Date(e.data);
        return eDate >= start && eDate <= end;
      });
    });
  }
  getEscalasDoDia(dia: Date): Escala[] {
  const escalasDoDia = this.escalas.filter((e) => {
    return new Date(e.data).toDateString() === dia.toDateString();
  });
  return escalasDoDia;
}

  voltar() {
    this.location.back();
  }
}
