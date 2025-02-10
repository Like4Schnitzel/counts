import { json } from "@sveltejs/kit";
import type { Session } from "./types";
import { sha512 } from "js-sha512";

export function handleServerError(e: unknown) {
    console.error(e);
    let errorMessage = e instanceof Error ? e.message : null;
    return json({ message: errorMessage }, { status: 500 });
}

export function generateSession(user: string): Session {
    const oneDayInMiliseconds = 86400 * 1000;
    const now = Date.now();
    const expiresBy = now + oneDayInMiliseconds;
    const id = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        now.toString(36);
    
    return {
        expiresBy: new Date(expiresBy),
        id,
        user
    }
}

export function prefixAndHash(pw: string) {
    return sha512(`transrights<3_${pw}`);
}

export function fromHexString(hexString: string): Uint8Array | null {
    const match = hexString.match(/.{1,2}/g);
    if (!match) return null;
    return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
}
