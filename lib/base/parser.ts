import {State} from './state';
import {Either} from './either';
import {ParserError} from './parserError';

export type ParseFn<T, R> = (state: State<T>) => Either<ParserError<any>, State<R>>;

export abstract class Parser<T, R> {
  abstract parse(state: State<T>): Either<ParserError<any>, State<R>>

  parseText(text: string): Either<ParserError<any>, State<R>> {
    return this.parse(State.fromText(text));
  }

  flatMap<E>(fn: (input: R) => Parser<R, E>): Parser<T, E> {
    return createParser<T, E>((state: State<T>) => {
      let state2 = this.parse(state);

      return state2
        .flatMap(input =>
          fn(input.result)
            .parse(input)
        );
    });
  }

  map<E>(fn: (input: R) => E): Parser<T, E> {
    return this.flatMap(input => Parser.point(fn(input)));
  }

  filter(predicate: (input: R) => boolean, msg: string = 'predicate failed'): Parser<T, R> {
    return this.flatMap(input => {
      if (predicate(input)) {
        return Parser.point(input);
      }

      return Parser.fail<R, R>(msg);
    });
  }

  orElse(fn: (error: ParserError<any>) => Parser<T, R>): Parser<T, R> {
    return createParser<T, R>((state: State<T>) => {
      let state2 = this.parse(state);

      if (state2.isLeft()) {
        return state2
          .swap()
          .flatMap(error =>
            fn(error).parse(error.state)
          );
      }

      return state2;
    });
  }

  changeErrorMessage(msg: string): Parser<T, R> {
    return this.orElse(error =>
      Parser.fail<T, R>(msg)
    );
  }

  static fail<T, R>(error: string): Parser<T, R> {
    return createParser<T, R>(state => {
      return Either.left(new ParserError(error, state));
    });
  }

  static point<R>(value: R): Parser<any, R> {
    return createParser((state: State<any>) => {
      return Either.point(state.map(() => value));
    });
  }
}

export function createParser<T, R>(parseFn: ParseFn<T, R>): Parser<T, R> {
  return new FunctionParser(parseFn);
}

class FunctionParser<T, R> extends Parser<T, R> {
  private parseFn: ParseFn<T, R>;

  constructor(parseFn: ParseFn<T, R>) {
    super();

    this.parseFn = parseFn;
  }

  parse(state: State<T>): Either<ParserError<any>, State<R>> {
    return this.parseFn(state);
  }
}
