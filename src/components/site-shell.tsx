"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const protectedLinks = [
  ["Overview", "/dashboard", "⌂"],
  ["My profile", "/profile", "◌"],
  ["Find scholarships", "/scholarships", "✦"],
  ["Compare", "/compare", "⇄"],
  ["Evidence", "/evidence", "▣"],
  ["Deadlines", "/deadlines", "◷"],
] as const;

function isCurrentPath(pathname: string | null, href: string) {
  if (!pathname || href.includes("#")) return false;
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}

function routeLabel(pathname: string | null) {
  const match = protectedLinks.find(([, href]) => isCurrentPath(pathname, href));
  if (match) return match[0];
  return pathname === "/settings" ? "Settings" : "Overview";
}

export function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

export function PublicHeader() {
  const pathname = usePathname();
  return <header className="public-header">
    <Link href="/" className="wordmark" aria-label="ScholarReady home" aria-current={pathname === "/" ? "page" : undefined}><Mark /><span>scholar<span>ready</span></span></Link>
    <nav className="public-nav" aria-label="Main navigation">
      <Link href="/#how-it-works">How it works</Link>
      <Link href="/pricing" aria-current={pathname === "/pricing" ? "page" : undefined}>Pricing</Link>
      <Link href="/login" className="nav-login" aria-current={pathname === "/login" ? "page" : undefined}>Log in</Link>
      <Link href="/signup" className="button button-small" aria-current={pathname === "/signup" ? "page" : undefined}>Get started <span aria-hidden="true">→</span></Link>
    </nav>
  </header>;
}

export function PublicFooter() {
  return <footer className="public-footer">
    <div className="wordmark"><Mark /><span>scholar<span>ready</span></span></div>
    <p>A calmer way to prepare for scholarship applications.</p>
    <span className="footer-note">Fictional data for demonstration · Built for planning, not prediction</span>
  </footer>;
}

function WorkspaceLinks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return <>
    {protectedLinks.map(([label, href, icon]) => <Link key={label} href={href} className={active === label ? "active" : ""} aria-current={active === label ? "page" : undefined} onClick={onNavigate}><span className="side-icon" aria-hidden="true">{icon}</span>{label}</Link>)}
    <Link href="/settings" className={active === "Settings" ? "active" : ""} aria-current={active === "Settings" ? "page" : undefined} onClick={onNavigate}><span className="side-icon" aria-hidden="true">⚙</span>Settings</Link>
  </>;
}

export function AppShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const pathname = usePathname();
  const currentActive = active ?? routeLabel(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return <div className="app-frame">
    <aside className="sidebar" aria-label="Desktop workspace navigation">
      <Link href="/dashboard" className="wordmark side-logo" aria-label="ScholarReady dashboard"><Mark /><span>scholar<span>ready</span></span></Link>
      <div className="side-label">YOUR WORKSPACE</div>
      <nav className="side-nav" aria-label="Workspace navigation"><WorkspaceLinks active={currentActive} /></nav>
      <div className="sidebar-bottom">
        <div className="profile-mini"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Undergraduate</span></div><span className="dots">•••</span></div>
      </div>
    </aside>
    <main className="app-main">
      <header className="mobile-top">
        <Link href="/dashboard" className="wordmark" aria-label="ScholarReady dashboard"><Mark /><span>scholar<span>ready</span></span></Link>
        <button className="icon-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-workspace-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? "×" : "☰"}</button>
      </header>
      <nav id="mobile-workspace-navigation" className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-label="Mobile workspace navigation" hidden={!menuOpen}><WorkspaceLinks active={currentActive} onNavigate={() => setMenuOpen(false)} /></nav>
      {children}
    </main>
  </div>;
}

export function StatusPill({ state }: { state: string }) {
  return <span className={`status status-${state.toLowerCase().replaceAll(" ", "-")}`}><i aria-hidden="true" />{state}</span>;
}
