import { error, json, type RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import { sha256 } from 'js-sha256';
import type { LogInBody } from "$lib/types";
import { handleServerError } from "$lib";

const db = await openDb();

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body: LogInBody = await request.json();
        if (!body.username || !body.password || body.username.length < 1 || body.password.length < 1) {
            return json({ message: "Username and password may not be empty." }, { status: 400 });
        }

        if (body.username !== body.username.trim() || body.password !== body.password.trim()) {
            return json({ message: "There may not be trailing or leading whitespace." }, { status: 400 });
        }

        if (await db.get(`SELECT name FROM Users WHERE name = ?`, body.username)) {
            return json({ message: "Username already exists." }, { status: 400 });
        }

        db.run(`
            INSERT INTO Users (name, password) VALUES (?, ?)
        `, body.username, sha256(body.password));
        return json({ user: body }, { status: 200 });
    } catch (e) {
        return handleServerError(e);
    }
};
