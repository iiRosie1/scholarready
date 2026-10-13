export type MatchState = "Eligible" | "Possibly eligible" | "Not eligible";
export type CriterionStatus = "Met" | "Unknown" | "Not met";

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  state: MatchState;
  summary: string;
  criteria: { label: string; status: CriterionStatus }[];
};

export const scholarships: Scholarship[] = [
  { id: "north-star", name: "North Star STEM Award", provider: "Fictional Foundation", amount: "$4,000", deadline: "2026-11-18", category: "STEM", state: "Eligible", summary: "For undergraduate students building practical solutions in science and technology.", criteria: [{ label: "Undergraduate study", status: "Met" }, { label: "GPA of 3.2 or higher", status: "Met" }, { label: "STEM-related major", status: "Met" }] },
  { id: "community-builders", name: "Community Builders Grant", provider: "Fictional Civic Trust", amount: "$2,500", deadline: "2026-12-02", category: "Community", state: "Possibly eligible", summary: "Supports students whose community work shows consistent care and initiative.", criteria: [{ label: "Undergraduate study", status: "Met" }, { label: "Community activity", status: "Met" }, { label: "Financial need information", status: "Unknown" }] },
  { id: "green-futures", name: "Green Futures Scholarship", provider: "Fictional Earth Lab", amount: "$3,000", deadline: "2027-01-15", category: "Environment", state: "Eligible", summary: "For students exploring practical climate and sustainability projects.", criteria: [{ label: "Undergraduate study", status: "Met" }, { label: "Environmental interest", status: "Met" }, { label: "Project statement", status: "Unknown" }] },
  { id: "makers", name: "Future Makers Bursary", provider: "Fictional Makers Guild", amount: "$1,500", deadline: "2026-10-30", category: "Creative", state: "Not eligible", summary: "A small bursary for students developing a creative practice or portfolio.", criteria: [{ label: "Undergraduate study", status: "Met" }, { label: "Creative portfolio", status: "Not met" }, { label: "Study year 1–4", status: "Met" }] },
];

export const applications = [
  { id: "north-star", name: "North Star STEM Award", provider: "Fictional Foundation", deadline: "2026-11-18", status: "In progress", readiness: 67, tasks: ["Confirm academic transcript", "Draft personal statement", "Request faculty reference"] },
  { id: "community-builders", name: "Community Builders Grant", provider: "Fictional Civic Trust", deadline: "2026-12-02", status: "Planning", readiness: 33, tasks: ["List community activities", "Write impact example", "Review eligibility notes"] },
];

export const formatDate = (value: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
