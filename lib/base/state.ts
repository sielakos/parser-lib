import {calculateStatePositionChange} from '../utils';

export class State<T> {
  row: number;
  col: number;
  str: string;
  result: T;

  constructor(str: string, result: T, row: number = 0, col: number = 0) {
    this.str = str;
    this.result = result;
    this.row = row;
    this.col = col;
  }

  static point<T>(result: T): State<T> {
    return new State('', result);
  }

  static fromText(text: string): State<any> {
    return new State(text, null);
  }

  flatMap<R>(fn: (input: T) => State<R>) {
    const state = fn(this.result);

    return new State(
      this.str + state.str,
      state.result,
      this.row + state.row,
      this.col + state.col
    );
  }

  map<R>(fn: (input: T) => R): State<R> {
    return this.flatMap(input =>
      State.point(
        fn(input)
      )
    );
  }

  changePosition({row = 0, col = 0}: {row?: number, col?: number}): State<T> {
    return new State(
      this.str,
      this.result,
      this.row + row,
      row > 0 ? col : this.col + col
    );
  }

  consumeText(text: string): State<string> {
    return this
      .changePosition(
        calculateStatePositionChange(text)
      )
      .cutStart(text.length)
      .map(() => text);
  }

  private cutStart(length: number): State<T> {
    return new State(
      this.str.substr(length),
      this.result,
      this.row,
      this.col
    );
  }

  withPositionFromState<R>(state: State<R>): State<T> {
    return new State(
      state.str,
      this.result,
      state.row,
      state.col
    );
  }
}
