export abstract class Either<L, R> {
  abstract isRight(): this is Right<R>;

  static point<R>(value: R): Either<any, R> {
    return new Right(value);
  }

  static right = Either.point;

  static left<L>(error: L): Either<L, any> {
    return new Left(error);
  }

  isLeft(): this is Left<L> {
    return !this.isRight();
  }

  private transform<L2, R2>(onRight: (value: R) => Either<any, R2>,
                    onLeft: (value: L) => Either<L2, any>): Either<L2, R2> {
    if (this.isRight()) {
      return onRight(this.right);
    }

    if (this.isLeft()) {
      return onLeft(this.left);
    }

    throw new Error('Unknown subclass of Either');
  }

  onRight(fn: (input: R) => any) {
    if (this.isRight()) {
      fn(this.right);
    }
  }

  onLeft(fn: (input: L) => any) {
    if (this.isLeft()) {
      fn(this.left);
    }
  }

  flatMap<T>(fn: (input: R) => Either<L, T>): Either<L, T> {
    return this.transform(
      fn,
      left => Either.left<L>(left)
    );
  }

  map<T>(fn: (input: R) => T): Either<L, T> {
    return this.flatMap(input => Either.point(fn(input)));
  }

  swap(): Either<R, L> {
    return this.transform(
      right => Either.left(right),
      left => Either.point(left)
    );
  }

  catchError(fn: (input: L) => Either<L, R>): Either<L, R> {
    if (this.isLeft()) {
      return fn(this.left);
    }

    return this;
  }

  getOrElse(defaultValue: R): R {
    if (this.isRight()) {
      return this.right;
    }

    return defaultValue;
  }
}

export class Right<R> extends Either<any, R> {
  private value: R;

  constructor(right: R) {
    super();

    this.value = right;
  }

  isRight(): this is Right<R> {
    return true;
  }

  get right(): R {
    return this.value;
  }
}

export class Left<L> extends Either<L, any> {
  private value: L;

  constructor(left: L) {
    super();

    this.value = left;
  }

  isRight(): this is Right<any> {
    return false;
  }

  get left(): L {
    return this.value;
  }
}