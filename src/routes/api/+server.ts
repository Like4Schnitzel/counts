import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import { handleServerError } from "$lib";

const db = await openDb();

export const GET: RequestHandler = async ({ request }) => {
    try {
        const users: string[][] = [];
        await db.each("SELECT * FROM users;", (err, row) => {
            if (err) console.error(err);
            users.push(row);
        });
        return json({ users: users }, { status: 200 });
    } catch (e: unknown) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : null;
        return json({ message: errorMessage }, { status: 500 });
    }
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        return json({ status: 200 });
    } catch (e) {
        return handleServerError(e);
    }
};
