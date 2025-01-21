import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const sessionID = cookies.get('visited');

    if (!sessionID) redirect(307, './login');

    return {
        sessionID
    };
}
