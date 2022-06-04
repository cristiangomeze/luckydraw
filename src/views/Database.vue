<template>
  <div class="w-full bg-gray-100 p-8">
    <div class="mx-auto max-w-7xl">
      <div class="px-4 sm:px-0 pb-8">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Base de datos</h3>
      <p class="mt-1 text-sm text-gray-600">
        Estos son todos los sorteos almacenados en la aplicación.
      </p>
    </div>
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sorteo
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ganadores
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="winner in winners" :key="winner.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                        Sorteo # {{ winner.id }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Realizado el  {{ new Date(winner.created_at).toLocaleDateString('es-do', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                      </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ winner.winners.replace(/,/g, ', ') }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  data() {
    return {
      query: 'SELECT * FROM winners ORDER BY id DESC',
      winners: null
    }
  },

  mounted() {
    this.send(this.query).then((result) => this.winners = result);
  },

  methods: {
    send(message) {
       return new Promise((resolve) => {
          ipcRenderer.once('asynchronous-reply', (_, arg) => {
              resolve(arg);
          });
          ipcRenderer.send('asynchronous-message', message);
      });
    }
  }
}
</script>