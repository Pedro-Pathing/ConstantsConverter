<script>
  import ConstantsInput from './lib/components/ConstantsInput.svelte'
  import ConstantsOutput from './lib/components/ConstantsOutput.svelte'
  import { ConversionError, convert } from './lib/converter/converter.ts'
  import anvilSound from '/anvil.mp3'
  import prettier from 'prettier'
  import prettierJava from 'prettier-plugin-java'

  let fConstants = $state('// Enter FConstants here.')
  let lConstants = $state('// Enter LConstants here.')
  let constants = $state('// Constants will go here.')

  const sound = new Audio(anvilSound)
  sound.preload = 'auto'
  sound.load()

  function convertConstants () {
    const conversionResult = convert(fConstants, lConstants)
    if (conversionResult instanceof ConversionError) {
      alert(conversionResult.message)
      return
    }
    constants = conversionResult
    sound.play()
  }

  async function copyConstants () {
    const formatted = await prettier.format(constants, {
        parser: 'java',
        plugins: [prettierJava],
        tabWidth: 2,
        useTabs: false,
      },
    )
    await navigator.clipboard.writeText(formatted)
    copied = true
    setTimeout(() => copied = false, 2000)
  }

  let copied = $state(false)
</script>

<div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] h-screen p-8 gap-8">
    <ConstantsInput bind:fConstants bind:lConstants/>
    <div class="flex flex-col my-auto gap-4">
        <a href="https://github.com/Pedro-Pathing/ConstantsConverter" target="_blank"
           class="btn btn-square size-20 my-auto btn-accent flex-col p-2">
            <svg fill="currentColor" class="size-18 block" role="img" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg"><title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
        </a>
        <button onclick={convertConstants}
                class="btn btn-square size-20 my-auto btn-accent flex-col p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                 stroke="currentColor"
                 class="size-18 block">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
            Convert
        </button>
        <button onclick={copyConstants}
                class="btn btn-square size-20 my-auto btn-accent flex-col p-2">
            {#if copied}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-18 block">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"/>
                </svg>
                Copied
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-18 block">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
                Copy
            {/if}
        </button>
    </div>
    <ConstantsOutput {constants}/>
</div>