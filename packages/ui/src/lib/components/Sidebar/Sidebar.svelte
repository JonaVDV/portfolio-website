<script lang="ts">
	let { children } = $props();
</script>

<aside>
    {#snippet header()}
        
    {/snippet}
	<nav>
		<ul>
            <li>
                <a href="#">Home</a>
            </li>
            <li>
                <a href="#">About</a>
            </li>
            <li>
                <a href="#">Contact</a>
            </li>
			{@render children?.()}
		</ul>
	</nav>
    {#snippet footer()}
        
    {/snippet}
</aside>

<style lang="scss">
    @use '../../styles/abstracts' as *;
    aside {
        display: grid;
        background-color: $clr-surface-000;
        width: fit-content;
        min-height: 100svb;
    }
</style>
