import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
type DialogDimension = `${number}px`;
type DialogOptions = {
  width?: DialogDimension;
  height?: DialogDimension;
  data?: {
    [key: string]: any;
  };
};

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public openDialog<Component, Response>(
    component: ComponentType<Component>,
    options?: DialogOptions
  ) {
    return this._dialog.open<Component, any, Response>(component, {
      ...options,
      width: options.width ?? '400px',
      height: options.height ?? '200px',
    });
  }

  constructor(private _dialog: MatDialog) {}
}
