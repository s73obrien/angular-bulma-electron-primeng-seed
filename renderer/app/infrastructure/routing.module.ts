import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';

const applicationRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '*',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(applicationRoutes,
      {
        // enableTracing: true,
        useHash: true
      }),
  ],
  exports: [
    RouterModule,
  ]
})
export class RoutingModule { }
