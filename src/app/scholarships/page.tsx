"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell, StatusPill } from "@/components/site-shell";
import { formatDate, scholarships, type MatchState } from "@/lib/demo-data";
import { COMPARE_SELECTION_KEY, MAX_COMPARE_SELECTIONS, normalizeCompareSelection, toggleCompareSelection } from "@/lib/compare-selection";
import { filterAndSortScholarships, type ScholarshipSort } from "@/lib/scholarship-filters";

const matchStateReason: Record<MatchState, string> = {
  Eligible: "All listed criteria are currently supported by your profile context.",
  "Possibly eligible": "No required criterion has failed, but more profile information is needed.",
  "Not eligible": "At least one listed criterion is not currently supported by your profile context.",
};

type Filters = { search: string; category: string; eligibility: "all" | MatchState; sort: ScholarshipSort };
const initialFilters: Filters = { search: "", category: "all", eligibility: "all", sort: "match" };
const scholarshipIds = scholarships.map(scholarship => scholarship.id);

function ScholarshipCard({ scholarship, selected, selectionFull, onToggle }: { scholarship: (typeof scholarships)[number]; selected: boolean; selectionFull: boolean; onToggle: () => void }) {
  const buttonLabel = selected ? "Remove from compare" : "Add to compare";
  return <article className="scholar-card" aria-labelledby={`${scholarship.id}-title`}>
    <div className="scholar-card-top"><span className="eyebrow">{scholarship.category}</span><StatusPill state={scholarship.state} /></div>
    <h2 id={`${scholarship.id}-title`}>{scholarship.name}</h2>
    <div className="provider">{scholarship.provider}</div>
    <p className="scholar-summary">{scholarship.summary}</p>
    <div className="scholar-meta"><span>AWARD<b>{scholarship.amount}</b></span><span>DEADLINE<b>{formatDate(scholarship.deadline)}</b></span></div>
    <p className="match-state-reason">{matchStateReason[scholarship.state]}</p>
    <div className="criteria" aria-label={`${scholarship.name} eligibility explanations`}>
      {scholarship.criteria.map(criterion => <div className="criterion" key={criterion.label}>
        <div className="criterion-copy"><span>{criterion.label}</span><small>{criterion.explanation}</small></div>
        <b className={criterion.status === "Not met" ? "not" : criterion.status === "Unknown" ? "unknown" : "met"}>{criterion.status === "Met" ? "✓ Met" : criterion.status === "Unknown" ? "? Unknown" : "× Not met"}</b>
      </div>)}
    </div>
    <div className="scholar-card-actions">
      <button className={`compare-toggle${selected ? " is-selected" : ""}`} type="button" onClick={onToggle} disabled={!selected && selectionFull} aria-pressed={selected} aria-label={`${buttonLabel}: ${scholarship.name}`} title={!selected && selectionFull ? "Comparison is limited to three scholarships" : undefined}>{selected ? "✓ Selected for compare" : "+ Add to compare"}</button>
      <Link className="card-link" href={`/applications/${scholarship.id}`}>Review opportunity <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}

