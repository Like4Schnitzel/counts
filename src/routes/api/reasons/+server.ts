import { handleNormalServerError } from "$lib";
import { openDb } from "$lib/db";
import { json, type RequestHandler } from "@sveltejs/kit";

const db = await openDb();

export const DELETE: RequestHandler = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const sessionId = cookies.get('session-id');
        const username = (await db.get(`SELECT name FROM Users INNER JOIN Sessions ON id = ? AND user = name;`, sessionId)).name;
        console.log(username);
        const result = await db.run(`
            DELETE FROM Reasons 
            WHERE Reasons.id = ? 
                AND (
                    added_by = ?
                    OR Reasons.counter IN (
                        SELECT id FROM Counters
                        WHERE user = ?
                    )
                );
            `, body.id, username, username
        );

        if (result.changes === 0) {
            return json({ message: "Reason does not exist." }, { status: 404 });
        }

        return json({ success: true }, { status: 200 });
    } catch (e) {
        return handleNormalServerError(e);
    }
}
