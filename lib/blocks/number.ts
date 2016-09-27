import {regularExpression} from './regularExpression';
import {Parser} from '../base';

export const number: Parser<any, number> =
  regularExpression(/^-?\d+(\.\d+)?/)
    .changeErrorMessage('Could not parse number')
    .map(matches => +matches[0]);
