<script lang="ts">
    import Tab from './Tab.svelte'
    import hljs from 'highlight.js/lib/core'
    import java from 'highlight.js/lib/languages/java'
    import prettier from 'prettier'
    import prettierJava from 'prettier-plugin-java'

    hljs.registerLanguage('java', java)

    interface Props {
        constants: string;
    }

    let {constants}: Props = $props();
    let highlightedCode = $state("")

    $effect(() => {
        constants;
        (async () => {
            highlightedCode = hljs.highlight(
                await prettier.format(constants, {
                        parser: "java",
                        plugins: [prettierJava],
                        tabWidth: 2,
                        useTabs: false
                    }
                ),
                {language: "java"}
            ).value
        })()
    })
</script>

<div class="tabs tabs-lift">
    <Tab group="constants-output" name="Constants.java" checked>
        <pre class="overflow-auto max-h-full max-w-full"><code
                class="bg-base-200 max-w-full">{@html highlightedCode}</code></pre>
    </Tab>
</div>