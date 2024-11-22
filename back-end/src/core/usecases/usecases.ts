import { ResultFuture } from "../typedefs/result_future";

export abstract class UseCaseWithParams<Type, Params> {
  abstract call(params: Params): ResultFuture<Type>;
}

export abstract class UseCaseWithOutParams<Type> {
  abstract call(): ResultFuture<Type>;
}
