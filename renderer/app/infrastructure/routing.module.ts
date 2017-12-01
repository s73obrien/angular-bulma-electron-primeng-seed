import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularComponent } from '../angular/angular.component';
import { BulmaComponent } from '../bulma/bulma.component';
import { ElectronComponent } from '../electron/electron.component';
import { PrimengComponent } from '../primeng/primeng.component';

import { HomeComponent } from '../home/home.component';

const applicationRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'angular',
    component: AngularComponent
  },
  {
    path: 'bulma',
    component: BulmaComponent
  },
  {
    path: 'electron',
    component: ElectronComponent
  },
  {
    path: 'primeng',
    component: PrimengComponent
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
