import {regularExpression} from './regularExpression';
import {Parser} from '../base';

export const number: Parser<any, number> =
  regularExpression(/^-?\d+(\.\d+)?/)
    .orElse((error) =>
      Parser.fail<Array<string>, Array<string>>('Could not parse number')
    )
    .map(matches => +matches[0]);
