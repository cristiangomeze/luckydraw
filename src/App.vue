<template>
  <div id="app" class="w-full h-screen overflow-x-hidden flex flex-col">
    <div class="flex-1 h-full flex">
      <div class="flex h-full flex-1 flex-row w-full">
        <main-menu/>
        <router-view/>
      </div>
    </div>
    <!-- Modal Portal -->
    <portal-target name="modal" multiple>
    </portal-target>
  </div>
</template>

<script>
import MainMenu from './components/MainMenu'

export default {
  components: {
    MainMenu
  },
}
</script>