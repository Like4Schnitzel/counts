<script lang="ts">
    let usernameLogIn: string;
    let passwordLogIn: string;
    let usernameSignUp: string;
    let passwordSignUp: string;

    async function tryLogin() {

    }

    async function signUp() {
        const response = await fetch('../api/signup', {
            method: "POST",
            body: JSON.stringify({
                username: usernameSignUp,
                password: passwordSignUp
            })
        });
        console.log(await response.json());
    }
</script>

<div>
    <p>Log In: </p>
    <form>
        <input type="text" name="username" bind:value={usernameLogIn} />
        <input type="text" name="password" bind:value={passwordLogIn} />
        <button type="button" on:click="{tryLogin}">Submit</button>
    </form>
</div>

<div>
    <p>Sign Up: </p>
    <form>
        <input type="text" name="username-sign-up" bind:value={usernameSignUp} />
        <input type="password" name="password-sign-up" bind:value={passwordSignUp} />
        <button type="button" on:click="{signUp}">Submit</button>
    </form>
</div>
