import {Parser, createParser, State} from '../base';
import {transparent} from './transparent';

export function between<T, R>(open: Parser<any, any>, close: Parser<any, any>, parser: Parser<T, R>): Parser<T, R> {
  return transparent(open)
    .next(parser)
    .next(transparent(close));
}
