import {
  NgModule,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app.component';
import { ElementsTableComponent } from './features/elements-table/components/elements-table/elements-table.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ElementsTableComponent, SharedModule],
  providers: [
    provideAnimationsAsync(),
    provideExperimentalZonelessChangeDetection(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
