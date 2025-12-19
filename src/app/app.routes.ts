import { Routes } from '@angular/router';
import { LoginComponent } from './core/feature/auth/login/login';
import { RegisterComponent } from './core/feature/auth/register/register';
import { UnauthorizedLayout } from './shared/components/layout/unauthorized-layout/unauthorized-layout';
import { GuestLayout } from './shared/components/layout/guest-layout/guest-layout';
import { AdminLayout } from './shared/components/layout/admin-layout/admin-layout';
import { AuthGuard } from './core/guard/auth-guard';
import { GuestGuard } from './core/guard/guest-guard';
import { NotFoundComponent } from './core/feature/not-found/not-found';
import { UnauthorizedComponent } from './core/feature/unauthorized/unauthorized';
import { ServerErrorComponent } from './core/feature/server-error/server-error';

export const routes: Routes = [
  {
    path: '',
    component: GuestLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./core/feature/landing/landing').then(
            (m) => m.LandingComponent
          ),
      },
    ],
  },
  {
    path: 'roadmap',
    loadComponent: () =>
      import('./core/feature/roadmap/roadmap').then((m) => m.RoadmapComponent),
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./core/feature/home-page/home-page').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'learning',
        loadComponent: () =>
          import('./core/feature/learning/learning').then(
            (m) => m.LearningComponent
          ),
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./core/feature/community/community').then(
            (m) => m.CommunityComponent
          ),
      },
      {
        path: 'entrepreneur',
        loadComponent: () =>
          import('./core/feature/entrepreneur/entrepreneur').then(
            (m) => m.EntrepreneurComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./core/feature/home-page/home-page').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./core/feature/home-page/home-page').then(
            (m) => m.HomePageComponent
          ),
      },
    ],
  },
  {
    path: '',
    component: UnauthorizedLayout,
    canActivate: [GuestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
