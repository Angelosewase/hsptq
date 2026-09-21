"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Channel = "app" | "qr" | "ussd";

interface HistoryRow {
  queueNumber: string;
  name: string;
  phone: string;
  department: string;
  checkIn: string;
  served: string;
  duration: string;
  channel: Channel;
  date: string;
}

const HISTORY_DATA: HistoryRow[] = [
  { queueNumber: "GM-087", name: "Jean Mugabo", phone: "+250 788 123 456", department: "General Medicine", checkIn: "07:42", served: "08:15", duration: "33 min", channel: "app", date: "Today" },
  { queueNumber: "DN-034", name: "Alice Uwimana", phone: "+250 722 987 654", department: "Dentistry", checkIn: "07:51", served: "08:30", duration: "39 min", channel: "qr", date: "Today" },
  { queueNumber: "PD-021", name: "Patrick Habimana", phone: "+250 788 456 789", department: "Pediatrics", checkIn: "08:03", served: "08:22", duration: "19 min", channel: "ussd", date: "Today" },
  { queueNumber: "GM-086", name: "Marie Mukamana", phone: "+250 733 111 222", department: "General Medicine", checkIn: "08:10", served: "08:38", duration: "28 min", channel: "app", date: "Today" },
  { queueNumber: "GM-085", name: "Claude Niyonzima", phone: "+250 788 333 444", department: "General Medicine", checkIn: "09:15", served: "09:42", duration: "27 min", channel: "qr", date: "Today" },
  { queueNumber: "OP-012", name: "Grace Ingabire", phone: "+250 722 555 666", department: "Ophthalmology", checkIn: "09:22", served: "09:55", duration: "33 min", channel: "app", date: "Today" },
  { queueNumber: "DN-033", name: "Eric Ndayisaba", phone: "+250 788 777 888", department: "Dentistry", checkIn: "10:00", served: "10:18", duration: "18 min", channel: "ussd", date: "Yesterday" },
  { queueNumber: "GM-084", name: "Ange Murekatete", phone: "+250 733 222 333", department: "General Medicine", checkIn: "10:30", served: "11:05", duration: "35 min", channel: "app", date: "Yesterday" },
  { queueNumber: "PD-020", name: "Diane Uwase", phone: "+250 788 444 555", department: "Pediatrics", checkIn: "11:00", served: "11:22", duration: "22 min", channel: "qr", date: "Yesterday" },
  { queueNumber: "GM-083", name: "Emmanuel Bizimana", phone: "+250 722 666 777", department: "General Medicine", checkIn: "11:15", served: "11:50", duration: "35 min", channel: "ussd", date: "Yesterday" },
];

function ChannelChip({ channel }: { channel: Channel }) {
  const labels: Record<Channel, string> = { app: "App", qr: "QR", ussd: "USSD" };
  return <span className={`${styles.chip} ${styles[`chip_${channel}`]}`}>{labels[channel]}</span>;
}

export default function HistoryPage() {
  const [selectedRow, setSelectedRow] = useState<HistoryRow | null>(null);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Patient History</h1>
          <p className={styles.pageSubtitle}>Completed visits and served patients</p>
        </div>
        <button className={styles.exportBtn} id="export-history-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Export CSV
        </button>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input type="text" placeholder="Search by name or queue #..." className={styles.searchInput} id="history-search" />
        </div>
        <select className={styles.selectFilter} id="history-dept-filter">
          <option>All Departments</option>
          <option>General Medicine</option>
          <option>Dentistry</option>
          <option>Pediatrics</option>
          <option>Ophthalmology</option>
        </select>
        <select className={styles.selectFilter} id="history-date-filter">
          <option>Today</option>
          <option>Yesterday</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className={styles.layoutBody}>
        {/* ── Table ── */}
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Check-in</th>
                  <th>Served</th>
                  <th>Duration</th>
                  <th>Channel</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY_DATA.map((row) => (
                  <tr
                    key={row.queueNumber}
                    className={selectedRow?.queueNumber === row.queueNumber ? styles.rowSelected : ""}
                    onClick={() => setSelectedRow(row)}
                  >
                    <td><span className={styles.queueNum}>{row.queueNumber}</span></td>
                    <td>
                      <div className={styles.patientCell}>
                        <span className={styles.patientName}>{row.name}</span>
                        <span className={styles.patientPhone}>{row.phone}</span>
                      </div>
                    </td>
                    <td>{row.department}</td>
                    <td className={styles.mono}>{row.checkIn}</td>
                    <td className={styles.mono}>{row.served}</td>
                    <td className={styles.duration}>{row.duration}</td>
                    <td><ChannelChip channel={row.channel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.tableFooter}>
            <span className={styles.showing}>Showing 10 of 87 visits</span>
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>&gt;</button>
            </div>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        {selectedRow && (
          <aside className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailTitle}>Visit Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedRow(null)} aria-label="Close detail panel">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Patient</span>
                <span className={styles.detailValue}>{selectedRow.name}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{selectedRow.phone}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Queue Number</span>
                <span className={styles.detailValue}>{selectedRow.queueNumber}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>{selectedRow.department}</span>
              </div>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Date</span>
                <span className={styles.detailValue}>{selectedRow.date}</span>
              </div>

              <div className={styles.timeline}>
                <h4 className={styles.timelineTitle}>Visit Timeline</h4>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div>
                    <div className={styles.timelineEvent}>Checked in</div>
                    <div className={styles.timelineTime}>{selectedRow.checkIn}</div>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${styles.timelineDotCalled}`} />
                  <div>
                    <div className={styles.timelineEvent}>Called to counter</div>
                    <div className={styles.timelineTime}>{selectedRow.checkIn}</div>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${styles.timelineDotServed}`} />
                  <div>
                    <div className={styles.timelineEvent}>Visit completed</div>
                    <div className={styles.timelineTime}>{selectedRow.served}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
