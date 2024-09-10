import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ELEMENT_DATA } from '../constants/elements';
import { PeriodicElement } from '../models/periodic-element';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  public getElements$() {
    return of(structuredClone(ELEMENT_DATA) as PeriodicElement[]);
  }
}
