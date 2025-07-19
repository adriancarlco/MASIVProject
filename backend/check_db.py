import sqlite3
import os

conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

db_path = os.path.abspath("db.sqlite3")
print("🔍 check_db.py is reading from:", db_path)

# Check for tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

conn.close()