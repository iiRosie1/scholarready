export type ReadinessTask = {
  completed: boolean;
  required?: boolean;
};

export type DeadlineUrgency = "overdue" | "due within 7 days" | "due within 30 days" | "later";

export type DeadlineResult = {
  urgency: DeadlineUrgency;
  daysUntil: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function calculateReadiness(tasks: readonly ReadinessTask[]): number {
  const requiredTasks = tasks.filter(task => task.required !== false);
  if (requiredTasks.length === 0) return 0;
  const completedRequired = requiredTasks.filter(task => task.completed).length;
  return Math.round((completedRequired / requiredTasks.length) * 100);
}

function dateOnlyInUtc(value: string | Date) {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) throw new Error(`Expected an ISO date or date-time, received: ${value}`);
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
}

export function getDeadlineUrgency(deadline: string, now: Date = new Date()): DeadlineResult {
  const daysUntil = Math.round((dateOnlyInUtc(deadline) - dateOnlyInUtc(now)) / DAY_MS);
  if (daysUntil < 0) return { urgency: "overdue", daysUntil };
  if (daysUntil <= 7) return { urgency: "due within 7 days", daysUntil };
  if (daysUntil <= 30) return { urgency: "due within 30 days", daysUntil };
  return { urgency: "later", daysUntil };
}
