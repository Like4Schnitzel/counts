<script lang="ts">
    const { children } = $props();
</script>

{@render children()}

<style>
    :global(:root) {
        --color-background-layer-0: hsl(260, 57%, 64%);
        --color-background-layer-1: hsl(260, 57%, 68%);
        --color-background-layer-1-hover: hsl(260, 57%, 75%);
        --color-background-layer-1-active: hsl(260, 57%, 70%);
        --color-background-layer-2: hsl(260, 57%, 73%);
        --color-background-layer-2-hover: hsl(260, 57%, 80%);
        --color-background-layer-2-active: hsl(260, 57%, 75%);
        --color-background-layer-3: hsl(260, 57%, 77%);
        --color-background-layer-3-hover: hsl(260, 57%, 84%);
        --color-background-layer-3-active: hsl(260, 57%, 79%);
        --color-text: ghostwhite;
        --color-input-border: darkgray;
        --font-family: "Poppins", sans-serif;
        --border-radius: 5px;
        --default-font-size: 1rem;
        --default-font-weight: 450;
    }
    
    :global(body) {
        background-color: var(--color-background-layer-0);
        color: var(--color-text);
        font-family: var(--font-family);
        margin: 0;
    }
</style>