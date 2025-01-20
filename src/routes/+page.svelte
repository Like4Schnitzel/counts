<script>
    async function get() {
        const response = await fetch('./api', {
            method: 'GET'
        })
        console.log(await response.json());
    }
    
    async function post() {
        const response = await fetch('./api', {
            method: 'POST'
        });
        console.log(await response.json());
    }
</script>

<button on:click={get}>GET</button>
<button on:click={post}>POST</button>
