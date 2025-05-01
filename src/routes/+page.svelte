<script lang="ts">
    import { aesDecryptString512, aesEncryptString512 } from "$lib";
    import Counter from "$lib/Counter.svelte";
    import type { Counter as CounterType } from "$lib/types.ts";
    import { onMount } from "svelte";

    async function get() {
        const response = await fetch('./api', {
            method: 'GET',
            credentials: "include"
        })
        counters = [];
        const data = await response.json();
        const encryptionKey = localStorage.getItem("data-encryption-key")!;
        for (const counter of data.counters as CounterType[]) {
            let decryptedLabel;
            if (counter.visibility === "PRIVATE") {
                const encryptedLabel = counter.label;
                decryptedLabel = aesDecryptString512(encryptedLabel, encryptionKey);
            } else {
                decryptedLabel = counter.label;
            }

            for (const reason of counter.reasons) {
                if (reason.unit) reason.unit = aesDecryptString512(reason.unit, encryptionKey);
                if (reason.reason) reason.reason = aesDecryptString512(reason.reason, encryptionKey);
                if (reason.culprit) reason.culprit = aesDecryptString512(reason.culprit, encryptionKey);
                reason.added_at = new Date(reason.added_at);
            }

            // sort reasons by date
            // the server already returns them sorted, just from oldest to newest. We want the opposite.
            counter.reasons.reverse();

            counters.push({
                id: counter.id,
                label: decryptedLabel,
                user: counter.user,
                visibility: counter.visibility,
                reasons: counter.reasons
            });
        }

        counters = counters;
    }

    async function addCounter(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        const form = new FormData(event.currentTarget);
        const label: string = form.get("label") as string;
        const encryptionKey = localStorage.getItem("data-encryption-key");
        const encryptedLabelHex = aesEncryptString512(label, encryptionKey!);

        const response = await fetch('?/addCounter', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                label: encryptedLabelHex
            })
        });
        console.log(await response.json());
    }

    let counters: CounterType[] = [];
    onMount(get);
</script>

<div class="main">
    <form on:submit={addCounter}>
        <label>
            Name:
            <input type="text" name="label" placeholder="default" />
        </label>
        <button type="submit">ADD COUNTER</button>
    </form>
    <div class="counters">
        {#each counters as counter}
            <Counter data={counter} />
        {/each}
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

    .main {
        width: fit-content;
        margin: 0 auto;
        max-width: 100vw;
        padding: 1rem 0;
    }

    .counters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: calc(100% - 2rem);
        margin: 0 1rem;
    }

    form {
        margin: 0 auto;
        margin-bottom: 1rem;
        width: fit-content;
    }

    input,
    button {
        background-color: var(--color-background-layer-1);
        border: none;
        border-radius: var(--border-radius);
        color: var(--color-text);
        font-size: var(--default-font-size);
        font-weight: var(--default-font-weight);
        outline: none;
    }

    label {
        font-size: var(--default-font-size);
        font-weight: var(--default-font-weight);
    }

    button:hover,
    button:focus-visible {
        background-color: var(--color-background-layer-1-hover);
    }

    input:hover,
    input:focus,
    button:active {
        background-color: var(--color-background-layer-1-active);
    }
</style>
