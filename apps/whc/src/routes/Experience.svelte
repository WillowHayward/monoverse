<script lang="ts">
    import { experience } from '$lib/assets/info.json';
    import Card from '$lib/components/Card.svelte';
    import Section from '$lib/components/Section.svelte';
</script>
<style>
</style>
<Section title="Experience" primary>
    <div class="w-11/2 md:w-5/12 mx-auto my-2 text-center">
        {#each experience as position}
            <div class="md:w-8/12 md:odd:float-right md:even:float-left md:clear-both">
                <Card title="{position.title}" subtitle="{position.organisation}">
                    <em class="text-slate-500">{position.dates}</em>
                    {#if position.description}
                        <p>{position.description}</p>
                    {/if}
                    <ul class="ml-5 text-left list-outside list-disc">
                        {#each position.responsibilities as responsibility}
                            <li>{responsibility}</li>
                        {/each}
                    </ul>
                </Card>
            </div>
        {/each}
    </div>
</Section>
