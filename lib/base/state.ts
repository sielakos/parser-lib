
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

  static point<T>(result: T): State<T> {
    return new State('', result);
  }
}