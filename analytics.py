import sqlite3

def get_risk_distribution():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("SELECT risk, COUNT(*) FROM scans GROUP BY risk")
    rows = c.fetchall()

    conn.close()

    data = {
        "Elite": 0,
        "Standard": 0,
        "Legacy": 0,
        "Critical": 0
    }

    for r in rows:
        data[r[0]] = r[1]

    return data


def enterprise_summary():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    c.execute("SELECT COUNT(*) FROM scans")
    total = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM scans WHERE risk='Elite'")
    elite = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM scans WHERE risk='Standard'")
    standard = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM scans WHERE risk='Legacy'")
    legacy = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM scans WHERE risk='Critical'")
    critical = c.fetchone()[0]

    conn.close()

    readiness = 0
    if total > 0:
        readiness = int(((elite + standard) / total) * 100)

    return {
        "total_scans": total,
        "elite": elite,
        "standard": standard,
        "legacy": legacy,
        "critical": critical,
        "quantum_readiness": readiness
    }