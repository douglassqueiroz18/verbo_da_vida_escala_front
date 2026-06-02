import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snack-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snack-error.html',
  styleUrl: './snack-error.scss',
})
export class SnackError {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<SnackError>
  ) {}

  // Métodos auxiliares para o template
  isString(value: any): boolean {
    return typeof value === 'string';
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }
formatarChave(chave: any): string {
  return String(chave);
}
  fechar() {
    this.snackBarRef.dismiss();
  }
}