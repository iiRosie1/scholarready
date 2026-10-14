import assert from "node:assert/strict";
import test from "node:test";
import { evaluateEligibility, type EligibilityRule, type MatchProfile } from "../src/lib/matcher.ts";

const profile: MatchProfile = {
  study_level: "undergraduate",
  gpa: 3.6,
  study_year: 2,
  activity_tags: ["Sustainability", "Mentoring"],
  citizenship_region: "North America",
  financial_need: true,
};

const rule = (overrides: Partial<EligibilityRule>): EligibilityRule => ({
  rule_type: "study_level",
  operator: "equals",
  value: "undergraduate",
  explanation: "Undergraduate study",
  ...overrides,
});

test("evaluates equals, gte, lte, and includes_any operators", () => {
  const result = evaluateEligibility([
    rule({ id: "level", rule_type: "study_level", operator: "equals", value: "UNDERGRADUATE" }),
    rule({ id: "gpa", rule_type: "gpa", operator: "gte", value: 3.2, explanation: "GPA of 3.2 or higher" }),
    rule({ id: "year", rule_type: "study_year", operator: "lte", value: 4, explanation: "Study year 1–4" }),
    rule({ id: "tags", rule_type: "activity_tags", operator: "includes_any", value: ["community", "mentoring"], explanation: "Community activity" }),
  ], profile);

  assert.equal(result.outcome, "eligible");
  assert.deepEqual(result.criteria.map(item => item.outcome), ["met", "met", "met", "met"]);
  assert.match(result.criteria[3].reason, /matched/);
});

test("returns not eligible when one required rule fails", () => {
  const result = evaluateEligibility([
    rule({ rule_type: "gpa", operator: "gte", value: 3.8, explanation: "GPA of 3.8 or higher" }),
    rule({ rule_type: "study_level", operator: "equals", value: "undergraduate" }),
  ], profile);

  assert.equal(result.outcome, "not eligible");
  assert.equal(result.criteria[0].outcome, "not met");
  assert.match(result.criteria[0].reason, /3\.6/);
  assert.match(result.reason, /required criterion/);
});

test("returns possibly eligible when a required profile value is missing", () => {
  const result = evaluateEligibility([
    rule({ rule_type: "gpa", operator: "gte", value: 3.2, explanation: "GPA of 3.2 or higher" }),
  ], { ...profile, gpa: null });

  assert.equal(result.outcome, "possibly eligible");
  assert.equal(result.criteria[0].outcome, "unknown");
  assert.match(result.criteria[0].reason, /add your GPA/);
});

test("keeps optional unknown criteria from downgrading an otherwise eligible result", () => {
  const result = evaluateEligibility([
    rule({ rule_type: "study_level", operator: "equals", value: "undergraduate" }),
    rule({ rule_type: "financial_need", operator: "equals", value: true, explanation: "Financial need information", is_required: false }),
  ], { ...profile, financial_need: null });

  assert.equal(result.outcome, "eligible");
  assert.deepEqual(result.criteria.map(item => item.outcome), ["met", "unknown"]);
  assert.equal(result.criteria[1].required, false);
});

test("evaluates boolean and text fields case-insensitively where appropriate", () => {
  const result = evaluateEligibility([
    rule({ rule_type: "financial_need", operator: "equals", value: true, explanation: "Financial need" }),
    rule({ rule_type: "citizenship_region", operator: "equals", value: "north america", explanation: "Citizenship region" }),
  ], profile);

  assert.deepEqual(result.criteria.map(item => item.outcome), ["met", "met"]);
});

test("sorts criteria by sort_order while preserving a reason for every rule", () => {
  const result = evaluateEligibility([
    rule({ id: "second", sort_order: 2, explanation: "Second criterion" }),
    rule({ id: "first", sort_order: 1, explanation: "First criterion" }),
  ], profile);

  assert.deepEqual(result.criteria.map(item => item.rule_id), ["first", "second"]);
  assert.ok(result.criteria.every(item => item.reason.length > 0));
});
