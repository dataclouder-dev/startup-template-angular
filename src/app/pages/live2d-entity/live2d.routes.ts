import { Routes } from '@angular/router';
import { Live2dsComponent } from './live2ds.component';
import { Live2dListComponent } from './live2d-list/live2d-list.component';
import { Live2dDetailComponent } from './live2d-detail/live2d-detail.component';
import { Live2dFormComponent } from './live2d-form/live2d-form.component';

export const LIVE2DS_ROUTES: Routes = [
  {
    path: '',
    component: Live2dsComponent,
    children: [
      {
        path: '',
        component: Live2dListComponent,
      },
      {
        path: 'details/:id',
        component: Live2dDetailComponent,
      },
      {
        path: 'edit',
        component: Live2dFormComponent,
      },
      {
        path: 'edit/:id',
        component: Live2dFormComponent,
      },
    ],
  },
];
