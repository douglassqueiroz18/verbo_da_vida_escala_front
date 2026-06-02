import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { EscalaService, Escala, EscalaPayload } from '../../service/escala.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackError } from '../snack-error/snack-error';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-escala',
  standalone: true,
  providers: [
    provideNativeDateAdapter(), // Necessário para o Datepicker funcionar
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Define o idioma como Português
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './escala.html',
})
export class EscalaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EscalaService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  form = this.fb.group({
    id: [null],
    data: [new Date(), Validators.required],
    hora: ['19:00', Validators.required],
    evento: ['', Validators.required],
    departamento: ['', Validators.required],
    pessoa: ['', Validators.required],
  });

  escalas: Escala[] = [];
  departamentos: any[] = [];
  pessoas: any[] = [];
  evento: any[] = [];
  ngOnInit() {
    this.carregarDados();

    // Reage à mudança de departamento
    this.form.get('departamento')?.valueChanges.subscribe((value) => {
      // Converte o valor para número explicitamente
      const id = Number(value);

      if (id) {
        this.service.listarPessoasPorDepartamento(id).subscribe((p) => {
          this.pessoas = p;
        });
      } else {
        this.pessoas = []; // Limpa se o valor for inválido ou nulo
      }
    });
  }

  salvar() {
    console.log('1. Método salvar() iniciado');

    // 1. Validação do formulário
    if (this.form.invalid) {
      console.warn('2. Formulário inválido.');
      return;
    }

    // 2. Montagem do objeto (A DECLARAÇÃO ESTÁ AQUI)
    const formValue = this.form.value;

    const dataParte =
      formValue.data instanceof Date
        ? formValue.data.toISOString().split('T')[0]
        : String(formValue.data);

    const payload: EscalaPayload = {
      data: `${dataParte}T${formValue.hora}:00`,
      evento: Number(formValue.evento),
      pessoa: Number(formValue.pessoa),
      departamento: Number(formValue.departamento),
    };

    console.log('3. Formulário válido. Payload:', payload);

    // 3. Execução da requisição
    const request = formValue.id
      ? this.service.atualizar(formValue.id, payload)
      : this.service.criar(payload);

    console.log('4. Chamando o serviço...');

    // No Componente
    request.subscribe({
      next: (res) => {
        this.exibirMensagem('Escala salva com sucesso!', 'success-snackbar');
        this.carregarDados();
      },
      error: (err: HttpErrorResponse) => {
        // Aqui você trata a "beleza" da exibição
        let mensagemErro = 'Ocorreu um erro inesperado.';

        // Verifica se o erro veio do Django
        if (err.error) {
          // Caso 1: Erros de validação do Django (non_field_errors)
          if (err.error.non_field_errors) {
            mensagemErro = err.error.non_field_errors[0];
          }
          // Caso 2: Erros de campos específicos (ex: 'data': ['data inválida'])
          else if (typeof err.error === 'object') {
            const campos = Object.keys(err.error);
            mensagemErro = `Erro em ${campos[0]}: ${err.error[campos[0]]}`;
          }
        }

        this.tratarErro(err);
      },
    });
  }

  carregarDados() {
    this.service.listar().subscribe((data) => (this.escalas = data));
    this.service.listarDepartamentos().subscribe((d) => (this.departamentos = d));
    this.service.listarEventos().subscribe((e) => (this.evento = e));
    this.cdr.detectChanges(); // Garante que a view seja atualizada após carregar os dados
  }
  // Carrega os dados no formulário para edição
  editar(escala: Escala) {
    // Ajusta a data e hora para o formulário
    const dataObj = new Date(escala.data);
    const dataFormatada = dataObj.toISOString().split('T')[0];
    const horaFormatada = dataObj.toTimeString().substring(0, 5); // HH:mm

    this.form.patchValue({
      id: escala.id as any,
      data: dataObj,
      hora: horaFormatada,
      evento: String(escala.evento),
      departamento: String(escala.departamento),
      pessoa: String(escala.pessoa),
    });
  }

  // Remove o registro
  deletar(id: number | undefined) {
    if (id && confirm('Deseja realmente excluir esta escala?')) {
      this.service.excluir(id).subscribe(() => this.carregarDados());
    }
  }
  getNomeEvento(id: number | undefined) {
    return this.evento.find((e) => e.id === id)?.nome || 'Evento';
  }

  getNomeDepto(id: number | undefined) {
    return this.departamentos.find((d) => d.id === id)?.nome || 'Depto';
  }

  getNomePessoa(id: number | undefined) {
    return this.pessoas.find((p) => p.id === id)?.nome || 'Pessoa';
  }
  private exibirMensagem(msg: string, classe: string) {
  this.snackBar.open(msg, 'Fechar', {
    duration: 5000,
    panelClass: [classe]
  });
  }
  private tratarErro(err: HttpErrorResponse) {
  const errorData = err.error;
  if (errorData) {
    this.snackBar.openFromComponent(SnackError, {
      data: err.error, 
      panelClass: ['error-snackbar-style'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  } else {
    this.snackBar.open('Erro ao salvar. Verifique os campos.', 'Fechar', {
      duration: 3000,
      panelClass: ['error-snackbar-style']
    });
  }
}
  voltar() {
    this.location.back();
  }
}
