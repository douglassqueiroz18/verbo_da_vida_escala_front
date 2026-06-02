import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'departamentos',
        loadComponent: () => import('./components/departamentos/departamentos').then(m => m.DepartamentoComponent)
    },
    {
        path: 'pessoas',
        loadComponent: () => import('./components/pessoa/pessoa').then(m => m.PessoaComponent)
    },
    {
        path: '',
        loadComponent: () => import('./components/menu/menu').then(m => m.MenuComponent)
    },
    {
        path: 'calendario',
        loadComponent: () => import('./components/calendario/calendario').then(m => m.CalendarioComponent)
    },
    {
        path: 'escala',
        loadComponent: () => import('./components/escala/escala').then(m => m.EscalaComponent)
    },
    {
        path: 'evento',
        loadComponent: () => import('./components/evento/evento').then(m => m.EventoComponent)
    }
];