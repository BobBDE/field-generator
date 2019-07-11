import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DisplayFieldComponent } from './display-field/display-field.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { DisplayGeneratorComponent } from './display-generator/display-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayFieldComponent,
    DisplayGeneratorComponent,


  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
