import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { PrimengModule } from './primeng/primeng.module';
import { PropertiesPipe } from './properties.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PropertiesPipe
  ],
  imports: [
    BrowserModule,
    PrimengModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
