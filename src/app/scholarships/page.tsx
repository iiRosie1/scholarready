import Link from "next/link";
import { AppShell, StatusPill } from "@/components/site-shell";
import { formatDate, scholarships } from "@/lib/demo-data";

function ScholarshipCard({ scholarship }: { scholarship: (typeof scholarships)[number] }) {
  return <article className="scholar-card" aria-labelledby={`${scholarship.id}-title`}>
    <div className="scholar-card-top"><span className="eyebrow">{scholarship.category}</span><StatusPill state={scholarship.state} /></div>
    <h2 id={`${scholarship.id}-title`}>{scholarship.name}</h2>
    <div className="provider">{scholarship.provider}</div>
    <p className="scholar-summary">{scholarship.summary}</p>
    <div className="scholar-meta"><span>AWARD<b>{scholarship.amount}</b></span><span>DEADLINE<b>{formatDate(scholarship.deadline)}</b></span></div>
    <div className="criteria" aria-label={`${scholarship.name} match summary`}>
      {scholarship.criteria.map(criterion => <div className="criterion" key={criterion.label}><span>{criterion.label}</span><b className={criterion.status === "Not met" ? "not" : ""}>{criterion.status === "Met" ? "✓ Met" : criterion.status === "Unknown" ? "? Unknown" : "× Not met"}</b></div>)}
    </div>
    <Link className="card-link" href={`/applications/${scholarship.id}`}>Review opportunity <span aria-hidden="true">→</span></Link>
  </article>;
}

export default function ScholarshipsPage() {
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
      <div className="filter-bar"><input aria-label="Search scholarships" placeholder="Search by name or provider" /><select aria-label="Filter by category" defaultValue="all"><option value="all">All categories</option><option>STEM</option><option>Community</option><option>Environment</option><option>Creative</option></select><select aria-label="Sort scholarships" defaultValue="match"><option value="match">Best match</option><option value="deadline">Deadline soonest</option><option value="name">Name A–Z</option></select><button className="button button-small button-quiet" type="button">Reset</button></div>
      <div className="scholarship-grid">{scholarships.map(scholarship => <ScholarshipCard key={scholarship.id} scholarship={scholarship} />)}</div>
    </div>
  </AppShell>;
}
