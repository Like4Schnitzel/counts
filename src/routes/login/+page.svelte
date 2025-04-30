<script lang="ts">
    import { goto } from "$app/navigation";
    import { prefixAndHash, readFormActionData } from "$lib";
    import { sha512 } from "js-sha512";

    let usernameLogIn: string;
    let passwordLogIn: string;
    let logInError: string;
    let usernameSignUp: string;
    let passwordSignUp: string;
    let signUpError: string;

    async function tryLogin(username: string, password: string) {
        try {
            if (password.length === 0) {
                logInError = "Password may not be empty.";
                return;
            }

            const response = await fetch('?/login', {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password: sha512(password)
                })
            });
            const body = readFormActionData(await response.json());
            console.log(response.status, body);
            if (response.status === 200) {
                logInError = "";
                localStorage.setItem("data-encryption-key", prefixAndHash(password));
                goto("../");
            } else {
                logInError = `${response.status}: ${body.message}`;
            }
        } catch (e) {
            if (e instanceof Error) {
                logInError = e.toString();
            }
            console.error(e);
        }
    }

    async function signUp(username: string, password: string) {
        try {
            if (password.length === 0) {
                signUpError = "Password may not be empty.";
                return;
            }

            const response = await fetch('?/signup', {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password: sha512(password)
                })
            });

            const body = await response.json();
            if (response.status === 200) {
                signUpError = "";
                tryLogin(username, password);
            } else {
                signUpError = `${response.status}: ${body.message}`;
            }
        } catch (e) {
            if (e instanceof Error) {
                signUpError = e.toString();
            }
            console.error(e);
        }
    }
</script>

<div class="main">
    <div>
        <p>Log In: </p>
        <form on:submit={() => tryLogin(usernameLogIn, passwordLogIn)}>
            <input placeholder="username" type="text" name="username" bind:value={usernameLogIn} />
            <input placeholder="password" type="password" name="password" bind:value={passwordLogIn} />
            <button type="submit">Submit</button>
        </form>
    </div>

    <div>
        <p>Sign Up: </p>
        <form on:submit={() => signUp(usernameSignUp, passwordSignUp)}>
            <input placeholder="username" type="text" name="username-sign-up" bind:value={usernameSignUp} />
            <input placeholder="password" type="password" name="password-sign-up" bind:value={passwordSignUp} />
            <button type="submit">Submit</button>
        </form>
    </div>
    <p>{signUpError}</p>
    <p>{logInError}</p>
</div>


<style>
    :global(body) {
        height: 100vh;
    }
    
    p {
        font-weight: var(--default-font-weight);
        font-size: calc(var(--default-font-size) * 1.25);
        margin: 0;
        margin-bottom: 0.5rem;
    }
    
    .main {
        display: flex;
        flex-direction: column;
        width: fit-content;
        margin: 0 auto;
        padding-top: 2rem;
        height: 100%;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }

    .main div {
        background-color: var(--color-background-layer-1);
        width: fit-content;
        padding: 1rem;
        border-radius: var(--border-radius);
    }

    button,
    input {
        background-color: var(--color-background-layer-2);
        border: none;
        border-radius: var(--border-radius);
        color: var(--color-text);
        font-size: var(--default-font-size);
        font-weight: var(--default-font-weight);
        margin-bottom: 0.5rem;
    }

    button:hover {
        background-color: var(--color-background-layer-2-hover);
    }

    button:active {
        background-color: var(--color-background-layer-2-active);
    }
</style>
