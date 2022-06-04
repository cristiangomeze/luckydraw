<template>
    <div class="pb-4">
        <div class="flex justify-between">
            <div class="flex items-center space-x-4">
                <h2 class="text-gray-800 font-bold text-xl">Concursantes ({{ new Intl.NumberFormat('en-US').format(totalContestants.length) }})</h2>
                <button type="button" @click="contestantsFileSave()"  class="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                </button>
            </div>
            <h2 class="text-gray-400 text-md font-semibold">Delimitador seleccionado <span class="font-bold text-xl">"{{ settings.split === '\n' ? 'Salto de línea' : settings.split }}"</span></h2>
        </div>
        <textarea 
            v-model="stringInput"
            rows="10"
            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md max-h-48 resize-none" 
            placeholder="Escribe aquí la lista de participantes">
        </textarea>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'

export default {
    methods: {
        contestantsFileSave() {
            ipcRenderer.send('contestantsFileSave', {contestants: this.totalContestants});
        }
    },
    computed: {
        stringInput: {
            get () {
                return this.$store.state.stringInput
            },
            set (value) {
                this.$store.commit('setStringInput', value)
                this.$store.dispatch('updateContestants');
            }
        },

        ...mapGetters([
            'totalContestants',
            'settings'
        ])
    }
}
</script>