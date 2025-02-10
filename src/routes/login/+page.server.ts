import { generateSession, handleServerError } from "$lib";
import { openDb } from "$lib/db";
import type { LogInBody, Session } from "$lib/types";
import { fail } from "@sveltejs/kit";
import { sha512 } from "js-sha512";

const db = await openDb();

export const actions = {
    signup: async ({ cookies, request }) => {
        try {
            const body: LogInBody = await request.json();
            if (!body.username || !body.password || body.username.length < 1 || body.password.length < 1) {
                return fail(400, { message: "Username and password may not be empty." });
            }
    
            if (body.username !== body.username.trim()) {
                return fail(400, { message: "There may not be trailing or leading whitespace." });
            }
    
            if (await db.get(`SELECT name FROM Users WHERE name = ?`, body.username)) {
                return fail(400, { message: "Username already exists." });
            }
    
            await db.run(`
                INSERT INTO Users (name, password) VALUES (?, ?)
            `, body.username, sha512(body.password));
            return { user: body };
        } catch (e) {
            return handleServerError(e);
        }
    },
    login: async ({cookies, request}) => {
        try {
            const body: LogInBody = await request.json();
            if (!body.username || !body.password || body.username.length < 1 || body.password.length < 1) {
                return fail(400, { message: "Username and password may not be empty." });
            }
    
            body.username = body.username.trim();
    
            const hashedPw = sha512(body.password);
    
            const user = await db.get(`SELECT * FROM Users WHERE name = ? AND password = ?`, body.username, hashedPw);
            if (!user) {
                return fail(403, { message: "Incorrect username or password." });
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
    
            return { session };
        } catch (e) {
            return handleServerError(e);
        }
    }
}
