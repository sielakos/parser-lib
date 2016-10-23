import {Parser} from '../base';
import {transparent} from './transparent';
import {keyword} from '../blocks';

export function between<T, R>(open: Parser<any, any> | string, close: Parser<any, any> | string, parser: Parser<T, R>): Parser<T, R> {
  const openParser = prepareParser(open);
  const closeParser = prepareParser(close);

  return transparent(openParser)
    .next(parser)
    .next(transparent(closeParser));
}

function prepareParser(parser: Parser<any, any> | string): Parser<any, any> {
  if (typeof parser === 'string') {
    return keyword(parser, false);
  }

  return parser;
}