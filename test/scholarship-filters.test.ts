import assert from "node:assert/strict";
import test from "node:test";
import { scholarships } from "../src/lib/demo-data.ts";
import { filterAndSortScholarships } from "../src/lib/scholarship-filters.ts";

const base = { search: "", category: "all", eligibility: "all" as const, sort: "match" as const };

test("searches scholarship names and providers case-insensitively", () => {
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, search: "civic trust" }).map(item => item.id), ["community-builders"]);
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, search: "NORTH STAR" }).map(item => item.id), ["north-star"]);
});

test("filters by category and eligibility state", () => {
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, category: "Environment" }).map(item => item.id), ["green-futures"]);
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, eligibility: "Possibly eligible" }).map(item => item.id), ["community-builders"]);
});

test("sorts by match, deadline, amount, and name", () => {
  assert.deepEqual(filterAndSortScholarships(scholarships, base).map(item => item.id), ["north-star", "green-futures", "community-builders", "makers"]);
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, sort: "deadline" }).map(item => item.id), ["makers", "north-star", "community-builders", "green-futures"]);
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, sort: "amount" }).map(item => item.id), ["makers", "community-builders", "green-futures", "north-star"]);
  assert.deepEqual(filterAndSortScholarships(scholarships, { ...base, sort: "name" }).map(item => item.id), ["community-builders", "makers", "green-futures", "north-star"]);
});

test("combines filters and returns an empty result without changing source data", () => {
  const result = filterAndSortScholarships(scholarships, { ...base, search: "stem", category: "Community", eligibility: "Not eligible" });
  assert.deepEqual(result, []);
  assert.equal(scholarships.length, 4);
});

test("keeps original order for equal sort values", () => {
  const tied = scholarships.map(item => ({ ...item, deadline: "2026-12-01" }));
  assert.deepEqual(filterAndSortScholarships(tied, { ...base, sort: "deadline" }).map(item => item.id), scholarships.map(item => item.id));
});
