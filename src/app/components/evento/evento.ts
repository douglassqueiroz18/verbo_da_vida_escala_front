import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EventoService } from '../../service/evento.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-evento',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule
  ],
  templateUrl: './evento.html',
})
export class EventoComponent implements OnInit {
  private service = inject(EventoService);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  lista: any[] = [];
  novo: any = { nome: '', data: new Date(), tipo_evento: '' };

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe((data) => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  salvar() {
    // Formata a data para YYYY-MM-DD conforme o backend espera
    const eventoPayload = {
      ...this.novo,
      data:
        this.novo.data instanceof Date
          ? this.novo.data.toISOString().split('T')[0]
          : this.novo.data,
    };

    this.service.criar(eventoPayload).subscribe(() => {
      this.carregar();
      this.limparForm();
    });
  }

  limparForm() {
    this.novo = { nome: '', data: new Date(), tipo_evento: '' };
  }
  voltar() {
    this.location.back();
  }
}
