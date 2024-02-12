import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'home/:id',
        loadComponent: () =>
          import('../features/product-overview/product-overview.component').then((m) => m.ProductOverviewComponent),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('../features/add-product/add-product.component').then((m) => m.AddProductComponent),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../features/search/search.component').then((m) => m.SearchComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../features/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
