<template>
    <div>
        <h2 class="text-center text-gray-800 font-bold text-xl">Ganadores ({{ new Intl.NumberFormat('en-US').format(winners.length) }})</h2>

        <div class="mt-8 flex flex-col pr-4">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" :class="winners.length > 15 ? 'overflow-y-auto h-96': ''">
                    <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(winner, key) in winners" :key="key">
                                <td class="px-4 py-2 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ winner }}
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="0 === winners.length">
                                <td class="px-4 py-2 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 text-center">
                                        No hay resultados.
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            <div class="flex justify-center">
                <secondary-button @click.native="endTheContest" class="mt-4 text-xs" :class="{'opacity-75 cursor-not-allowed': 0 == winners.length}" :disabled="0 == winners.length">
                    Finalizar Sorteo
                </secondary-button>
            </div>
        </div>
    </div>
</template>

<script>
import SecondaryButton from '../../components/SecondaryButton.vue'
import { ipcRenderer } from 'electron'
import { mapGetters } from 'vuex'

export default {
    components: {
        SecondaryButton
    },
    
    mounted() {
        ipcRenderer.on('WinnersSavedSuccessful', (event, args) => {
            this.$store.commit('resetWinners', []);
            this.$store.dispatch('updateContestants');
            
            new Notification('Los ganadores se guardaron con éxito', { body: 'Ganadores guardados: ' + args.winners });
        });
    
  },

    methods: {
        endTheContest() {
            if (!confirm("¿Estás seguro de que quieres finalizar el sorteo?")) {
               return;
            }

            ipcRenderer.send('endTheContest', {winners: this.winners});
        }
    },

    computed: {
        ...mapGetters([
            'winners',
        ])
    }
}
</script>