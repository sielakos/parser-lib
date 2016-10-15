import {Parser, State, Either, ParserError, createParser} from '../base';

export function notFallowedBy<T>(parser: Parser<T, any>, msg?: string | undefined): Parser<T, T> {
  return createParser((state: State<T>) => {
    const result = parser.parse(state);
    
    if (result.isLeft()) {
      return Either.point(state);
    }
    
    return Either.left(
      new ParserError(
        msg ? msg : `Expected ${parser} to fail`,
        state,
        result.getOrElse(state)
      )
    );
  });
}