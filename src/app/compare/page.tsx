"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell, StatusPill } from "@/components/site-shell";
import { formatDate, scholarships } from "@/lib/demo-data";
import { COMPARE_SELECTION_KEY, normalizeCompareSelection } from "@/lib/compare-selection";

const scholarshipIds = scholarships.map(scholarship => scholarship.id);

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionReady, setSelectionReady] = useState(false);
  const selected = scholarships.filter(scholarship => selectedIds.includes(scholarship.id));
  const criterionLabels = useMemo(() => Array.from(new Set(selected.flatMap(scholarship => scholarship.criteria.map(criterion => criterion.label)))), [selected]);

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

  const removeSelection = (id: string) => setSelectedIds(current => current.filter(selectedId => selectedId !== id));

  return <AppShell active="Compare"><div className="page-content">
    <div className="page-header"><div><div className="breadcrumb">Decision space</div><h1>Compare scholarships</h1><p>Keep the trade-offs visible. Select two or three opportunities from your matches to compare them side by side.</p></div><Link href="/scholarships" className="button button-quiet">← Back to matches</Link></div>
    <section className="compare-selection-summary" aria-live="polite"><strong>{selected.length} of 3 selected</strong><span>{selected.length < 2 ? "Select at least 2 scholarships for a meaningful comparison." : "Your comparison set is ready."}</span></section>
    {selected.length < 2 ? <section className="empty-state compare-empty"><h2>Select at least two scholarships</h2><p>Return to your matches and use “Add to compare” on two or three opportunities. Your selection will stay available in this browser session.</p><Link className="button button-small" href="/scholarships">Choose scholarships <span aria-hidden="true">→</span></Link>{selected.length === 1 && <div className="selected-preview"><span>Already selected</span><strong>{selected[0].name}</strong><button type="button" className="text-button" onClick={() => removeSelection(selected[0].id)}>Remove</button></div>}</section> : <section className="comparison-section" aria-labelledby="comparison-title"><div className="panel-heading"><div><h2 id="comparison-title">Side-by-side comparison</h2><p className="comparison-helper">Compare the visible guidance for your selected opportunities. Provider decisions always control official eligibility.</p></div><Link href="/scholarships" className="button button-small button-quiet">Add or change selections</Link></div><div className="table-wrap"><table className="compare-table"><caption className="sr-only">Comparison of {selected.map(scholarship => scholarship.name).join(", ")}</caption><thead><tr><th scope="col">Comparison point</th>{selected.map(scholarship => <th scope="col" key={scholarship.id}><span className="eyebrow">{scholarship.category}</span><strong>{scholarship.name}</strong><small>{scholarship.provider}</small><button type="button" className="text-button table-remove" onClick={() => removeSelection(scholarship.id)}>Remove</button></th>)}</tr></thead><tbody><tr><th scope="row">Deadline</th>{selected.map(scholarship => <td key={scholarship.id}><strong>{formatDate(scholarship.deadline)}</strong></td>)}</tr><tr><th scope="row">Award label</th>{selected.map(scholarship => <td key={scholarship.id}><strong>{scholarship.amount}</strong></td>)}</tr><tr><th scope="row">Eligibility state</th>{selected.map(scholarship => <td key={scholarship.id}><StatusPill state={scholarship.state} /><span className="table-note">Informational match guidance</span></td>)}</tr>{criterionLabels.map(label => <tr key={label}><th scope="row">{label}</th>{selected.map(scholarship => { const criterion = scholarship.criteria.find(item => item.label === label); return <td key={scholarship.id}>{criterion ? <div className="comparison-criterion"><strong className={criterion.status === "Not met" ? "not" : criterion.status === "Unknown" ? "unknown" : "met"}>{criterion.status === "Met" ? "✓ Met" : criterion.status === "Unknown" ? "? Unknown" : "× Not met"}</strong><span>{criterion.explanation}</span></div> : <span className="table-note">Not listed</span>}</td>; })}</tr>)}</tbody></table></div><div className="comparison-footer"><Link href="/scholarships" className="text-button">← Back to matches</Link><span>Showing {selected.length} of 3 available comparison slots</span></div></section>}
  </div></AppShell>;
}
