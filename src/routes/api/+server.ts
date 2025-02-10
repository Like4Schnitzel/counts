import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import { handleServerError } from "$lib";
import type { Counter } from "$lib/types";

const db = await openDb();

export const GET: RequestHandler = async ({ request, cookies }) => {
    try {
        const allCounters: Counter[] = [];
        const sessionId = cookies.get('session-id');
        // TODO this is so gonna break once I have reasons. live laugh race condition.
        await db.each(`
            SELECT label, Sessions.user, visibility, Counters.id
            FROM Users
                INNER JOIN Sessions ON Sessions.id = ? AND Sessions.user = name
                INNER JOIN Counters ON Counters.user = Users.name
        `, sessionId, (err, row) => {
            if (err) console.log(err);
            const counter: Counter = {
                label: row.label,
                user: row.user,
                visibility: row.visibility,
                reasons: []
            };
            db.each(`
                SELECT *
                FROM Reasons WHERE id = ?
                `, row.id, (err, row) => {
                    if (err) console.log(err);
                    counter.reasons.push(row);
                });
            allCounters.push(counter);
        });
        //await new Promise((res, rej) => setTimeout(res, 300));
        return json({ counters: allCounters }, { status: 200 });
    } catch (e: unknown) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : null;
        return json({ message: errorMessage }, { status: 500 });
    }
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const label = body.label;
        const sessionId = cookies.get('session-id');
        const username = (await db.get(`SELECT name FROM Users INNER JOIN Sessions ON id = ? AND user = name;`, sessionId)).name;
        const newCounter: Counter = {
            label,
            user: username,
            visibility: "PRIVATE",
            reasons: []
        }
        await db.run(`INSERT INTO Counters (label, user, visibility) VALUES (?, ?, ?);`,
            newCounter.label, newCounter.user, newCounter.visibility
        );
        return json({ status: 200 });
    } catch (e) {
        return handleServerError(e);
    }
};
