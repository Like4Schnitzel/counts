<script lang="ts">
    import { fromHexString } from "$lib";
    import * as aesjs from "aes-js";

    async function get() {
        const response = await fetch('./api', {
            method: 'GET',
            credentials: "include"
        })
        console.log(await response.json());
    }

    async function addCounter(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        const form = new FormData(event.currentTarget);
        const label: string = form.get("label") as string;
        const encryptionKey = localStorage.getItem("data-encryption-key");
        const leftKeyHalf = encryptionKey!.slice(0, 64);
        const rightKeyHalf = encryptionKey!.slice(64);
        const leftBuffer = fromHexString(leftKeyHalf);
        const rightBuffer = fromHexString(rightKeyHalf);

        const labelBytes = aesjs.utils.utf8.toBytes(label);
        const aesCtrLeft = new aesjs.ModeOfOperation.ctr(leftBuffer!);
        const aesCtrRight = new aesjs.ModeOfOperation.ctr(rightBuffer!);

        const encryptedLabelStepOne = aesCtrLeft.encrypt(labelBytes);
        const encryptedLabelStepTwo = aesCtrRight.encrypt(encryptedLabelStepOne);
        const encryptedLabelHex = aesjs.utils.hex.fromBytes(encryptedLabelStepTwo);

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
