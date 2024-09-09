import { FilterableProperties } from './../../../shared/models/generics/filterable-property';
export type PeriodicElement = {
  position: number;
  name: string;
  weight: number;
  symbol: string;
};

export const PERIODIC_ELEMENT_FILTERABLE_PROPERTIES: FilterableProperties<PeriodicElement> =
  {
    symbol: true,
    position: false,
    name: true,
    weight: true,
  };
