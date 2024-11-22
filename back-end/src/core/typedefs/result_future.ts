import { Failure } from "../errors/failure";

export type Either<L, R> = Left<L> | Right<R>;

export type ResultFuture<T> = Promise<Either<Failure, T>>;
declare module "../errors/failure" {
  interface Failure {
    fold<T>(onLeft: (failure: Failure) => T, onRight: (value: never) => T): T;
  }
}

export class Left<L> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<any> {
    return false;
  }

  fold<T>(onLeft: (left: L) => T, onRight: (right: any) => T): T {
    return onLeft(this.value);
  }
}

export class Right<R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<any> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }

  fold<T>(onLeft: (left: any) => T, onRight: (right: R) => T): T {
    return onRight(this.value);
  }
}
