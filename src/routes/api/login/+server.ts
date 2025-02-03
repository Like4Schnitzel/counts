import { json, type RequestHandler } from "@sveltejs/kit";
import { openDb } from "$lib/db";
import type { LogInBody, Session } from "$lib/types";
import { sha512 } from "js-sha512";
import { generateSession, handleServerError } from "$lib";

const db = await openDb();

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const body: LogInBody = await request.json();
        if (!body.username || !body.password || body.username.length < 1 || body.password.length < 1) {
            return json({ message: "Username and password may not be empty." }, { status: 400 });
        }

        body.username = body.username.trim();

        const hashedPw = sha512(body.password);

        const user = await db.get(`SELECT * FROM Users WHERE name = ? AND password = ?`, body.username, hashedPw);
        if (!user) {
            return json({ message: "Incorrect username or password." }, { status: 403 });
        }

        let session: Session | undefined = await db.get(`SELECT * FROM Sessions WHERE user = ?`, body.username);
        if (session && new Date() > session.expiresBy) {
            await db.run(`DELETE FROM Sessions WHERE id = ?`, session.id);
            session = undefined;
        }
        if (!session) {
            session = generateSession(body.username);
            await db.run(`INSERT INTO Sessions (id, user, expires_by) VALUES (?, ?, ?)`,
                session.id, session.user, session.expiresBy
            );
        }

        cookies.set("session-id", session.id, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            path: '/',
            maxAge: 60*60*24
        });

        return json({ session }, { status: 200 });
    } catch (e) {
        handleServerError(e);
        return json({ body: e }, { status: 500 });
    }
};
