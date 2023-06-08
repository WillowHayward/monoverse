<script lang="ts">
    import Heading from './Heading.svelte';
    export let title: string;
    export let primary: string;
    let id = title?.toLowerCase();
    const bg = primary ? 'bg-primary-100' : 'bg-secondary-50';
</script>
<div id={id} class="flex w-full min-h-screen {bg} inline-block border-b-4 border-black text-center">
    <div class="w-full my-auto p-4">
        {#if title}
            <Heading>{title}</Heading>
        {/if}
        <slot></slot>
    </div>
</div>
