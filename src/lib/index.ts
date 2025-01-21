import { json } from "@sveltejs/kit";

export function handleServerError(e: unknown) {
    console.error(e);
    let errorMessage = e instanceof Error ? e.message : null;
    return json({ message: errorMessage }, { status: 500 });
}
