import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app.component';
import { ElementsTableComponent } from './features/elements-table/components/elements-table/elements-table.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ElementsTableComponent],
  providers: [
    provideAnimationsAsync(),
    // provideExperimentalZonelessChangeDetection(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
