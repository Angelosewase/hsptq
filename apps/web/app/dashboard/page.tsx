import styles from "./page.module.css";

const METRICS = [
  { label: "Active Waiting", value: "24", delta: "+3", deltaType: "up" as const, icon: "queue" },
  { label: "Avg Wait Time", value: "18m", delta: "-2m", deltaType: "down" as const, icon: "clock" },
  { label: "Served Today", value: "87", delta: "+12", deltaType: "up" as const, icon: "check" },
  { label: "No-Show Rate", value: "4.2%", delta: "+0.5%", deltaType: "warn" as const, icon: "alert" },
];

type VisitStatus = "waiting" | "called" | "in-consultation" | "served" | "no-show";
type Channel = "app" | "qr" | "ussd";

interface QueueRow {
  queueNumber: string;
  name: string;
  phone: string;
  department: string;
  checkInTime: string;
  channel: Channel;
  waitDuration: string;
  status: VisitStatus;
  breached: boolean;
}

const QUEUE_DATA: QueueRow[] = [
  { queueNumber: "GM-001", name: "Jean Mugabo", phone: "+250 788 123 456", department: "General Medicine", checkInTime: "07:42", channel: "app", waitDuration: "42 min", status: "waiting", breached: true },
  { queueNumber: "GM-002", name: "Alice Uwimana", phone: "+250 722 987 654", department: "General Medicine", checkInTime: "07:51", channel: "qr", waitDuration: "33 min", status: "called", breached: false },
  { queueNumber: "DN-001", name: "Patrick Habimana", phone: "+250 788 456 789", department: "Dentistry", checkInTime: "08:03", channel: "ussd", waitDuration: "21 min", status: "in-consultation", breached: false },
  { queueNumber: "GM-003", name: "Marie Mukamana", phone: "+250 733 111 222", department: "General Medicine", checkInTime: "08:10", channel: "app", waitDuration: "14 min", status: "waiting", breached: false },
  { queueNumber: "PD-001", name: "Claude Niyonzima", phone: "+250 788 333 444", department: "Pediatrics", checkInTime: "08:15", channel: "qr", waitDuration: "9 min", status: "waiting", breached: false },
  { queueNumber: "GM-004", name: "Grace Ingabire", phone: "+250 722 555 666", department: "General Medicine", checkInTime: "08:22", channel: "ussd", waitDuration: "2 min", status: "waiting", breached: false },
  { queueNumber: "DN-002", name: "Eric Ndayisaba", phone: "+250 788 777 888", department: "Dentistry", checkInTime: "08:25", channel: "app", waitDuration: "< 1 min", status: "waiting", breached: false },
];

function StatusBadge({ status }: { status: VisitStatus }) {
  const labels: Record<VisitStatus, string> = {
    waiting: "WAITING",
    called: "CALLED",
    "in-consultation": "IN CONSULT",
    served: "SERVED",
    "no-show": "NO-SHOW",
  };
  return <span className={`${styles.badge} ${styles[`badge_${status.replace("-", "")}`]}`}>{labels[status]}</span>;
}

function ChannelChip({ channel }: { channel: Channel }) {
  const labels: Record<Channel, string> = { app: "Mobile App", qr: "QR Kiosk", ussd: "USSD" };
  const icons: Record<Channel, string> = { app: "📱", qr: "📷", ussd: "📞" };
  return (
    <span className={`${styles.chip} ${styles[`chip_${channel}`]}`}>
      <span className={styles.chipIcon}>{icons[channel]}</span>
      {labels[channel]}
    </span>
  );
}

function MetricIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "queue":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 10h12M4 14h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      );
    case "clock":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    case "check":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" /><path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      );
    case "alert":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
      );
    default:
      return null;
  }
}

export default function LiveQueuePage() {
  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Live Queue</h1>
          <p className={styles.pageSubtitle}>Real-time patient queue for today, Sep 21 2026</p>
        </div>
        <button className={styles.callNextBtn} id="call-next-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10M9 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Call Next Patient
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className={styles.metrics}>
        {METRICS.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <MetricIcon icon={m.icon} />
            </div>
            <div className={styles.metricBody}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
            <span
              className={`${styles.metricDelta} ${
                m.deltaType === "warn" ? styles.metricDeltaWarn : m.deltaType === "down" ? styles.metricDeltaGood : ""
              }`}
            >
              {m.delta}
            </span>
          </div>
        ))}
      </div>

      {/* ── Queue Table ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Patient Queue</h2>
          <div className={styles.tableFilters}>
            <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>All</button>
            <button className={styles.filterBtn}>Waiting</button>
            <button className={styles.filterBtn}>Called</button>
            <button className={styles.filterBtn}>In Consult</button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Queue #</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Check-in</th>
                <th>Channel</th>
                <th>Wait Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {QUEUE_DATA.map((row) => (
                <tr key={row.queueNumber} className={row.breached ? styles.rowBreached : ""}>
                  <td>
                    <span className={styles.queueNum}>{row.queueNumber}</span>
                  </td>
                  <td>
                    <div className={styles.patientCell}>
                      <span className={styles.patientName}>{row.name}</span>
                      <span className={styles.patientPhone}>{row.phone}</span>
                    </div>
                  </td>
                  <td>{row.department}</td>
                  <td className={styles.mono}>{row.checkInTime}</td>
                  <td>
                    <ChannelChip channel={row.channel} />
                  </td>
                  <td>
                    <span className={row.breached ? styles.waitBreached : ""}>{row.waitDuration}</span>
                  </td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {row.status === "waiting" && (
                        <>
                          <button className={styles.actionBtn} title="Call Patient">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                          <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} title="Mark No-Show">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        </>
                      )}
                      {row.status === "called" && (
                        <button className={styles.actionBtnServe} title="Mark Served">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Serve
                        </button>
                      )}
                      {row.status === "in-consultation" && (
                        <button className={styles.actionBtnServe} title="Mark Served">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
