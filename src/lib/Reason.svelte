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

    let sign = data.weight < 0 ? "-" : "+";
</script>

<div class="main">
    <span>
        {sign}{data.weight}
    </span>
    <span>{data.unit}</span>
    <span>{data.reason}</span>
    <span>{data.culprit}</span>
    <span>{data.added_at}</span>
    <button on:click={() => deleteReason(data.id)}>Delete</button>
</div>

<style>
</style>
