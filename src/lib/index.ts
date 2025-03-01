import { fail, json } from "@sveltejs/kit";
import type { Session } from "./types";
import { sha512 } from "js-sha512";
import * as aesjs from 'aes-js';

export function handleFormActionServerError(e: unknown) {
    console.error(e);
    let errorMessage = e instanceof Error ? e.message : null;
    return fail(500, { message: errorMessage });
}

export function handleNormalServerError(e: unknown) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : null;
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
        expires_by: new Date(expiresBy),
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

export function aesEncryptString512(raw: string, key: string) {
    if (key.length !== 128) throw Error("Literally go fuck yourself.");

    const leftKeyHalf = key.slice(0, 64);
    const rightKeyHalf = key.slice(64);
    const leftBuffer = fromHexString(leftKeyHalf);
    const rightBuffer = fromHexString(rightKeyHalf);

    const rawBytes = aesjs.utils.utf8.toBytes(raw);
    const aesCtrLeft = new aesjs.ModeOfOperation.ctr(leftBuffer!);
    const aesCtrRight = new aesjs.ModeOfOperation.ctr(rightBuffer!);

    const encryptedStepOne = aesCtrLeft.encrypt(rawBytes);
    const encryptedStepTwo = aesCtrRight.encrypt(encryptedStepOne);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedStepTwo);
    return encryptedHex;
}

export function aesDecryptString512(encrypted: string, key: string) {
    if (key.length !== 128) throw Error("Literally go fuck yourself.");

    const leftKeyHalf = key.slice(0, 64);
    const rightKeyHalf = key.slice(64);
    const leftBuffer = fromHexString(leftKeyHalf);
    const rightBuffer = fromHexString(rightKeyHalf);

    const encryptedBytes = aesjs.utils.hex.toBytes(encrypted);
    const aesCtrLeft = new aesjs.ModeOfOperation.ctr(leftBuffer!);
    const aesCtrRight = new aesjs.ModeOfOperation.ctr(rightBuffer!);

    const decryptedStepOne = aesCtrRight.decrypt(encryptedBytes);
    const decryptedStepTwo = aesCtrLeft.decrypt(decryptedStepOne);
    const decryptedString = aesjs.utils.utf8.fromBytes(decryptedStepTwo);
    return decryptedString;
}

export function sendFormActionData(data: Object) {
    return JSON.stringify(data);
}

export function readFormActionData(data: any) {
    console.log(data);
    return JSON.parse(JSON.parse(data.data)[0]);
}
