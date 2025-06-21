<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        name: string;
        children: Snippet;
        checked?: boolean;
        group: string;
    }

    let {name, children, checked, group}: Props = $props();
</script>

<input {checked} type="radio" name={group} class="tab checked:bg-base-200! font-mono text-lg"
       aria-label={name}/>
<div class="tab-content border-base-300 bg-base-200 p-5">{@render children()}</div>