import {number} from './number';
import {Parser} from '../base/parser';

export const integer: Parser<any, number> = number
  .filter(n => n % 1 == 0, 'Expected integer');
