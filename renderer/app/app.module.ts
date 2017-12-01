import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { PrimengModule, RoutingModule, MaterialModule } from './infrastructure';

import { PropertiesPipe } from './properties.pipe';

import { HomeComponent } from './home/home.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ResizablePanelComponent } from './resizable-panel/resizable-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PropertiesPipe,
    SideBarComponent,
    ResizablePanelComponent
  ],
  imports: [
    BrowserModule,
    PrimengModule,
    RoutingModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
