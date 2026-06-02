import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DepartamentoService } from '../../service/departamento.service';
import { Departamento } from '../../model/departamento.model';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './departamentos.html',
  styleUrls: ['./departamentos.scss']
})
export class DepartamentoComponent implements OnInit {
  private service = inject(DepartamentoService);
  private cdr = inject(ChangeDetectorRef);
  
  lista: Departamento[] = [];
  novo: Departamento = { nome: '', descricao: '', ativo: true };

  ngOnInit() { this.carregar(); }

  carregar() { 
    this.service.listar().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    }); 
  }

  salvar() { 
    this.service.criar(this.novo).subscribe(() => { 
      this.carregar(); 
      this.limparForm();
    }); 
  }

  deletar(id: number) { 
    this.service.deletar(id).subscribe(() => this.carregar()); 
  }

  private limparForm() {
    this.novo = { nome: '', descricao: '', ativo: true };
  }
}