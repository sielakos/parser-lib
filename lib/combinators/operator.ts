import {Parser} from '../base';
import {keyword} from '../blocks';
import {OperatorFunction} from './chain';

export function operator<R>(parser: Parser<R, any> | string, operatorFunction: OperatorFunction<R>): Parser<R, OperatorFunction<R>> {
  if (typeof parser === 'string') {
    return keyword(parser, false)
      .map(() => operatorFunction);
  }
  
  return parser.map(() => operatorFunction);
}