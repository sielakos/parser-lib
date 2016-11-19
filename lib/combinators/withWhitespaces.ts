import {whitespace} from '../blocks';
import {Parser, State, ParserError, createParser} from '../base';

export function withWhitespaces<T,R>(parser: Parser<T, R>, required: boolean = true): Parser<T, R> {
  const whitedParser: Parser<T, R> = whitespace(required)
    .next(parser)
    .next(whitespace<R>(required));

  return createParser((state: State<T>) => {
    const result = whitedParser.parse(state);

    return result
      .swap()
      .map(error => new ParserError(
        error.msg,
        error.state.withPositionFromState(state),
        error.additionalInfo
      ))
      .swap();
  });
}
