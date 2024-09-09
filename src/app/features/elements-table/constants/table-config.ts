import { PeriodicElement } from '../models/periodic-element';

export const TABLE_COLUMNS = ['number', 'name', 'weight', 'symbol'] as const;
type Column = (typeof TABLE_COLUMNS)[number];

const COLUMN_TO_PROPERTY_MAP: Readonly<
  Record<(typeof TABLE_COLUMNS)[number], keyof PeriodicElement>
> = {
  number: 'position',
  name: 'name',
  weight: 'weight',
  symbol: 'symbol',
};

const TABLE_ORDER: Readonly<Record<Column, number>> = {
  number: 0,
  name: 1,
  weight: 2,
  symbol: 3,
};

const COLUMN_DISPLAY_NAME: Readonly<Record<Column, string>> = {
  number: 'Number',
  symbol: 'Symbol',
  name: 'Name',
  weight: 'Weight',
};

export const TABLE_CONFIG: {
  name: Column;
  displayName: (typeof COLUMN_DISPLAY_NAME)[Column];
  modelProperty: keyof PeriodicElement;
}[] = TABLE_COLUMNS.map((c) => c)
  .sort((a, b) => (TABLE_ORDER[a] > TABLE_ORDER[b] ? 1 : -1))
  .map((c) => ({
    name: c,
    displayName: COLUMN_DISPLAY_NAME[c],
    modelProperty: COLUMN_TO_PROPERTY_MAP[c],
  }));
