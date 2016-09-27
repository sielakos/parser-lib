import {Parser} from '../base';
import {whitespace} from './whitespace';
import {symbol} from './symbol';

export function keyword(word: string): Parser<any, string> {
  return whitespace(true)
    .next(symbol(word))
    .next(whitespace<string>(true));
}
