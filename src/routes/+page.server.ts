import { redirect } from '@sveltejs/kit';
import { openDb } from '$lib/db.js';
import { handleFormActionServerError, sendFormActionData } from '$lib';

const db = await openDb();

export async function load({ cookies }) {
    const sessionID = cookies.get('session-id');


    if (!sessionID || !await db.get(`SELECT * FROM Sessions WHERE id = ?`, sessionID)) {
        redirect(307, './login');
    }

    return {
        sessionID
    };
}

export const actions = {
    addCounter: async ({ cookies, request }) => {
        try {
            const body = await request.json();
            const label = body.label;
            const sessionId = cookies.get('session-id');
            const username = (await db.get(`SELECT name FROM Users INNER JOIN Sessions ON id = ? AND user = name;`, sessionId)).name;
            const counter = await db.get(`INSERT INTO Counters (label, user, visibility) VALUES (?, ?, ?) RETURNING *;`,
                label, username, "PRIVATE"
            );
            console.log(counter);
            return sendFormActionData(counter);
        } catch (e) {
            return handleFormActionServerError(e);
        }
    },
    addReason: async ({ cookies, request }) => {
        try {
            const body = await request.json();
            const sessionId = cookies.get('session-id');
            const username = (await db.get(`SELECT name FROM Users INNER JOIN Sessions ON id = ? AND user = name;`, sessionId)).name;
            const reason = await db.get(`INSERT INTO Reasons (counter, reason, weight, unit, culprit, added_by) VALUES (?, ?, ?, ?, ?, ?) RETURNING *;`,
                body.counter, body.reason, body.weight, body.unit, body.culprit, username
            );
            return sendFormActionData(reason);
        } catch (e) {
            return handleFormActionServerError(e);
        }
    }
}
