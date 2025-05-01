<script lang="ts">
    import type { Reason } from "./types";

    async function deleteReason(id: number) {
        const response = await fetch('./api/reasons', {
            method: 'DELETE',
            credentials: "include",
            body: JSON.stringify({
                id
            })
        });
        console.log(await response.json());
    }

    export let data: Reason;
    console.log(data);

    let sign = data.weight < 0 ? "-" : "+";
</script>

<div class="main">
    <div class="info">
        <span class="weight">
            {sign}{Math.abs(data.weight)}
        </span>
        {#if data.unit}<span class="unit">{data.unit}</span>{/if}
        <span class="colon">:</span>
        {#if data.reason}<span class="reason">{data.reason}</span>{/if}
        {#if data.culprit}<span class="culprit">{data.culprit}</span>{/if}
        <span class="date">{data.added_at.toLocaleString()}</span>
    </div>
    <div class="delete-button">
        <button on:click={() => deleteReason(data.id)}>Delete</button>
    </div>
</div>

<style>
    .main {
        background-color: var(--color-background-layer-2);
        border-radius: var(--border-radius);
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        gap: 1rem;
    }

    .info {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        gap: 0.25rem;
    }

    .info span {
        background-color: var(--color-background-layer-3);
        border-radius: var(--border-radius);
        padding: 0 0.25rem;
        height: fit-content;
        align-self: center;
    }

    .weight {
        min-width: 1.5rem;
        text-align: center;
    }

    .reason {
        flex-grow: 1;
        word-break: normal;
        overflow-wrap: anywhere;
    }

    .colon {
        background: none !important;
    }

    .date {
        text-align: right;
        width: fit-content;
        white-space: nowrap;
    }

    .delete-button {
        display: flex;
        align-items: center;
    }

    button {
        background-color: var(--color-background-layer-3);
        border-radius: var(--border-radius);
        border: none;
        cursor: pointer;
        margin-right: 0.1rem;
        color: var(--color-text);
        cursor: default;
        outline: none;
    }

    button:hover,
    button:focus-visible {
        background-color: var(--color-background-layer-3-hover);
    }

    button:active {
        background-color: var(--color-background-layer-3-active);
    }
</style>
