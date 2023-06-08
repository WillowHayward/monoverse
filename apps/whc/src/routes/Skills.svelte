<script lang="ts">
    import { skills } from '$lib/assets/info.json';
    import Section from '$lib/components/Section.svelte';
    import Subheading from '$lib/components/Subheading.svelte';
</script>
<Section title="Skills">
        {#each Object.entries(skills) as [section, skillGroup]}
            <div class="flex flex-wrap justify-center gap-2 md:gap-4 mx-auto my-4 w-11/12 md:w-1/3">
                <Subheading>{section}</Subheading>
                {#each skillGroup as skill}
                    <span class="border md:border-2 border-slate-900 rounded-xl bg-primary-200 px-2 py-1 md:text-2xl" >{skill}</span>
                {/each}
            </div>
        {/each}
</Section>
