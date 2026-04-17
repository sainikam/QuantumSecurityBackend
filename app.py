from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -------------------------------
# DATABASE INITIALIZATION
# -------------------------------
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            role TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY,
            target TEXT,
            tls TEXT,
            cipher TEXT,
            algorithm TEXT,
            score INTEGER,
            risk TEXT,
            date TEXT
        )
    ''')

    c.execute("INSERT OR IGNORE INTO users VALUES (1,'admin','admin123','admin')")
    c.execute("INSERT OR IGNORE INTO users VALUES (2,'auditor','audit123','auditor')")

    conn.commit()
    conn.close()

init_db()

# -------------------------------
# LOAD DASHBOARD PAGE
# -------------------------------
@app.route("/")
def home():
    return render_template("index.html")


# -------------------------------
# LOGIN API
# -------------------------------
@app.route('/login', methods=['POST'])
def login():

    data = request.json
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute("SELECT role FROM users WHERE username=? AND password=?", (username,password))
    user = c.fetchone()

    conn.close()

    if user:
        return jsonify({"status":"success","role":user[0]})
    else:
        return jsonify({"status":"fail"}),401


# -------------------------------
# SCAN API
# -------------------------------
@app.route('/scan', methods=['POST'])
def scan():

    data = request.json
    target = data['target']

    tls = random.choice(["TLS 1.0","TLS 1.2","TLS 1.3"])
    cipher = random.choice(["AES-128","AES-256","ChaCha20"])
    algorithm = random.choice(["RSA-1024","RSA-2048","RSA-3072"])

    score = 0

    score += 400 if tls=="TLS 1.3" else 250 if tls=="TLS 1.2" else 100
    score += 300 if "256" in cipher else 150
    score += 300 if "3072" in algorithm else 200 if "2048" in algorithm else 100

    if score > 700:
        risk="Elite"
    elif score > 400:
        risk="Standard"
    elif score > 200:
        risk="Legacy"
    else:
        risk="Critical"

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute('''
        INSERT INTO scans (target,tls,cipher,algorithm,score,risk,date)
        VALUES (?,?,?,?,?,?,?)
    ''',(target,tls,cipher,algorithm,score,risk,datetime.now()))

    conn.commit()
    conn.close()

    return jsonify({
        "target":target,
        "tls":tls,
        "cipher":cipher,
        "algorithm":algorithm,
        "score":score,
        "risk":risk
    })


# -------------------------------
# HISTORY API
# -------------------------------
@app.route('/history', methods=['GET'])
def history():

    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    c.execute("SELECT * FROM scans")
    rows = c.fetchall()

    conn.close()

    data=[]

    for row in rows:
        data.append({
            "id":row[0],
            "target":row[1],
            "tls":row[2],
            "cipher":row[3],
            "algorithm":row[4],
            "score":row[5],
            "risk":row[6],
            "date":row[7]
        })

    return jsonify(data)


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == '__main__':
    app.run(debug=True)