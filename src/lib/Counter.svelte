<script lang="ts">
    import { aesEncryptString512 } from "$lib";
    import Reason from "./Reason.svelte";
    import type { Counter } from "./types";

    export let data: Counter;

    // TODO add transaction id or some shit so ws updates dont update the thing that was just locally changed
    async function addReason(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        event.preventDefault();
        const encryptionKey = localStorage.getItem("data-encryption-key")!;

        const form = new FormData(event.currentTarget);
        const weight = form.get("weight");
        const unit = aesEncryptString512(form.get("unit") as string, encryptionKey);
        const reason = aesEncryptString512(form.get("reason") as string, encryptionKey);
        const culprit = aesEncryptString512(form.get("culprit") as string, encryptionKey);

        const response = await fetch('/?/addReason', {
            method: 'POST',
            body: JSON.stringify({
                weight,
                unit,
                reason,
                culprit,
                counter: data.id
            })
        });
        console.log(await response.json());
    }

    async function deleteCounter(id: number) {
        const response = await fetch('./api/counters', {
            method: 'DELETE',
            credentials: "include",
            body: JSON.stringify({
                id
            })
        });
        console.log(await response.json());
    }

    let countComponents: {
        [key: string]: number;
    } = {};
    for (const reason of data.reasons) {
        if (!countComponents.hasOwnProperty(reason.unit)) {
            countComponents[reason.unit] = 0;
        }
        countComponents[reason.unit]++;
    }
    let units = Object.keys(countComponents).sort();
    units.splice(0, 1);
    units.push("");
    let countNumberString = units.reduce((a, b) => {
        return a + countComponents[b] + " " + b + " + ";
    }, "").slice(0, -2);
</script>

<div class="main">
    <h1>
        {data.label}{#if data.reasons.length > 0}: <span>{countNumberString}</span>{/if}
    </h1>
    <div class="reasons">
    {#each data.reasons as reason}
        <Reason data={reason} />
    {/each}
    </div>
    <form on:submit={addReason}>
        <input required type="number" placeholder="Weight" name="weight" value=1 />
        <input type="text" placeholder="Unit" name="unit" />
        <input type="text" placeholder="Reason" name="reason" />
        <input type="text" placeholder="Culprit" name="culprit" />
        <button type="submit">Add</button>
    </form>
    <div>
        <select bind:value={data.visibility}>
            <option value="PRIVATE">PRIVATE</option>
            <option value="PROTECTED">PROTECTED</option>
            <option value="PUBLIC">PUBLIC</option>
        </select>
    </div>
    <button on:click={() => {deleteCounter(data.id)}}>
        Delete Counter
    </button>
</div>

<style>
    .main {
        background-color: var(--color-background-layer-1);
        width: 60rem;
        max-width: 100%;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        box-sizing: border-box;
    }

    h1 {
        margin: 0;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    h1 span {
        background-color: var(--color-background-layer-2);
        border-radius: var(--border-radius);
    }

    form {
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        gap: 0.5rem;
        justify-content: space-evenly;
    }

    form * {
        flex-grow: 1;
    }

    input,
    select,
    button {
        background-color: var(--color-background-layer-2);
        border: none;
        border-radius: var(--border-radius);
        color: var(--color-text);
        font-weight: var(--default-font-weight);
        outline: none;
    }

    select:hover,
    button:hover {
        background-color: var(--color-background-layer-2-hover);
    }

    input:hover,
    input:focus,
    select:active,
    button:active {
        background-color: var(--color-background-layer-2-active);
    }

    .reasons {
        display: flex;
        flex-direction: column-reverse;
        gap: 0.3rem;
        margin-bottom: 0.3rem;
    }
</style>
