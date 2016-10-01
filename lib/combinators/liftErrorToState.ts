import {Parser, Either, ParserError, State, createParser} from '../base';

export function liftErrorToState<T, R>(parser: Parser<T, R>): Parser<T, Either<ParserError<any>, R>> {
  return createParser((state: State<T>) => {
    const result = parser.parse(state);

    return result
      .map(state => {
        return state.map(value =>
          Either.point(value)
        );
      })
      .catchError(error => Either.point(
        state.map(() => Either.left(error))
      ));
  });
}
