import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCompareSelection, toggleCompareSelection } from "../src/lib/compare-selection.ts";

const ids = ["north-star", "community-builders", "green-futures", "makers"];

test("allows zero through three selections and caps a fourth", () => {
  let selected: string[] = [];
  assert.deepEqual(selected, []);
  selected = toggleCompareSelection(selected, ids[0]);
  selected = toggleCompareSelection(selected, ids[1]);
  assert.deepEqual(selected, ["north-star", "community-builders"]);
  selected = toggleCompareSelection(selected, ids[2]);
  assert.deepEqual(selected, ["north-star", "community-builders", "green-futures"]);
  selected = toggleCompareSelection(selected, ids[3]);
  assert.deepEqual(selected, ["north-star", "community-builders", "green-futures"]);
});

test("removes a selected scholarship and then allows a replacement", () => {
  const selected = ["north-star", "community-builders", "green-futures"];
  const afterRemove = toggleCompareSelection(selected, "community-builders");
  assert.deepEqual(afterRemove, ["north-star", "green-futures"]);
  assert.deepEqual(toggleCompareSelection(afterRemove, "makers"), ["north-star", "green-futures", "makers"]);
});

test("normalizes session data to known unique selections within the cap", () => {
  assert.deepEqual(normalizeCompareSelection(["makers", "unknown", "north-star", "community-builders", "green-futures"], ids), ["makers", "north-star", "community-builders"]);
  assert.deepEqual(normalizeCompareSelection("not an array", ids), []);
});
