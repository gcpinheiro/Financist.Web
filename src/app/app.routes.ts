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
          title: 'Entrar',
          subtitle: 'Acesse sua conta para acompanhar a rotina financeira.'
        }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register-page.component').then(
            (component) => component.RegisterPageComponent
          ),
        data: {
          title: 'Criar conta',
          subtitle: 'Configure seu acesso ao Financist.'
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
          title: 'Visão geral',
          subtitle: 'Acompanhe saldos, fluxo de caixa e movimentações do dia.'
        }
      },
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./features/ai-assistant/pages/ai-assistant-page.component').then(
            (component) => component.AiAssistantPageComponent
          ),
        data: {
          title: 'Assistente financeiro',
          subtitle: 'Consulte contexto financeiro, resumos e próximos passos em um único chat.'
        }
      },
      {
        path: 'transactions',
        data: {
          title: 'Transações',
          subtitle: 'Acompanhe entradas, saídas e a atividade das contas com clareza.'
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
              title: 'Nova transação',
              subtitle: 'Registre a movimentação com categoria, conta e contexto.'
            }
          }
        ]
      },
      {
        path: 'categories',
        data: {
          title: 'Categorias',
          subtitle: 'Organize a estrutura financeira com categorias claras e consistentes.'
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
              title: 'Nova categoria',
              subtitle: 'Cadastre uma nova categoria para manter a leitura dos lançamentos.'
            }
          }
        ]
      },
      {
        path: 'cards',
        data: {
          title: 'Cartões',
          subtitle: 'Monitore limite, fechamento e vencimento em um único lugar.'
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
              title: 'Novo cartão',
              subtitle: 'Cadastre os dados do cartão para acompanhar limites e ciclo.'
            }
          }
        ]
      },
      {
        path: 'goals',
        data: {
          title: 'Metas',
          subtitle: 'Mantenha objetivos de reserva e investimento sempre visíveis.'
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
              title: 'Nova meta',
              subtitle: 'Defina alvo, prazo e valor inicial para acompanhar a evolução.'
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
          title: 'Documentos',
          subtitle: 'Centralize importações e extratos para conciliação.'
        }
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings-page.component').then(
            (component) => component.SettingsPageComponent
          ),
        data: {
          title: 'Configurações',
          subtitle: 'Ajuste preferências, dados da conta e futuras integrações.'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
