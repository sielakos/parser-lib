import {Parser} from '../base';
import {many} from './many';
import {transparent} from './transparent';

export function separatedBy<R>(parser: Parser<R, R>, separator: Parser<any, any>): Parser<R, Array<R>> {
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
