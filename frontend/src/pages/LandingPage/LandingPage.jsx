import React, { useEffect, useRef, useState } from "react";
import {
  Package,
  Truck,
  Bell,
  CalendarClock,
  Search,
  LayoutDashboard,
  FileDown,
  ShieldCheck,
  ArrowRight,
  ScanLine,
  UserCog,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import "./LandingPage.css";

/* ------------------------------------------------------------------ *
 *  MediStock — Landing Page (plain CSS, no Tailwind required)
 *  Design language: a working pharmacy inventory system, not a poster.
 * ------------------------------------------------------------------ */

/* ---------- scroll reveal helper ---------- */
function Reveal({ children, className = "", style }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`ms-reveal ${inView ? "ms-in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---------- data ---------- */
const STOCK_ROWS = [
  { name: "Amoxicillin 500mg", batch: "BAT-22981", qty: "1,240", expires: "04/2027", status: "In stock" },
  { name: "Insulin Glargine", batch: "BAT-23015", qty: "38", expires: "11/2026", status: "Low stock" },
  { name: "Paracetamol 650mg", batch: "BAT-22750", qty: "60", expires: "08/2026", status: "Expiring soon" },
  { name: "Metformin 500mg", batch: "BAT-23102", qty: "890", expires: "02/2028", status: "In stock" },
  { name: "Azithromycin 250mg", batch: "BAT-22899", qty: "0", expires: "06/2026", status: "Out of stock" },
];

function statusClass(status) {
  switch (status) {
    case "In stock":
      return "ms-status ms-status-ok";
    case "Low stock":
      return "ms-status ms-status-low";
    case "Expiring soon":
      return "ms-status ms-status-exp";
    default:
      return "ms-status ms-status-out";
  }
}

const MODULES = [
  {
    tag: "STOCK",
    icon: Package,
    title: "Medicine inventory",
    desc: "Add, batch-track, and categorize every medicine, with a full history of every change made to the shelf.",
  },
  {
    tag: "SUPPLY",
    icon: Truck,
    title: "Supplier records",
    desc: "Keep supplier contacts, purchase history, and performance in one place instead of scattered spreadsheets.",
  },
  {
    tag: "ALERT",
    icon: Bell,
    title: "Stock monitoring",
    desc: "Live quantity tracking with low-stock and out-of-stock alerts pushed the moment a threshold is crossed.",
  },
  {
    tag: "EXPIRY",
    icon: CalendarClock,
    title: "Expiry tracking",
    desc: "Near-expiry and expired batches are flagged automatically, well before they become a write-off.",
  },
  {
    tag: "FIND",
    icon: Search,
    title: "Search & filter",
    desc: "Locate any medicine by name, category, supplier, batch number, expiry date, or stock status in seconds.",
  },
  {
    tag: "DASH",
    icon: LayoutDashboard,
    title: "Analytics dashboards",
    desc: "Role-specific dashboards surface what matters — from shelf overview to supplier and stock-movement analytics.",
  },
  {
    tag: "NOTIFY",
    icon: ScanLine,
    title: "Notifications",
    desc: "Email and push alerts for expiry, low stock, and purchases, so nothing waits for someone to check.",
  },
  {
    tag: "EXPORT",
    icon: FileDown,
    title: "Reports & export",
    desc: "Generate and download inventory, stock, and purchase-history reports as PDF or Excel on demand.",
  },
];

const ROLES = [
  {
    icon: UserCog,
    name: "Admin",
    line: "Full system oversight",
    points: ["Inventory & supplier analytics", "User activity & access control", "System-wide monitoring"],
  },
  {
    icon: Stethoscope,
    name: "Pharmacist",
    line: "Day-to-day shelf owner",
    points: ["Inventory overview & low-stock items", "Expiring medicines watchlist", "Purchase summaries & supplier insight"],
  },
  {
    icon: ClipboardList,
    name: "Staff",
    line: "Floor-level updates",
    points: ["Scan & search medicines", "Update stock on the move", "Receive low-stock alerts"],
  },
];

/* ------------------------------------------------------------------ */

export default function MediStockLandingPage() {
  return (
    <div className="ms-root">
      {/* NAV */}
      <header className="ms-nav">
        <div className="ms-nav-inner">
          <div className="ms-logo">
            <div className="ms-logo-mark ms-mono">Ms</div>
            <span className="ms-logo-text ms-display">MediStock</span>
          </div>
          <nav className="ms-nav-links">
            <a href="#modules">Modules</a>
            <a href="#workflow">Workflow</a>
            <a href="#roles">Roles</a>
            <a href="#dashboards">Dashboards</a>
          </nav>
          <a href="/register" className="ms-btn-primary small">Register</a>
                   
        </div>
      </header>

      {/* HERO */}
      <section className="ms-hero">
        <div>
          <div className="ms-chip">
            <span className="ms-chip-dot" />
            Pharmacy · Hospital · Clinic inventory
          </div>
          <h1 className="ms-display ms-hero-title">
            Every batch, every expiry date, accounted for.
          </h1>
          <p className="ms-hero-sub">
            MediStock replaces the spreadsheet and the sticky note with one live system for stock, suppliers,
            and expiry — built for pharmacists, admins, and floor staff who can't afford to guess.
          </p>
          <div className="ms-hero-cta-row">
            <a href="#cta" className="ms-btn-primary large">
              Get a walkthrough <ArrowRight size={16} />
            </a>
            <a href="#modules" className="ms-btn-ghost">
              See the modules
            </a>
          </div>
          <div className="ms-hero-trust ms-mono">
            <span>BUILT FOR</span>
            <span className="ms-chip tight">Admin</span>
            <span className="ms-chip tight">Pharmacist</span>
            <span className="ms-chip tight">Staff</span>
          </div>
        </div>

        {/* Signature element: live stock ledger card */}
        <Reveal>
          <div className="ms-card ms-ledger">
            <div className="ms-ledger-head">
              <div>
                <p className="ms-ledger-label ms-mono">LIVE VIEW</p>
                <p className="ms-ledger-title ms-display">Stock ledger</p>
              </div>
              <div className="ms-status ms-status-low">
                <span className="ms-pulse-dot" />
                2 need attention
              </div>
            </div>

            <div className="ms-ledger-cols ms-mono">
              <span>MEDICINE</span>
              <span>BATCH</span>
              <span style={{ textAlign: "right" }}>QTY</span>
              <span>EXPIRES</span>
              <span>STATUS</span>
            </div>

            <div>
              {STOCK_ROWS.map((row) => (
                <div key={row.batch} className="ms-ledger-row">
                  <span className="ms-ledger-name">{row.name}</span>
                  <span className="ms-ledger-mono ms-mono">{row.batch}</span>
                  <span className="ms-ledger-mono ms-mono right">{row.qty}</span>
                  <span className="ms-ledger-mono ms-mono">{row.expires}</span>
                  <span className={statusClass(row.status)}>{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* BEFORE / AFTER */}
      <section id="workflow" className="ms-section ms-section-tight">
        <Reveal>
          <div className="ms-card ms-compare">
            <div className="ms-compare-panel left">
              <p className="ms-eyebrow ms-mono">WITHOUT MEDISTOCK</p>
              <ul className="ms-compare-list muted">
                <li>Stock counted by hand, once a week if you're lucky</li>
                <li>Expired medicine found during the next audit, not before</li>
                <li>Supplier history split across calls, emails, and memory</li>
                <li>No one finds out about a stockout until a patient does</li>
              </ul>
            </div>
            <div className="ms-compare-panel right">
              <p className="ms-eyebrow ms-mono" style={{ color: "var(--teal-deep)" }}>WITH MEDISTOCK</p>
              <ul className="ms-compare-list solid">
                <li>Quantities update the moment stock moves</li>
                <li>Expiry alerts fire weeks before a batch turns over</li>
                <li>Every supplier and purchase logged in one record</li>
                <li>Low-stock notifications reach staff before the shelf is empty</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MODULES */}
      <section id="modules" className="ms-section">
        <Reveal>
          <p className="ms-eyebrow ms-mono">WHAT'S INSIDE</p>
          <h2 className="ms-display ms-section-title">One system, every part of the shelf</h2>
          <p className="ms-section-lead">
            Nine working modules, from authentication to reporting, built to run as one connected platform rather than
            separate tools.
          </p>
        </Reveal>
        <div className="ms-modules-grid">
          {MODULES.map((m) => (
            <Reveal key={m.title}>
              <div className="ms-card ms-module-card">
                <span className="ms-corner-tag ms-mono">{m.tag}</span>
                <div className="ms-module-body">
                  <m.icon size={20} color="var(--teal)" className="ms-module-icon" />
                  <p className="ms-module-title ms-display">{m.title}</p>
                  <p className="ms-module-desc">{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="ms-section">
        <Reveal>
          <p className="ms-eyebrow ms-mono">ACCESS</p>
          <h2 className="ms-display ms-section-title">Built around who's using it</h2>
          <p className="ms-section-lead">
            Role-based access means each person sees exactly what their job needs — nothing more, nothing hidden.
          </p>
        </Reveal>
        <div className="ms-roles-grid">
          {ROLES.map((r) => (
            <Reveal key={r.name}>
              <div className="ms-role-card">
                <r.icon size={22} color="var(--teal)" />
                <p className="ms-role-name ms-display">{r.name}</p>
                <p className="ms-role-line">{r.line}</p>
                <ul className="ms-role-points">
                  {r.points.map((p) => (
                    <li key={p}>
                      <span className="dash">—</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboards" className="ms-section">
        <Reveal>
          <p className="ms-eyebrow ms-mono">VISIBILITY</p>
          <h2 className="ms-display ms-section-title">A dashboard for every desk</h2>
        </Reveal>
        <div className="ms-dash-grid">
          <Reveal>
            <div className="ms-card ms-dash-card">
              <p className="ms-dash-label ms-mono">PHARMACIST</p>
              <div className="ms-dash-tiles">
                {["Inventory overview", "Low-stock items", "Expiring medicines", "Supplier insights"].map((t) => (
                  <div key={t} className="ms-dash-tile">{t}</div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="ms-card ms-dash-card">
              <p className="ms-dash-label ms-mono">ADMIN</p>
              <div className="ms-dash-tiles">
                {["Inventory analytics", "Supplier analytics", "Stock movement reports", "System monitoring"].map((t) => (
                  <div key={t} className="ms-dash-tile">{t}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST / STACK STRIP */}
      <section className="ms-section ms-section-tight">
        <Reveal>
          <div className="ms-trust">
            <div className="ms-trust-left">
              <ShieldCheck size={16} color="var(--teal)" />
              JWT + OAuth2 secured, role-based access throughout
            </div>
            <div className="ms-trust-tags ms-mono">
              <span>JAVA</span><span>SPRING BOOT</span><span>REACT</span><span>POSTGRESQL</span><span>DOCKER</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="cta" className="ms-cta-wrap">
        <Reveal>
          <div className="ms-cta-box">
            <p className="ms-cta-eyebrow ms-mono">NEXT STOCK CHECK</p>
            <h2 className="ms-cta-title ms-display">Put the whole shelf on one screen.</h2>
            <p className="ms-cta-sub">
              See how MediStock tracks stock, suppliers, and expiry for your pharmacy, hospital, or clinic.
            </p>
            <a href="/register" className="ms-cta-btn">
              Register <ArrowRight size={16} />
            </a>
            <br/>
            <br />
             <p className="ms-cta-sub" style={{ fontSize: "0.875rem", color: "#b2b2b2" }}>
              Already have an account?  <a href="/login" className="ms-cta-link" style={{ color: "beige", textDecoration: "none" }}>
                Login
              </a>
            </p>
          
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="ms-footer">
        <span>© {new Date().getFullYear()} MediStock. Built for pharmacies, hospitals, and clinics.</span>
        <div className="ms-footer-links ms-mono">
          <a href="#modules">Modules</a>
          <a href="#roles">Roles</a>
          <a href="#dashboards">Dashboards</a>
        </div>
      </footer>
    </div>
  );
}