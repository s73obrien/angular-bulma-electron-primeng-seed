import { NgModule } from '@angular/core';

import {
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatInputModule,
  MatIconModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule
  ]
})
export class MaterialModule { }
