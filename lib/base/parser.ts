import {State} from './state';

export type ParseFn<T, R> = (state: State<T>) => State<R>;

export abstract class Parser<T, R> {
  abstract parse(state: State<T>): State<R> 

  flatMap<E>(fn: (input: R) => Parser<R, E>): Parser<T, E> {
    return createParser((state: State<T>) => {
      let state2 = this.parse(state);

      return fn(state2.result).parse(state2);
    });
  }

  map<E>(fn: (input: R) => E): Parser<T, E> {
    return this.flatMap(input => Parser.point(fn(input)));
  }

  static point<R>(value: R): Parser<any, R> {
    return createParser((state: State<any>) => {
      return state.map(() => value);
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

  parse(state: State<T>): State<R> {
    return this.parseFn(state);
  }
}