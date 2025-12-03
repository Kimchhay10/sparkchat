import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/feature/home-page/home-page').then(
        (m) => m.HomePageComponent
      ),
  },
];
