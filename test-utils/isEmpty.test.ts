import { isEmpty } from "@/lib/isEmpty";
import { expect, it } from "vitest";

it("should return true if the object is empty", () => {
  expect(isEmpty({})).toBe(true);
});

it("should return false if the object is not empty", () => {
  expect(isEmpty({ a: 1, b: 2, c: 3 })).toBe(false);
});