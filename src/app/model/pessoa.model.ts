import { Departamento } from "./departamento.model";

export interface Pessoa {
  id?: number;
  nome: string;
  telefone: string;
  email: string;
  departamentos?: Departamento[]; // Agora é um array de objetos
}