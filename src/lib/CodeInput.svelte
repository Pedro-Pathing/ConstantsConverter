<script lang="ts">
    import {CodeJar} from "@novacbn/svelte-codejar";
    import hljs from "highlight.js/lib/core";
    import java from "highlight.js/lib/languages/java";
    import {onMount} from "svelte";

    interface Props {
        code: string;
    }

    let {code = $bindable()} = $props();

    hljs.registerLanguage("java", java);

    const highlight = (code: string, syntax?: string) =>
        hljs.highlight(code, {
            language: syntax!
        }).value;

    onMount(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            import("highlight.js/styles/atom-one-dark.min.css");
        } else {
            import("highlight.js/styles/atom-one-light.min.css");
        }
    });
</script>

<CodeJar class="h-full" tab="  " syntax="java" {highlight} bind:value={code}/>
