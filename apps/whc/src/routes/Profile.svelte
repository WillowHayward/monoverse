<script lang="ts">
    import profile from '$lib/assets/profile.png';
    import Section from '$lib/components/Section.svelte';
    import { name, title } from '$lib/assets/info.json';

    function scrollToSkills() {
        const skills = <HTMLElement>document.querySelector('skills');
        window.scrollTo({
            top: skills.offsetHeight,
            behaviour: 'smooth'
        });
    }
</script>
<Section primary>
    <div class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2">
            <img alt="profile" class="border-8 border-slate-900 rounded-full m-5 mx-auto mt-auto md:my-auto  md:float-right md:mr-5" src={profile} />
            <div class="flex">
                <span class="mb-auto md:my-auto w-full">
                    <h1 class="mb-3 text-5xl md:text-8xl text-slate-800 text-center md:text-left">{name}</h1>
                    <h2 class="mb-3 text-3xl md:text-6xl text-slate-700 text-center md:text-left">{title}</h2>
                    <div class="w-full text-center md:text-left">
                        <a href="#" class="border-4 border-slate-900 rounded-full inline-block p-3 bg-secondary-200 text-xl">Download Resume</a>
                    </div>
                </span>
            </div>
        </div>
    </div>
    <button class="absolute flex w-full bottom-2" on:click={scrollToSkills}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto cursor-pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </button>
</Section>
