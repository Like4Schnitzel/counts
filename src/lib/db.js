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
        label VARCHAR(64) PRIMARY KEY,
        user VARCHAR(32),
        culprit VARCHAR(32),
        weight REAL,
        FOREIGN KEY(user) REFERENCES Users(name)
    );
    CREATE TABLE IF NOT EXISTS Reasons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        counter VARCHAR(64),
        reason VARCHAR(2000),
        FOREIGN KEY(counter) REFERENCES Counters(label)
    );
`);
