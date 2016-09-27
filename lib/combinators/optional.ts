import {Parser, createParser, State, Either} from '../base';

export function optional<T>(parser: Parser<T, any>): Parser<T, T> {
  return createParser((state: State<T>) => {
    return parser
      .parse(state)
      .map(newState =>
        newState.map(() => state.result)
      )
      .catchError(() => Either.point(state));
  });
}
