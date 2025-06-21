<script>
  import ConstantsInput from './lib/ConstantsInput.svelte'
  import ConstantsOutput from './lib/ConstantsOutput.svelte'
  import { ConversionError, convert } from './lib/converter.js'

  let fConstants = $state('// Enter FConstants here.')
  let lConstants = $state('// Enter LConstants here.')
  let constants = $state('// Constants will go here.')

  const sound = new Audio('/anvil.mp3')
  sound.preload = 'auto'
  sound.load()

  function convertConstants () {
    try {
      constants = convert(fConstants, lConstants)
      sound.play()
    } catch (error) {
      if (error instanceof ConversionError) {
        alert(error.message)
      } else throw error
    }
  }
</script>

<div class="grid grid-cols-[1fr_auto_1fr] h-screen p-8 gap-8">
    <ConstantsInput bind:fConstants bind:lConstants/>
    <button onclick={convertConstants}
            class="btn btn-square size-20 my-auto btn-accent flex-col p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
             class="size-18 block">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
        </svg>
        Convert
    </button>
    <ConstantsOutput {constants}/>
</div>