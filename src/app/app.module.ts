import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DisplayFieldComponent} from './display-field/display-field.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DisplayGeneratorComponent} from './display-generator/display-generator.component';
import {StatGraphComponent} from './stat-graph/stat-graph.component';
import {LineChartModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigGeneratorComponent} from './config-generator/config-generator.component';
import {MatButtonModule, MatExpansionModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DisplayFieldComponent,
    DisplayGeneratorComponent,
    StatGraphComponent,
    ConfigGeneratorComponent,


  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    BrowserAnimationsModule,

    MatInputModule,
    MatButtonModule,
    MatExpansionModule,

    LineChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
