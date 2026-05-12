import sqlite3

connection = sqlite3.connect('sql/weerstation.db')


with open('sql/weerstation.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

connection.commit()
connection.close()