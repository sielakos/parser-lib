import {Parser, createParser, State, ParserError, Either} from '../base';

export function many<R>(parser: Parser<R, R>): Parser<R, Array<R>> {
  return createParser((state: State<R>) => {
    let results: Either<ParserError<any>, State<Array<R>>> = Either.point(
      state.map(() => [])
    );
    let currentState = parser.parse(state);

    while (currentState.isRight()) {
      results = addResult(currentState, results);
      currentState = currentState.flatMap(state =>
        parser.parse(state)
      );
    }

    return results;
  });
}

function addResult<R>(currentState: Either<ParserError<any>, State<R>>, results: Either<ParserError<any>, State<Array<R>>>) {
  return currentState
    .flatMap(state => {
      return results.map(state2 => {
        return state.map((result) => state2.result.concat(result));
      });
    });
}
