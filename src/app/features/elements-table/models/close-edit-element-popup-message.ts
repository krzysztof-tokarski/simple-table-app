import { WithId } from 'src/app/shared';
import { PeriodicElement } from './periodic-element';

export type CloseEditElementPopupMessage = {
  element: WithId<PeriodicElement>;
  property: keyof PeriodicElement;
  newValue: string;
};
