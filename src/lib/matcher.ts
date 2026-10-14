export type MatchOutcome = "eligible" | "possibly eligible" | "not eligible";
export type CriterionOutcome = "met" | "unknown" | "not met";
export type RuleType = "study_level" | "gpa" | "study_year" | "activity_tags" | "citizenship_region" | "financial_need";
export type RuleOperator = "equals" | "gte" | "lte" | "includes_any";
export type RuleValue = string | number | boolean | string[];

export type MatchProfile = {
  study_level?: string | null;
  gpa?: number | null;
  study_year?: number | null;
  activity_tags?: string[] | null;
  citizenship_region?: string | null;
  financial_need?: boolean | null;
};

export type EligibilityRule = {
  id?: string;
  rule_type: RuleType;
  operator: RuleOperator;
  value: RuleValue;
  explanation: string;
  is_required?: boolean;
  sort_order?: number;
};

export type CriterionEvaluation = {
  rule_id?: string;
  explanation: string;
  required: boolean;
  outcome: CriterionOutcome;
  reason: string;
};

export type MatchResult = {
  outcome: MatchOutcome;
  reason: string;
  criteria: CriterionEvaluation[];
};

const fieldLabels: Record<RuleType, string> = {
  study_level: "study level",
  gpa: "GPA",
  study_year: "study year",
  activity_tags: "activity tags",
  citizenship_region: "citizenship region",
  financial_need: "financial need",
};

const isMissing = (value: unknown) => value === null || value === undefined || value === "";
const normaliseText = (value: string) => value.trim().toLowerCase();
const normaliseTags = (value: string[]) => value.map(tag => normaliseText(tag)).filter(Boolean);

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

function valuesMatch(profileValue: unknown, rule: EligibilityRule) {
  switch (rule.operator) {
    case "equals":
      if (typeof profileValue === "string" && typeof rule.value === "string") return normaliseText(profileValue) === normaliseText(rule.value);
      return profileValue === rule.value;
    case "gte":
      return typeof profileValue === "number" && typeof rule.value === "number" && profileValue >= rule.value;
    case "lte":
      return typeof profileValue === "number" && typeof rule.value === "number" && profileValue <= rule.value;
    case "includes_any":
      return Array.isArray(profileValue) && Array.isArray(rule.value) && normaliseTags(profileValue).some(item => normaliseTags(rule.value as string[]).includes(item));
  }
}

function profileValue(profile: MatchProfile, type: RuleType) {
  return profile[type];
}

function evaluateRule(rule: EligibilityRule, profile: MatchProfile): CriterionEvaluation {
  const required = rule.is_required !== false;
  const currentValue = profileValue(profile, rule.rule_type);

  if (isMissing(currentValue)) {
    return {
      rule_id: rule.id,
      explanation: rule.explanation,
      required,
      outcome: "unknown",
      reason: `${rule.explanation} — add your ${fieldLabels[rule.rule_type]} to check this requirement.`,
    };
  }

  const met = valuesMatch(currentValue, rule);
  return {
    rule_id: rule.id,
    explanation: rule.explanation,
    required,
    outcome: met ? "met" : "not met",
    reason: met
      ? `${rule.explanation} — matched by your profile.`
      : `${rule.explanation} — your profile value (${formatValue(currentValue)}) does not meet this requirement.`,
  };
}

export function evaluateEligibility(rules: EligibilityRule[], profile: MatchProfile): MatchResult {
  const criteria = [...rules].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(rule => evaluateRule(rule, profile));
  const requiredFailed = criteria.some(criteriaItem => criteriaItem.required && criteriaItem.outcome === "not met");
  const requiredUnknown = criteria.some(criteriaItem => criteriaItem.required && criteriaItem.outcome === "unknown");

  if (requiredFailed) {
    return { outcome: "not eligible", reason: "At least one required criterion is not met.", criteria };
  }
  if (requiredUnknown) {
    return { outcome: "possibly eligible", reason: "No required criterion has failed, but more profile information is needed.", criteria };
  }
  return { outcome: "eligible", reason: "All required criteria are met.", criteria };
}
