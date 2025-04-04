import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: 'add', component: ProductFormComponent },
      { path: 'editar/:id', component: ProductFormComponent },
    ],
  }
]
