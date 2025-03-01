<script lang="ts">
    import { aesDecryptString512, aesEncryptString512 } from "$lib";
    import Counter from "$lib/Counter.svelte";
    import type { Counter as CounterType } from "$lib/types.ts";

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
            }

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
</script>

<button on:click={get}>GET</button>
<form on:submit={addCounter}>
    <label>
        Name:
        <input type="text" name="label" placeholder="default" />
    </label>
    <button type="submit">ADD COUNTER</button>
</form>
{#each counters as counter}
    <Counter data={counter} />
{/each}
