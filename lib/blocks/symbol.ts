import {Parser, Either, State, ParserError, createParser} from '../base';
import {startsWith} from '../utils';

export function symbol(symbol: string): Parser<any, string> {
  return createParser((state: State<any>) => {
    if (startsWith(state.str, symbol)) {
      const newState = new State(
        state.str.substr(symbol.length),
        symbol,
        state.row,
        state.col + symbol.length
      );

      return Either.point(newState);
    }

    return Either.left(new ParserError(`Couldn't parse symbol '${symbol}'`, state));
  });
}

