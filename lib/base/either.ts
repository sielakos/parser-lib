export class Either<L, R> {
  public left: L | null;
  public right: R | null;

  constructor(left: L | null, right: R | null) {
    this.left = left;
    this.right = right;
  }

  static point<R>(value: R): Either<any, R> {
    return new Either(null, value);
  }

  static left<L>(error: L): Either<L, any> {
    return new Either(error, null);
  }

  isRight(): boolean {
    return this.right !== null;
  }

  isLeft(): boolean {
    return !this.isRight();
  }

  flatMap<T>(fn: (input: R) => Either<L, T>): Either<L, T> {
    if (this.isRight()) {
      return fn(this.right);
    }

    return Either.left<L>(this.left);
  }

  map<T>(fn: (input: R) => T): Either<L, T> {
    return this.flatMap(input => Either.point(fn(this.right)));
  }

  swap(): Either<R, L> {
    return new Either(this.right, this.left);
  }

  catchError(fn: (input: L) => Either<L, R>): Either<L, R> {
    if (this.isLeft()) {
      return fn(this.left);
    }

    return this;
  }
}