import type { MatchState, Scholarship } from "./demo-data.ts";

export type ScholarshipSort = "match" | "deadline" | "amount" | "name";
export type ScholarshipFilters = { search: string; category: string; eligibility: "all" | MatchState; sort: ScholarshipSort };

const matchRank: Record<MatchState, number> = { Eligible: 0, "Possibly eligible": 1, "Not eligible": 2 };

const amountValue = (amount: string) => Number(amount.replace(/[^0-9.]/g, ""));

export function filterAndSortScholarships(items: readonly Scholarship[], filters: ScholarshipFilters): Scholarship[] {
  const query = filters.search.trim().toLowerCase();
  return items
    .map((scholarship, index) => ({ scholarship, index }))
    .filter(({ scholarship }) => {
      const matchesSearch = !query || `${scholarship.name} ${scholarship.provider}`.toLowerCase().includes(query);
      const matchesCategory = filters.category === "all" || scholarship.category === filters.category;
      const matchesEligibility = filters.eligibility === "all" || scholarship.state === filters.eligibility;
      return matchesSearch && matchesCategory && matchesEligibility;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (filters.sort === "deadline") comparison = a.scholarship.deadline.localeCompare(b.scholarship.deadline);
      if (filters.sort === "amount") comparison = amountValue(a.scholarship.amount) - amountValue(b.scholarship.amount);
      if (filters.sort === "name") comparison = a.scholarship.name.localeCompare(b.scholarship.name);
      if (filters.sort === "match") comparison = matchRank[a.scholarship.state] - matchRank[b.scholarship.state];
      return comparison || a.index - b.index;
    })
    .map(({ scholarship }) => scholarship);
}
