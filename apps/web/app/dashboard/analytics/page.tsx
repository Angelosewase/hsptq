import styles from "./page.module.css";

const SUMMARY = [
  { label: "Total Patients Today", value: "87", trend: "+14%", trendUp: true },
  { label: "Average Wait Time", value: "18 min", trend: "-2 min", trendUp: false },
  { label: "Peak Hour", value: "10:00 AM", trend: "42 patients", trendUp: true },
  { label: "No-Show Rate", value: "4.2%", trend: "+0.5%", trendUp: true },
];

const HOURLY_DATA = [
  { hour: "7 AM", count: 8, max: 42 },
  { hour: "8 AM", count: 15, max: 42 },
  { hour: "9 AM", count: 28, max: 42 },
  { hour: "10 AM", count: 42, max: 42 },
  { hour: "11 AM", count: 35, max: 42 },
  { hour: "12 PM", count: 22, max: 42 },
  { hour: "1 PM", count: 18, max: 42 },
  { hour: "2 PM", count: 30, max: 42 },
  { hour: "3 PM", count: 25, max: 42 },
  { hour: "4 PM", count: 12, max: 42 },
];

const DEPT_DATA = [
  { name: "General Medicine", patients: 42, avgWait: "22 min", noShowRate: "5.1%", satisfaction: "4.2/5" },
  { name: "Dentistry", patients: 18, avgWait: "14 min", noShowRate: "2.8%", satisfaction: "4.6/5" },
  { name: "Pediatrics", patients: 15, avgWait: "16 min", noShowRate: "3.5%", satisfaction: "4.4/5" },
  { name: "Ophthalmology", patients: 12, avgWait: "20 min", noShowRate: "6.2%", satisfaction: "4.1/5" },
];

const CHANNEL_DATA = [
  { channel: "Mobile App", count: 38, percent: 43.7, color: "#4338CA" },
  { channel: "QR Kiosk", count: 31, percent: 35.6, color: "#0369A1" },
  { channel: "USSD", count: 18, percent: 20.7, color: "#475569" },
];

export default function AnalyticsPage() {
  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <p className={styles.pageSubtitle}>Department performance and queue insights</p>
        </div>
        <div className={styles.headerActions}>
          <select className={styles.periodSelect} id="analytics-period">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className={styles.summaryGrid}>
        {SUMMARY.map((s) => (
          <div key={s.label} className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{s.label}</span>
            <span className={styles.summaryValue}>{s.value}</span>
            <span className={`${styles.summaryTrend} ${s.label === "No-Show Rate" ? styles.trendWarn : s.trendUp ? styles.trendUp : styles.trendDown}`}>
              {s.trend}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartsRow}>
        {/* ── Hourly Throughput ── */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Hourly Patient Throughput</h2>
          <div className={styles.barChart}>
            {HOURLY_DATA.map((d) => (
              <div key={d.hour} className={styles.barCol}>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.bar} ${d.count === d.max ? styles.barPeak : ""}`}
                    style={{ height: `${(d.count / d.max) * 100}%` }}
                  >
                    <span className={styles.barValue}>{d.count}</span>
                  </div>
                </div>
                <span className={styles.barLabel}>{d.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Channel Distribution ── */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Check-in Channel Distribution</h2>
          <div className={styles.channelList}>
            {CHANNEL_DATA.map((ch) => (
              <div key={ch.channel} className={styles.channelItem}>
                <div className={styles.channelHeader}>
                  <span className={styles.channelName}>{ch.channel}</span>
                  <span className={styles.channelCount}>{ch.count} patients ({ch.percent}%)</span>
                </div>
                <div className={styles.channelTrack}>
                  <div className={styles.channelBar} style={{ width: `${ch.percent}%`, background: ch.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.channelTotal}>
            <span>Total check-ins</span>
            <span className={styles.channelTotalValue}>87</span>
          </div>
        </div>
      </div>

      {/* ── Department Comparison ── */}
      <div className={styles.deptCard}>
        <h2 className={styles.chartTitle}>Department Comparison</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Patients Served</th>
                <th>Avg Wait Time</th>
                <th>No-Show Rate</th>
                <th>Patient Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map((dept) => (
                <tr key={dept.name}>
                  <td className={styles.deptName}>{dept.name}</td>
                  <td>
                    <div className={styles.deptBarCell}>
                      <div className={styles.deptBar} style={{ width: `${(dept.patients / 42) * 100}%` }} />
                      <span>{dept.patients}</span>
                    </div>
                  </td>
                  <td>{dept.avgWait}</td>
                  <td>
                    <span className={parseFloat(dept.noShowRate) > 5 ? styles.cellWarn : styles.cellGood}>
                      {dept.noShowRate}
                    </span>
                  </td>
                  <td>
                    <div className={styles.stars}>
                      {dept.satisfaction}
                      <span className={styles.starIcon}>★</span>
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
