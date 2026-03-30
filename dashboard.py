import sqlite3
import pandas as pd
import plotly.express as px

def risk_pie_chart():

    conn = sqlite3.connect("database.db")

    df = pd.read_sql_query("SELECT risk FROM scans", conn)

    conn.close()

    fig = px.pie(
        df,
        names="risk",
        title="Risk Distribution"
    )

    fig.show()


def score_timeline():

    conn = sqlite3.connect("database.db")

    df = pd.read_sql_query(
        "SELECT date, score FROM scans",
        conn
    )

    conn.close()

    fig = px.line(
        df,
        x="date",
        y="score",
        title="Scan Score Timeline"
    )

    fig.show()