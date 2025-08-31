<script lang="ts">
  import Tab from './Tab.svelte'
  import CodeInput from './CodeInput.svelte'

  interface Props {
    fConstants: string;
    lConstants: string;
  }

  let {fConstants = $bindable(), lConstants = $bindable()} = $props();
</script>

<div class="tabs tabs-lift overflow-x-auto">
    <Tab group="constants-input" name="FConstants.java" checked>
        <CodeInput bind:code={fConstants}/>
    </Tab>

    <Tab group="constants-input" name="LConstants.java">
        <CodeInput bind:code={lConstants}/>
    </Tab>
</div>