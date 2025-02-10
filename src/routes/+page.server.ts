import { redirect } from '@sveltejs/kit';
import { openDb } from '$lib/db.js';
import { handleServerError } from '$lib';

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
            await db.run(`INSERT INTO Counters (label, user, visibility) VALUES (?, ?, ?);`,
                label, username, "PRIVATE"
            );
            return { success: true };
        } catch (e) {
            return handleServerError(e);
        }
    }
}
