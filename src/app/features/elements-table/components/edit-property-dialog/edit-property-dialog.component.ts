import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { WithId } from 'src/app/shared';
import { CloseEditElementPopupMessage } from '../../models/close-edit-element-popup-message';
import { PeriodicElement } from '../../models/periodic-element';

const MATERIAL_IMPORTS = [
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
];

@Component({
  selector: 'dialog-animations-example-dialog',
  template: `
    <button
      class="close-button"
      matSuffix
      mat-icon-button
      (click)="onCloseClick()"
    >
      <mat-icon>close</mat-icon>
    </button>
    <mat-form-field>
      <mat-label
        >Editing {{ data.property }} for {{ data.element.name }}</mat-label
      >
      <input matInput type="text" [formControl]="input" />
      <button
        [disabled]="!input.value.length"
        matSuffix
        mat-icon-button
        aria-label="Save"
        (click)="onSaveClick()"
      >
        <mat-icon>save</mat-icon>
      </button>
    </mat-form-field>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1em;
      overflow: hidden;

      .close-button {
        align-self: flex-end;
      }
    }
  `,
  standalone: true,
  imports: [MATERIAL_IMPORTS, ReactiveFormsModule],
})
export class EditPropertyDialogComponent {
  protected input = new FormControl('');

  protected onSaveClick() {
    this.dialogRef.close({
      element: this.data.element,
      property: this.data.property,
      newValue: this.input.value,
    } satisfies CloseEditElementPopupMessage);
  }

  protected onCloseClick() {
    this.dialogRef.close();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected data: {
      element: WithId<PeriodicElement>;
      property: keyof PeriodicElement;
    },
    protected dialogRef: MatDialogRef<EditPropertyDialogComponent>
  ) {}
}
