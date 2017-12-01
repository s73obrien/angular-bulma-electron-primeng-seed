import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// In the interest of efficiency, one could go through all of
// these imports and make them in this form:
//  import { ButtonModule } from 'primeng/primeng/components/button/button';

// This will result in a smaller bundle size
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  DialogModule,
  TreeTableModule,
  CalendarModule,
} from 'primeng/primeng';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AccordionModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    TreeTableModule,
    CalendarModule,
  ],
  exports: [
    AccordionModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    TreeTableModule,
    CalendarModule,
  ]
})
export class PrimengModule { }
