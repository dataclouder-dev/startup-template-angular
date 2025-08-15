import { Routes } from '@angular/router';
import { GenericsComponent } from './generics.component';
import { GenericListComponent } from './generic-list/generic-list.component';
import { GenericDetailComponent } from './generic-detail/generic-detail.component';
import { GenericFormComponent } from './generic-form/generic-form.component';

export const GENERICS_ROUTES: Routes = [
  {
    path: '',
    component: GenericsComponent,
    children: [
      {
        path: '',
        component: GenericListComponent,
      },
      {
        path: 'details/:id',
        component: GenericDetailComponent,
      },
      {
        path: 'edit',
        component: GenericFormComponent,
      },
      {
        path: 'edit/:id',
        component: GenericFormComponent,
      },
    ],
  },
];
