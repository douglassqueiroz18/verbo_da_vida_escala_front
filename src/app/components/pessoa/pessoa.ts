import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PessoaService } from '../../service/pessoa.service';
import { DepartamentoService } from '../../service/departamento.service';
import { Pessoa } from '../../model/pessoa.model';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  templateUrl: './pessoa.html',
  styleUrls: ['./pessoa.scss'],
})
export class PessoaComponent implements OnInit, AfterViewInit {
  private pessoaService = inject(PessoaService);
  private deptoService = inject(DepartamentoService); 

  lista = new MatTableDataSource<Pessoa>([]);
  departamentos: any[] = []; 
  novo: any = { id: null, nome: '', telefone: '', departamentos: [] };

  ngOnInit() {
    this.deptoService.listar().subscribe(d => this.departamentos = d); 
  }

  ngAfterViewInit() {
    this.carregar();
  }

  carregar() { 
    this.pessoaService.listar().subscribe(data => {
      this.lista.data = data || []; // Garante que nunca seja null
    }); 
  }

  salvar() {
    const operacao$ = this.novo.id 
      ? this.pessoaService.atualizar(this.novo.id, this.novo) 
      : this.pessoaService.criar(this.novo);

    operacao$.subscribe({
      next: () => {
        this.carregar();
        this.limparForm();
      },
      error: (err) => alert(err.error?.non_field_errors?.[0] || 'Erro ao salvar.')
    });
  }

  editar(p: Pessoa) {
    // Importante: certifique-se de que departamentos é sempre um array
    this.novo = { ...p, departamentos: p.departamentos || [] }; 
  }

  deletar(id: number) {
    if(confirm('Confirma a exclusão?')) {
      this.pessoaService.deletar(id).subscribe(() => this.carregar());
    }
  }

  limparForm() {
    this.novo = { id: null, nome: '', telefone: '', departamentos: [] };
  }
  
  getNomeDepartamento(ids: number[] | null): string {
    if (!ids || ids.length === 0) return 'Nenhum';
    return this.departamentos
      .filter(d => ids.includes(d.id))
      .map(d => d.nome)
      .join(', ');
  }
}