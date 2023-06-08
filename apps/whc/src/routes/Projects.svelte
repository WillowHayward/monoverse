<script lang="ts">
    import Section from '$lib/components/Section.svelte';
    import Subheading from '$lib/components/Subheading.svelte';
    import Subtitle from '$lib/components/Subtitle.svelte';
    import { projects } from '$lib/assets/info.json';
</script>

<Section title="Projects">
    <div class="w-11/2 md:w-9/12 my-2 mx-auto text-center grid grid-cols-1 md:grid-cols-2 md:gap-3">
        {#each projects as project}
            <div class="text-left w-full rounded-xl border-4 border-slate-700 bg-primary-100 drop-shadow my-2">
                <img src="img/projects/{project.image}" alt="{project.name}" 
                    class="hidden md:md:float-left md:w-1/3 md:inline"/>
                <div class="md:float-right w-full md:w-2/3 pt-1 md:pt-2 text-center">
                    <Subheading>{project.name}</Subheading>
                    <Subtitle>{project.dates}</Subtitle>
                    <div class="m-1 md:m-2">
                        {project.description}
                        {#if project.links}
                            <ul class="mt-3">
                                {#each Object.entries(project.links) as [linkText, link]}
                                    <li>
                                        <a href="{link}" class="text-secondary-900 underline">{linkText}</a>
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</Section>