export default function ScholarshipsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionReady, setSelectionReady] = useState(false);
  const results = useMemo(() => filterAndSortScholarships(scholarships, filters), [filters]);
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters(current => ({ ...current, [key]: value }));
  const resetFilters = () => setFilters(initialFilters);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.sessionStorage.getItem(COMPARE_SELECTION_KEY);
        setSelectedIds(normalizeCompareSelection(stored ? JSON.parse(stored) : [], scholarshipIds));
      } catch {
        setSelectedIds([]);
      }
      setSelectionReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectionReady) window.sessionStorage.setItem(COMPARE_SELECTION_KEY, JSON.stringify(selectedIds));
  }, [selectedIds, selectionReady]);

  const toggleSelection = (id: string) => setSelectedIds(current => toggleCompareSelection(current, id));
  const selectionFull = selectedIds.length >= MAX_COMPARE_SELECTIONS;
  const selectionMessage = selectionFull ? "Comparison is limited to 3 scholarships. Remove one to choose another." : selectedIds.length < 2 ? "Select at least 2 scholarships to compare." : "Ready to compare your selected scholarships.";

  return <AppShell active="Find scholarships">
    <div className="page-content">
      <div className="page-header">
        <div><div className="breadcrumb">Explore opportunities</div><h1>Scholarship matches</h1><p>Review opportunities by deadline, award label, category, and how your current profile context fits.</p></div>
        <Link href="/compare" className="button button-quiet">Compare selected <span aria-hidden="true">→</span></Link>
      </div>
      <div className="notice catalog-notice" role="note"><span aria-hidden="true">◈</span><span><strong>Fictional scholarship catalog.</strong> Match states are informational guidance, not official eligibility decisions or award predictions.</span></div>
      <section className="profile-prompt" aria-labelledby="profile-prompt-title">
        <div className="profile-prompt-icon" aria-hidden="true">◌</div>
        <div><span className="profile-prompt-kicker">Improve your match context</span><h2 id="profile-prompt-title">Complete your profile for clearer explanations</h2><p>Add your study year, GPA, and activity tags so ScholarReady can show more useful met, unmet, and unknown criteria.</p></div>
        <Link href="/profile" className="button button-small">Update profile <span aria-hidden="true">→</span></Link>
      </section>
      <form className="filter-bar" aria-label="Scholarship filters" onSubmit={event => event.preventDefault()}>
        <label className="sr-only" htmlFor="scholarship-search">Search scholarships</label><input id="scholarship-search" aria-label="Search scholarships" placeholder="Search by name or provider" value={filters.search} onChange={event => updateFilter("search", event.target.value)} />
        <label className="sr-only" htmlFor="scholarship-category">Filter by category</label><select id="scholarship-category" aria-label="Filter by category" value={filters.category} onChange={event => updateFilter("category", event.target.value)}><option value="all">All categories</option><option>STEM</option><option>Community</option><option>Environment</option><option>Creative</option></select>
        <label className="sr-only" htmlFor="scholarship-eligibility">Filter by eligibility</label><select id="scholarship-eligibility" aria-label="Filter by eligibility" value={filters.eligibility} onChange={event => updateFilter("eligibility", event.target.value as Filters["eligibility"])}><option value="all">All match states</option><option>Eligible</option><option>Possibly eligible</option><option>Not eligible</option></select>
        <label className="sr-only" htmlFor="scholarship-sort">Sort scholarships</label><select id="scholarship-sort" aria-label="Sort scholarships" value={filters.sort} onChange={event => updateFilter("sort", event.target.value as ScholarshipSort)}><option value="match">Best match</option><option value="deadline">Deadline soonest</option><option value="amount">Award amount</option><option value="name">Name A–Z</option></select>
        <button className="button button-small button-quiet" type="button" onClick={resetFilters}>Reset</button>
      </form>
      <div className="compare-selection-bar" role="status" aria-live="polite"><div><strong>{selectedIds.length} of {MAX_COMPARE_SELECTIONS} selected</strong><span>{selectionMessage}</span></div><Link className={`button button-small${selectedIds.length < 2 ? " button-quiet" : ""}`} href="/compare">Open compare <span aria-hidden="true">→</span></Link></div>
      <div className="results-summary" aria-live="polite">{results.length} {results.length === 1 ? "opportunity" : "opportunities"} shown</div>
      {results.length > 0 ? <div className="scholarship-grid">{results.map(scholarship => <ScholarshipCard key={scholarship.id} scholarship={scholarship} selected={selectedIds.includes(scholarship.id)} selectionFull={selectionFull} onToggle={() => toggleSelection(scholarship.id)} />)}</div> : <section className="empty-state results-empty" aria-live="polite"><h2>No scholarships match those filters</h2><p>Try a broader search or reset the filters to review the full catalog.</p><button className="button button-small" type="button" onClick={resetFilters}>Reset filters</button></section>}
    </div>
  </AppShell>;
}
