import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";

const db = await openDb();
await db.exec(`
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

export const GET: RequestHandler = async ({ request }) => {
    try {
        const users: string[][] = [];
        await db.each("SELECT * FROM users;", (err, row) => {
            if (err) console.error(err);
            users.push(row);
        });
        return json({ status: 200, body: users });
    } catch (e: unknown) {
        console.error(e);
        return json({ status: 500, body: e });
    }
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        await db.exec("INSERT INTO users (name, password) VALUES ('Laura', '5678')");
        return json({ status: 200 });
    } catch (e: unknown) {
        console.error(e);
        return json({ status: 500, body: e });
    }
};
