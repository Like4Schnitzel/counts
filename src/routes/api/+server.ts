import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import { handleServerError } from "$lib";
import type { Counter } from "$lib/types";

const db = await openDb();

export const GET: RequestHandler = async ({ request, cookies }) => {
    try {
        const allCounters: Counter[] = [];
        const counterDict: { [key: number]: Counter } = {};
        const sessionId = cookies.get('session-id');
        // TODO this is so gonna break once I have reasons. live laugh race condition.
        await db.each(`
            SELECT DISTINCT label, Sessions.user, visibility, Counters.id,
                reason, weight, unit, added_at, Reasons.id AS reason_id
            FROM Users
                INNER JOIN Sessions ON Sessions.id = ?
                INNER JOIN Counters ON Counters.user = Users.name
                LEFT JOIN Reasons ON Reasons.counter = Counters.id
            WHERE Counters.id IS NOT NULL
            GROUP BY Counters.id, Reasons.id;
        `, sessionId, async (err, row) => {
            if (err) console.log(err);
                if (!counterDict[row.id]) {
                    const counter: Counter = {
                        id: row.id,
                        label: row.label,
                        user: row.user,
                        visibility: row.visibility,
                        reasons: []
                    };
                    counterDict[row.id] = counter;
                    allCounters.push(counter);
                }
                if (row.reason) {
                    counterDict[row.id].reasons.push({
                        reason: row.reason,
                        weight: row.weight,
                        unit: row.unit,
                        id: row.reason_id,
                        added_at: new Date(),
                        counter_id: row.id,
                        culprit: row.culprit
                    });
                }
        });
        //await new Promise((res, rej) => setTimeout(res, 300));
        return json({ counters: allCounters }, { status: 200 });
    } catch (e: unknown) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : null;
        return json({ message: errorMessage }, { status: 500 });
    }
}
