import {Parser} from '../base';
import {keyword} from '../blocks';
import {many} from './many';
import {transparent} from './transparent';

export function separatedBy<R>(parser: Parser<R, R>, separator: Parser<any, any> | string): Parser<R, Array<R>> {
  if (typeof separator === 'string') {
    return separatedBy(parser, keyword(separator, false));
  }

  return many(
    parser.next(
      transparent(separator)
    )
  ).flatMap((values: Array<R>) => {
    return Parser
      .point(values[values.length - 1])
      .next(
        parser.map(value => values.concat(value))
      )
      .orElse((error) =>
        values.length > 0  ? Parser.fail<any, Array<R>>(error.msg) : Parser.point(values)
      );
  });
}
