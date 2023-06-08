<script lang="ts">
    import Subheading from './Subheading.svelte';
    import Subtitle from './Subtitle.svelte';
    export let title: string;
    export let subtitle: string;
    export let primary = false;
    const bg = primary ? 'bg-primary-100' : 'bg-secondary-50';
</script>

<div class="text-left rounded-xl border-4 border-slate-700 {bg} drop-shadow my-2">
    {#if title || subtitle}
        <div class="border-b-2 border-slate-500 p-2">
            {#if title}
                <Subheading>{title}</Subheading>
            {/if}
            {#if subtitle}
                <Subtitle>{subtitle}</Subtitle>
            {/if}
        </div>
    {/if}
    <div class="w-full p-2">
        <slot></slot>
    </div>
</div>
