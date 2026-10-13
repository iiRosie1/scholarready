import Link from "next/link";

const protectedLinks = [
  ["Overview", "/dashboard", "⌂"], ["My profile", "/profile", "◌"], ["Find scholarships", "/scholarships", "✦"], ["Compare", "/compare", "⇄"], ["Evidence", "/evidence", "▣"], ["Deadlines", "/deadlines", "◷"],
];

export function Mark() { return <span className="brand-mark" aria-hidden="true"><span /></span>; }

export function PublicHeader() {
  return <header className="public-header"><Link href="/" className="wordmark"><Mark /><span>scholar<span>ready</span></span></Link><nav className="public-nav" aria-label="Main navigation"><Link href="/#how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/login" className="nav-login">Log in</Link><Link href="/signup" className="button button-small">Get started <span aria-hidden="true">→</span></Link></nav></header>;
}

export function PublicFooter() { return <footer className="public-footer"><div className="wordmark"><Mark /><span>scholar<span>ready</span></span></div><p>A calmer way to prepare for scholarship applications.</p><span className="footer-note">Fictional data for demonstration · Built for planning, not prediction</span></footer>; }

export function AppShell({ children, active = "Overview" }: { children: React.ReactNode; active?: string }) {
  return <div className="app-frame"><aside className="sidebar"><Link href="/dashboard" className="wordmark side-logo"><Mark /><span>scholar<span>ready</span></span></Link><div className="side-label">YOUR WORKSPACE</div><nav className="side-nav" aria-label="Workspace navigation">{protectedLinks.map(([label, href, icon]) => <Link key={label} href={href} className={active === label ? "active" : ""} aria-current={active === label ? "page" : undefined}><span className="side-icon" aria-hidden="true">{icon}</span>{label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/settings" className={active === "Settings" ? "active" : ""}><span className="side-icon">⚙</span>Settings</Link><div className="profile-mini"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Undergraduate</span></div><span className="dots">•••</span></div></div></aside><main className="app-main"><div className="mobile-top"><Link href="/dashboard" className="wordmark"><Mark /><span>scholar<span>ready</span></span></Link><button className="icon-button" aria-label="Open navigation">☰</button></div>{children}</main></div>;
}

export function StatusPill({ state }: { state: string }) { return <span className={`status status-${state.toLowerCase().replaceAll(" ", "-")}`}><i aria-hidden="true" />{state}</span>; }
