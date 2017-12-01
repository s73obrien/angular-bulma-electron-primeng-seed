import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { PrimengModule, RoutingModule } from './infrastructure';

import { PropertiesPipe } from './properties.pipe';

import { AngularComponent } from './angular/angular.component';
import { BulmaComponent } from './bulma/bulma.component';
import { ElectronComponent } from './electron/electron.component';
import { PrimengComponent } from './primeng/primeng.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    AngularComponent,
    BulmaComponent,
    ElectronComponent,
    PrimengComponent,
    HomeComponent,
    PropertiesPipe,
  ],
  imports: [
    BrowserModule,
    PrimengModule,
    RoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
