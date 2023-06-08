<script lang="ts">
    import Heading from '$lib/components/Heading.svelte';
    import Card from '$lib/components/Card.svelte';
    import { education } from '$lib/assets/info.json';
</script>

<div id="education" class="flex w-full bg-primary-100 inline-block border-b-4 border-black text-center">
    <div class="w-full my-auto p-4">
        <Heading>Education</Heading>
        {#each education as qualification}
            <div class="w-full md:w-5/12 mx-auto">
                <Card title="{qualification.title}" 
                    subtitle="{qualification.subtitle}">
                    <em class="text-lg">{qualification.institution}</em><br/>
                    <em>{qualification.dates}</em>
                    <ul class="ml-5 list-outside list-disc">
                        {#each qualification.info as item}
                            <li>{item}</li>
                        {/each}
                    </ul>
                </Card>
            </div>
        {/each}
    </div>
</div>
