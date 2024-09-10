import { JsonPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, delay, first, tap } from 'rxjs';
import { TABLE_COLUMNS, TABLE_CONFIG } from '../../constants/table-config';
import { PERIODIC_ELEMENT_FILTERABLE_PROPERTIES } from '../../models/periodic-element';
import { ElementsService } from '../../services/elements-service.service';
import { PeriodicElement } from './../../models/periodic-element';

const MATERIAL_IMPORTS = [
  MatTableModule,
  MatProgressSpinnerModule,
  MatFormField,
  MatLabel,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
];

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [MATERIAL_IMPORTS, FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './elements-table.component.html',
  styleUrl: './elements-table.component.scss',
})
export class ElementsTableComponent implements OnInit {
  protected TABLE_CONFIG = TABLE_CONFIG;
  protected TABLE_COLUMNS = TABLE_COLUMNS;
  protected elements: WritableSignal<PeriodicElement[]> = signal([]);
  protected filterCtrl = new FormControl('');
  protected filteredValue = toSignal(
    this.filterCtrl.valueChanges.pipe(debounceTime(2_000))
  );

  protected filteredElements = computed(() => {
    return this.elements().filter((el) => {
      return Object.entries(el)
        .filter(
          ([propName]) =>
            PERIODIC_ELEMENT_FILTERABLE_PROPERTIES[
              propName as keyof PeriodicElement
            ]
        )
        .reduce((acc, [, value]) => acc + value, '')
        .toLowerCase()
        .includes((this.filteredValue() ?? '').toLowerCase());
    });
  });
  protected elements$ = toObservable(this.filteredElements);

  protected onClearClick() {
    this.filterCtrl.setValue('');
  }

  public ngOnInit(): void {
    getElements.call(this);

    function getElements(this: ElementsTableComponent) {
      this._elements$.subscribe();
    }
  }
  private _elements$ = this._elementsService.getElements$().pipe(
    takeUntilDestroyed(this._destroyRef),
    delay(100),
    first(),
    tap((elements) => this.elements.set(elements))
  );

  constructor(
    private _elementsService: ElementsService,
    private _destroyRef: DestroyRef
  ) {}
}
