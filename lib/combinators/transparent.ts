import {Parser, createParser, State} from '../base';

export function transparent<T, R>(parser: Parser<T, R>): Parser<T, T> {
  return createParser((state: State<T>) => {
    return parser
      .parse(state)
      .map(newState =>
        newState.map(() => state.result)
      );
  });
}
