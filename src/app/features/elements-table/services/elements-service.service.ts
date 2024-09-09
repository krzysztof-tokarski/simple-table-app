import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ELEMENT_DATA } from '../constants/elements';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  public getElements$() {
    return of(ELEMENT_DATA);
  }
}
