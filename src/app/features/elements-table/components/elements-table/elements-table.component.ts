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
import { debounceTime, delay, filter, first, pipe, take, tap } from 'rxjs';
import { WithId } from 'src/app/shared';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TABLE_COLUMNS, TABLE_CONFIG } from '../../constants/table-config';
import { CloseEditElementPopupMessage } from '../../models/close-edit-element-popup-message';
import { PERIODIC_ELEMENT_FILTERABLE_PROPERTIES } from '../../models/periodic-element';
import { ElementsService } from '../../services/elements.service';
import { EditPropertyDialogComponent } from '../edit-property-dialog/edit-property-dialog.component';
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
  imports: [
    MATERIAL_IMPORTS,
    FormsModule,
    ReactiveFormsModule,
    EditPropertyDialogComponent,
  ],
  templateUrl: './elements-table.component.html',
  styleUrl: './elements-table.component.scss',
})
export class ElementsTableComponent implements OnInit {
  protected readonly TABLE_CONFIG = TABLE_CONFIG;
  protected readonly TABLE_COLUMNS = TABLE_COLUMNS;
  protected readonly elements: WritableSignal<WithId<PeriodicElement>[]> =
    signal([]);
  protected readonly filterCtrl = new FormControl('');
  protected readonly filteredValue = toSignal(
    this.filterCtrl.valueChanges.pipe(debounceTime(2_000))
  );

  protected readonly filteredElements = computed(() => {
    return this.elements().filter((el) =>
      Object.entries(el)
        .filter(
          ([propName]) =>
            PERIODIC_ELEMENT_FILTERABLE_PROPERTIES[
              propName as keyof PeriodicElement
            ]
        )
        .reduce((acc, [, value]) => acc + value, '')
        .toLowerCase()
        .includes((this.filteredValue() ?? '').toLowerCase())
    );
  });

  protected readonly elements$ = toObservable(this.filteredElements);

  protected onEditClick(
    element: PeriodicElement,
    property: keyof PeriodicElement
  ) {
    const dialogRef = this._dialog.openDialog<
      EditPropertyDialogComponent,
      CloseEditElementPopupMessage
    >(EditPropertyDialogComponent, {
      data: {
        element,
        property,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(updateElementsIfDetectedChange.call(this))
      .subscribe();

    function updateElementsIfDetectedChange() {
      return pipe(
        takeUntilDestroyed(this._destroyRef),
        take(1),
        filter((m) => !!m),
        tap(({ element, property, newValue }) => {
          if (element[property] === newValue) return;

          this.elements.set(getClonedElements.call(this));

          function getClonedElements() {
            const clonedElement = structuredClone(element);
            clonedElement[property as any] = newValue;

            const clonedElements = structuredClone(this.elements());
            const index = clonedElements.findIndex(
              (el: WithId<PeriodicElement>) => el.id === element.id
            );
            clonedElements[index] = clonedElement;

            return clonedElements;
          }
        })
      );
    }
  }

  protected onClearClick() {
    this.filterCtrl.setValue('');
  }

  public ngOnInit(): void {
    getElements.call(this);

    function getElements() {
      this._elements$.subscribe();
    }
  }

  private readonly _elements$ = this._elementsService.getElements$().pipe(
    takeUntilDestroyed(this._destroyRef),
    delay(2000),
    first(),
    tap((elements) =>
      this.elements.set(
        elements.map((el) => ({
          ...el,
          id: Math.random().toString(16).slice(2),
        }))
      )
    )
  );

  constructor(
    private _elementsService: ElementsService,
    private _destroyRef: DestroyRef,
    private _dialog: DialogService
  ) {}
}
