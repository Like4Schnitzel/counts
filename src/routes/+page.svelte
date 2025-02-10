<script lang="ts">
    import { aesDecryptString512, aesEncryptString512 } from "$lib";

    async function get() {
        const response = await fetch('./api', {
            method: 'GET',
            credentials: "include"
        })
        const data = await response.json();
        const encryptionKey = localStorage.getItem("data-encryption-key");
        for (const counter of data.counters) {
            const encryptedLabel = counter.label;
            const decryptedLabel = aesDecryptString512(encryptedLabel, encryptionKey!);
            console.log(decryptedLabel);
        }
    }

    async function addCounter(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        const form = new FormData(event.currentTarget);
        const label: string = form.get("label") as string;
        const encryptionKey = localStorage.getItem("data-encryption-key");
        const encryptedLabelHex = aesEncryptString512(label, encryptionKey!);

        const response = await fetch('./api', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                label: encryptedLabelHex
            })
        });
        console.log(await response.json());
    }
</script>

<button on:click={get}>GET</button>
<form on:submit={addCounter}>
    <label>
        Name:
        <input type="text" name="label" placeholder="default" />
    </label>
    <button type="submit">ADD COUNTER</button>
</form>
