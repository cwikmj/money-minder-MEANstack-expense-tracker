import { Routes } from '@angular/router';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { AuthComponent } from './components/shared/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'statistics',
        loadComponent: () => import('./components/statistics/statistics.component').then(m => m.StatisticsComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'accounts',
        loadComponent: () => import('./components/accounts/accounts.component').then(m => m.AccountsComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard],
    },
    {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [AuthGuard],
    }
]

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./components/shared/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./components/shared/signup/signup.component').then(m => m.SignupComponent)
            }

        ]
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: dashboardRoutes
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
