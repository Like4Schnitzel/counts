<script lang="ts">
    import Reason from "./Reason.svelte";
    import type { Counter } from "./types";

    export let data: Counter;

    // TODO add transaction id or some shit so ws updates dont update the thing that was just locally changed
    async function addReason(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const weight = form.get("weight");
        const unit = form.get("unit");
        const reason = form.get("reason");
        const culprit = form.get("culprit");

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

    // TODO calculate the actual fucking count fucking dogshit im sick of this project i hate everyone kill yourself if youre reading this
</script>

<div>
    <h1>{data.label}</h1>
    {#each data.reasons as reason}
        <Reason data={reason} />
    {/each}
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
</div>
