import {createParser, Parser, Either} from '../base';

export function withDefault<T>(parser: Parser<any, T>, defaultValue: T): Parser<any, T> {
  return createParser(state => {
    const result = parser.parse(state);

    if (result.isRight()) {
      return result;
    }

    return Either.point(
      state.map(() => defaultValue)
    );
  });
}