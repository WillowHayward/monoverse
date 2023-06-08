<script lang="ts">
    import { fade } from 'svelte/transition';
    import "../app.css";
    import { name, social } from '$lib/assets/info.json';
    import Social from '$lib/components/Social.svelte';

    let hidden = true;

    const sections = ['Skills', 'Experience', 'Projects', 'Education'];

    function toggleNav() {
        hidden = !hidden;
    }

    function closeNav() {
        hidden = true;
    }

    function scrollToSection(event: MouseEvent) {
        event.preventDefault();
        const targetElement = <HTMLAnchorElement>event.currentTarget;
        const target = (new URL(targetElement.href)).hash;
        const element = <HTMLElement>document.querySelector(target);
        window.scrollTo({
            top: element.offsetTop,
            behaviour: 'smooth'
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behaviour: 'smooth'
        });
    }
</script>

{#if hidden}
    <button class="md:hidden fixed top-1.5 right-1.5 z-40" on:click={toggleNav}> <!--mobile nav-->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    </button>
{:else}
    <div transition:fade="{{duration:200}}" class="w-screen h-screen fixed flex bg-secondary-50 justify-center z-50">
        <div class="my-auto">
            {#each sections as section}
                <a href="#{section.toLowerCase()}" class="text-4xl text-center block my-3" on:click={closeNav}>{section}</a>
            {/each}
        </div>
        <button class="absolute top-1.5 right-1.5" on:click={toggleNav}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
{/if}
<div class="hidden md:flex absolute w-full top-2"><!--desktop nav-->
    <div class="border-2 border-black rounded-full inline-block mx-auto bg-secondary-200 p-3">
        {#each sections as section}
            <a href="#{section.toLowerCase()}" class="mx-2" on:click={scrollToSection}>{section}</a>
        {/each}
    </div>
</div>

<slot />
<div class="w-full grid grid-cols-1 md:grid-cols-3 text-center bg-secondary-200">
    <div class="my-auto text-lg text-slate-700 font-medium">&copy {name}</div>
    <div class="my-auto">
        <button on:click={scrollToTop}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </div>
    <div class="my-auto">
        {#each Object.entries(social) as [website, link]}
            <a href="{link}"><Social name="{website}"/></a>
        {/each}
    </div>
</div>
