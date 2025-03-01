<script lang="ts">
    import type { Reason } from "./types";

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
</div>

<style>
</style>
