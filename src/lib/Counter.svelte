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

    async function expandReasons() {
        expanded = !expanded;
        expandButtonText = expanded ? "Hide Reasons" : "Show Reasons";
    }

    let expanded = false;
    let expandButtonText = "Show Reasons";

    let countComponents: {
        [key: string]: number;
    } = {};
    for (const reason of data.reasons) {
        if (!countComponents.hasOwnProperty(reason.unit)) {
            countComponents[reason.unit] = 0;
        }
        countComponents[reason.unit] += reason.weight;
    }
    let units = Object.keys(countComponents).sort();
    units.splice(0, 1);
    units.push("");
    let countNumberString = units.reduce((a, b) => a + countComponents[b] + " " + b + " + ", "").slice(0, -2);
</script>

<div class="main">
    <div class="header-wrapper">
        <h1>
            {data.label}{#if data.reasons.length > 0}: <span>{countNumberString}</span>{/if}
        </h1>
        {#if data.reasons.length > 1}
            <div class="expand-button">
                <button on:click={expandReasons}>{expandButtonText}</button>
            </div>
        {/if}
    </div>
    {#if data.reasons.length > 0}
        <div class="reasons">
            {#each data.reasons as reason, i}
                {#if expanded || i === 0}
                    <Reason data={reason} />
                {:else if i === 1}
                    <span>...</span>
                {/if}
            {/each}
        </div>
    {/if}
    <div class="inputs">
        <form on:submit={addReason}>
            <input required type="number" placeholder="Weight" name="weight" value=1 />
            <input type="text" placeholder="Unit" name="unit" />
            <input type="text" placeholder="Reason" name="reason" />
            <input type="text" placeholder="Culprit" name="culprit" />
            <button type="submit">Add</button>
        </form>
        <div class="visibility-delete-wrapper">
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
    </div>
</div>

<style>
    :root {
        --reason-header-font-weight: 500;
    }
    
    .main {
        background-color: var(--color-background-layer-1);
        width: 60rem;
        max-width: 100%;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .header-wrapper button {
        font-size: 2rem;
        font-weight: var(--reason-header-font-weight);
        text-decoration: underline;
    }

    h1 {
        margin: 0;
        font-size: 2rem;
        margin-bottom: 0.5rem;
        font-weight: var(--reason-header-font-weight);
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
        flex-direction: column;
        gap: 0.3rem;
        margin-bottom: 0.3rem;
    }

    .reasons span {
        background-color: var(--color-background-layer-2);
        border-radius: var(--border-radius);
        text-align: center;
    }

    .inputs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .visibility-delete-wrapper {
        display: flex;
        flex-direction: row-reverse;
        justify-content: start;
        gap: 0.5rem;
    }
</style>
