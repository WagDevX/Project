import { Left, Right } from "../../../core/typedefs/result_future";

describe("result_future", () => {
  it("should create a Left instance with the correct value", () => {
    const value = "error";
    const left = new Left(value);
    expect(left.value).toBe(value);
    expect(left.isLeft()).toBe(true);
    expect(left.isRight()).toBe(false);
  });

  it("should create a Right instance with the correct value", () => {
    const value = "success";
    const right = new Right(value);
    expect(right.value).toBe(value);
    expect(right.isLeft()).toBe(false);
    expect(right.isRight()).toBe(true);
  });

  it("should correctly identify Left and Right instances", () => {
    const left = new Left("error");
    const right = new Right("success");

    expect(left.isLeft()).toBe(true);
    expect(left.isRight()).toBe(false);

    expect(right.isLeft()).toBe(false);
    expect(right.isRight()).toBe(true);
  });
});
