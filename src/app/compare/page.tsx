"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, StatusPill } from "@/components/site-shell";
import { scholarships } from "@/lib/demo-data";
import { COMPARE_SELECTION_KEY, normalizeCompareSelection } from "@/lib/compare-selection";

const scholarshipIds = scholarships.map(scholarship => scholarship.id);

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionReady, setSelectionReady] = useState(false);
  const selected = scholarships.filter(scholarship => selectedIds.includes(scholarship.id));

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
    {selected.length < 2 ? <section className="empty-state compare-empty"><h2>Select at least two scholarships</h2><p>Return to your matches and use “Add to compare” on two or three opportunities. Your selection will stay available in this browser session.</p><Link className="button button-small" href="/scholarships">Choose scholarships <span aria-hidden="true">→</span></Link>{selected.length === 1 && <div className="selected-preview"><span>Already selected</span><strong>{selected[0].name}</strong><button type="button" className="text-button" onClick={() => removeSelection(selected[0].id)}>Remove</button></div>}</section> : <section className="selection-preview" aria-labelledby="selection-preview-title"><div className="panel-heading"><h2 id="selection-preview-title">Selected opportunities</h2><span className="selection-cap">{selected.length}/3 selected</span></div><div className="selected-list">{selected.map(scholarship => <div className="selected-row" key={scholarship.id}><div><span className="eyebrow">{scholarship.category}</span><strong>{scholarship.name}</strong><small>{scholarship.provider}</small></div><StatusPill state={scholarship.state} /><button type="button" className="text-button" onClick={() => removeSelection(scholarship.id)}>Remove</button></div>)}</div><p className="compare-next-note">Your selection is ready for the comparison table. Continue reviewing your matches or remove an opportunity to choose another.</p></section>}
  </div></AppShell>;
}
