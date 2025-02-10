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
        const rawCounters = await db.get(`
            SELECT * 
            FROM Users
                INNER JOIN Sessions ON Sessions.id = ? AND Sessions.user = name
                INNER JOIN Counters ON 1 = 1
        `, sessionId);
        console.log(rawCounters);
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
        console.log(await db.run(`INSERT INTO Counters (label, user, visibility) VALUES (?, ?, ?);`,
                newCounter.label, newCounter.user, newCounter.visibility
            )
        );
        return json({ status: 200 });
    } catch (e) {
        return handleServerError(e);
    }
};
