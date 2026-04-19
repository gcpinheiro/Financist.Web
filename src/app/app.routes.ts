import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page.component').then(
            (component) => component.LoginPageComponent
          ),
        data: {
          title: 'Welcome back',
          subtitle: 'Sign in to access your finance workspace.'
        }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register-page.component').then(
            (component) => component.RegisterPageComponent
          ),
        data: {
          title: 'Create account',
          subtitle: 'Set up your Financist workspace access.'
        }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page.component').then(
            (component) => component.DashboardPageComponent
          ),
        data: {
          title: 'Dashboard',
          subtitle: 'A live pulse of balances, cashflow, and spending patterns.'
        }
      },
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./features/ai-assistant/pages/ai-assistant-page.component').then(
            (component) => component.AiAssistantPageComponent
          ),
        data: {
          title: 'AI Assistant',
          subtitle: 'Ask for financial context, summaries, and next-step guidance from one workspace chat.'
        }
      },
      {
        path: 'transactions',
        data: {
          title: 'Transactions',
          subtitle: 'Track inflows, outflows, and account activity with confidence.'
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/transactions/pages/transactions-page.component').then(
                (component) => component.TransactionsPageComponent
              )
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/transactions/pages/create-transaction-page.component').then(
                (component) => component.CreateTransactionPageComponent
              ),
            data: {
              title: 'New transaction',
              subtitle: 'Capture movement across accounts, categories, and cards.'
            }
          }
        ]
      },
      {
        path: 'categories',
        data: {
          title: 'Categories',
          subtitle: 'Shape spending structure with clear budgeting buckets.'
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/categories/pages/categories-page.component').then(
                (component) => component.CategoriesPageComponent
              )
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/categories/pages/create-category-page.component').then(
                (component) => component.CreateCategoryPageComponent
              ),
            data: {
              title: 'New category',
              subtitle: 'Define a budget lane and visual identity for new activity.'
            }
          }
        ]
      },
      {
        path: 'cards',
        data: {
          title: 'Cards',
          subtitle: 'Monitor credit lines, due dates, and payment readiness.'
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/cards/pages/cards-page.component').then(
                (component) => component.CardsPageComponent
              )
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/cards/pages/create-card-page.component').then(
                (component) => component.CreateCardPageComponent
              ),
            data: {
              title: 'New card',
              subtitle: 'Register a credit or debit card and its operating details.'
            }
          }
        ]
      },
      {
        path: 'goals',
        data: {
          title: 'Goals',
          subtitle: 'Keep savings targets visible, measurable, and motivating.'
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/goals/pages/goals-page.component').then(
                (component) => component.GoalsPageComponent
              )
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/goals/pages/create-goal-page.component').then(
                (component) => component.CreateGoalPageComponent
              ),
            data: {
              title: 'New goal',
              subtitle: 'Create a target with milestones, deadlines, and momentum.'
            }
          }
        ]
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./features/documents/pages/documents-page.component').then(
            (component) => component.DocumentsPageComponent
          ),
        data: {
          title: 'Documents',
          subtitle: 'Upload statements and keep imports centralized for reconciliation.'
        }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings-page.component').then(
            (component) => component.SettingsPageComponent
          ),
        data: {
          title: 'Settings',
          subtitle: 'Configure preferences, policies, and integration readiness.'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
