import { redirect } from '@sveltejs/kit';
import { openDb } from '$lib/db.js';

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
