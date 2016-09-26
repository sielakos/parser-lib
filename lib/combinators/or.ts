import {Parser} from '../base';

export function or<T, R>(...parsers: Array<Parser<T, R>>): Parser<T, R> {
  return parsers.reduce((parser: Parser<T, R> | null, next: Parser<T, R>) => {
    if (parser) {
      return parser.orElse(() => next);
    }

    return next;
  });
}
