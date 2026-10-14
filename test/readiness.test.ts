import assert from "node:assert/strict";
import test from "node:test";
import { calculateReadiness, getDeadlineUrgency } from "../src/lib/readiness.ts";

test("returns zero readiness when there are no required tasks", () => {
  assert.equal(calculateReadiness([]), 0);
  assert.equal(calculateReadiness([{ completed: true, required: false }]), 0);
});

test("calculates partial and complete readiness from required tasks only", () => {
  assert.equal(calculateReadiness([{ completed: true }, { completed: false }, { completed: false }]), 33);
  assert.equal(calculateReadiness([{ completed: true }, { completed: true }, { completed: true, required: false }]), 100);
  assert.equal(calculateReadiness([{ completed: true }, { completed: false }, { completed: true }, { completed: false }]), 50);
});

const clock = new Date("2026-10-14T15:30:00Z");

test("marks an earlier calendar date as overdue", () => {
  assert.deepEqual(getDeadlineUrgency("2026-10-13", clock), { urgency: "overdue", daysUntil: -1 });
});

test("includes today and the exact seven-day boundary in the seven-day band", () => {
  assert.deepEqual(getDeadlineUrgency("2026-10-14", clock), { urgency: "due within 7 days", daysUntil: 0 });
  assert.deepEqual(getDeadlineUrgency("2026-10-21", clock), { urgency: "due within 7 days", daysUntil: 7 });
});

test("includes the exact thirty-day boundary in the thirty-day band", () => {
  assert.deepEqual(getDeadlineUrgency("2026-10-22", clock), { urgency: "due within 30 days", daysUntil: 8 });
  assert.deepEqual(getDeadlineUrgency("2026-11-13", clock), { urgency: "due within 30 days", daysUntil: 30 });
});

test("marks dates beyond thirty days as later", () => {
  assert.deepEqual(getDeadlineUrgency("2026-11-14", clock), { urgency: "later", daysUntil: 31 });
});

test("uses calendar dates rather than the current time of day", () => {
  assert.deepEqual(getDeadlineUrgency("2026-10-15", new Date("2026-10-14T23:59:59Z")), { urgency: "due within 7 days", daysUntil: 1 });
});
