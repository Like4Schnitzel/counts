import { error, json, type RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import { sha512 } from 'js-sha512';
import type { LogInBody } from "$lib/types";
import { handleServerError } from "$lib";

const db = await openDb();

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body: LogInBody = await request.json();
        if (!body.username || !body.password || body.username.length < 1 || body.password.length < 1) {
            return json({ message: "Username and password may not be empty." }, { status: 400 });
        }

        if (body.username !== body.username.trim()) {
            return json({ message: "There may not be trailing or leading whitespace." }, { status: 400 });
        }

        if (await db.get(`SELECT name FROM Users WHERE name = ?`, body.username)) {
            return json({ message: "Username already exists." }, { status: 400 });
        }

        await db.run(`
            INSERT INTO Users (name, password) VALUES (?, ?)
        `, body.username, sha512(body.password));
        return json({ user: body }, { status: 200 });
    } catch (e) {
        return handleServerError(e);
    }
};
