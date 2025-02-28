import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// you would have to import / invoke this in another file
export async function openDb () {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}

(await openDb()).exec(`
  CREATE TABLE IF NOT EXISTS Users (
    name VARCHAR(32) PRIMARY KEY,
    password NVARCHAR(256)
  );
  CREATE TABLE IF NOT EXISTS Counters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label VARCHAR(64),
    user VARCHAR(32),
    visibility TEXT,
    FOREIGN KEY(user) REFERENCES Users(name)
  );
  CREATE TABLE IF NOT EXISTS Reasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    counter INTEGER,
    reason TEXT,
    weight REAL,
    unit TEXT,
    culprit VARCHAR(32),
    added_at INTEGER,
    FOREIGN KEY(counter) REFERENCES Counters(id)
  );
  CREATE TABLE IF NOT EXISTS Sessions (
    id TEXT PRIMARY KEY,
    user VARCHAR(32) PRIMARY KEY,
    expires_by INTEGER,
    FOREIGN KEY(user) REFERENCES Users(name)
  );
`);
