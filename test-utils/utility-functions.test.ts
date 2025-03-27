import { isEmpty, urlsToArrayUtil } from "@/lib/utility-functions";
import { expect, it } from "vitest";

it("should return true if the object is empty", () => {
  expect(isEmpty({})).toBe(true);
});

it("should return false if the object is not empty", () => {
  expect(isEmpty({ a: 1, b: 2, c: 3 })).toBe(false);
});

it('Should return an empty array if "urls" is an empty string', () => {
  expect(urlsToArrayUtil('')).toEqual([]);
});

it('Should return a form array if "urls" is not empty', () => {
  expect(urlsToArrayUtil('[{"type":"image","url":"https://example.com/image1"},{"type":"video","url":"https://example.com/video1"}]')).toEqual([
    { type: "image", url: "https://example.com/image1" },
    { type: "video", url: "https://example.com/video1" }
  ]);
});