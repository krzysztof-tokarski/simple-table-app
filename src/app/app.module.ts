import {
  NgModule,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    provideAnimationsAsync(),
    provideExperimentalZonelessChangeDetection(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
