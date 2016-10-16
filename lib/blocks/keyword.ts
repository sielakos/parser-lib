import {Parser} from '../base';
import {whitespace} from './whitespace';
import {symbol} from './symbol';

export function keyword(word: string, required: boolean = true): Parser<any, string> {
  return whitespace(required)
    .next(symbol(word))
    .next(whitespace<string>(required));
}
