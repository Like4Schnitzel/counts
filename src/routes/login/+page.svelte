<script lang="ts">
    import { goto } from "$app/navigation";
    import { prefixAndHash } from "$lib";
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

            const response = await fetch('../api/login', {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password: sha512(password)
                })
            });
            const body = await response.json();
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

            const response = await fetch('../api/signup', {
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

<div>
    <p>Log In: </p>
    <form on:submit={() => tryLogin(usernameLogIn, passwordLogIn)}>
        <input type="text" name="username" bind:value={usernameLogIn} />
        <input type="password" name="password" bind:value={passwordLogIn} />
        <button type="submit">Submit</button>
    </form>
</div>

<div>
    <p>Sign Up: </p>
    <form on:submit={() => signUp(usernameSignUp, passwordSignUp)}>
        <input type="text" name="username-sign-up" bind:value={usernameSignUp} />
        <input type="password" name="password-sign-up" bind:value={passwordSignUp} />
        <button type="submit">Submit</button>
    </form>
</div>

<p>{signUpError}<br/>{logInError}</p>
