"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  {
    label: "Live Queue",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4h14M3 8h10M3 12h14M3 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Patient History",
    href: "/dashboard/history",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="10" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="8.5" y="6" width="3" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "QR Signage",
    href: "/dashboard/qr-signage",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="12" y="3" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="12" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="12" y="12" width="2.5" height="2.5" fill="currentColor" />
        <rect x="16" y="12" width="1.5" height="1.5" fill="currentColor" />
        <rect x="12" y="15.5" width="1.5" height="1.5" fill="currentColor" />
        <rect x="15" y="15.5" width="2.5" height="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="10" fill="#0E7490" />
            <path
              d="M14 16h6v6h-6zM28 16h6v6h-6zM14 28h6v6h-6zM28 28h2v2h-2zM32 28h2v2h-2zM28 32h2v2h-2zM32 32h4v4h-4z"
              fill="white"
            />
            <path
              d="M24 14v20M14 24h20"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
          <div className={styles.brandText}>
            <span className={styles.brandName}>CareFlow</span>
            <span className={styles.brandSub}>Queue System</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.facility}>
            <div className={styles.facilityDot} />
            <div>
              <div className={styles.facilityName}>Kigali Central Hospital</div>
              <div className={styles.facilityStatus}>System Online</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* ── Top Header ── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <select className={styles.deptSelect} id="department-selector">
              <option>All Departments</option>
              <option>General Medicine</option>
              <option>Dentistry</option>
              <option>Pediatrics</option>
              <option>Ophthalmology</option>
            </select>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search patients..."
                className={styles.searchInput}
                id="patient-search"
              />
            </div>
            <button className={styles.iconBtn} id="notifications-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a5 5 0 0 0-5 5v3l-1.5 2.5h13L15 10V7a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className={styles.notifBadge}>3</span>
            </button>
            <div className={styles.avatar} id="user-avatar">
              <span>DR</span>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
