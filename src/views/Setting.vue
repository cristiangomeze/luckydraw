<template>
  <div class="w-full bg-gray-100 p-8 overflow-y-auto">
    <div class="mx-auto max-w-4xl">
      <div class="md:grid md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Ajustes</h3>
            <p class="mt-1 text-sm text-gray-600">
              Estos ajustes modifican el comportamiento que tendrá la aplicación.
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <form @submit.prevent="submit" method="POST">
            <div class="shadow sm:rounded-md sm:overflow-hidden">
              <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                  <div class="col-span-3 sm:col-span-2">
                    <label for="company_website" class="block text-sm font-medium text-gray-700">
                       Separación del texto
                    </label>
                    <div class="mt-1">
                      <select v-model="settings.split" class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded sm:text-sm border-gray-300" name="text_split">
                        <option :value="'\n'">Salto de linea \n</option>
                        <option value=";">Punto y coma ;</option>
                        <option value=",">Coma ,</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="w-1/2">
                  <label for="about" class="block text-sm font-medium text-gray-700">
                    Límite de ganadores por sorteo
                  </label>
                  <div class="mt-1">
                    <input v-model="settings.limit" type="number" min="0" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"/>
                  </div>
                </div>

                <div class="flex space-x-4">
                  <div class="w-1/2">
                    <label for="about" class="block text-sm font-medium text-gray-700">
                      Duración de la animación (milliseconds)
                    </label>
                    <div class="mt-1">
                      <input v-model="settings.duration" type="number" min="500" max="9000" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"/>
                    </div>
                  </div>

                  <div class="w-1/2">
                    <label for="about" class="block text-sm font-medium text-gray-700">
                      FPS de la animación
                    </label>
                    <div class="mt-1">
                      <input v-model="settings.fps" type="number" min="1" max="60" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"/>
                    </div>
                  </div>
                </div>

              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
                <secondary-button @click.native="reset">Restablecer valor predeterminado</secondary-button>
                <primary-button type="submit">Actualizar</primary-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pickBy from 'lodash/pickBy'
import PrimaryButton from '../components/Button';
import SecondaryButton from '../components/SecondaryButton';

export default {
  components: {
    PrimaryButton,
    SecondaryButton
  },

  data() {
    return {
      settings: this.$store.state.settings
    }
  },

  methods: {
    submit() {
      this.$store.commit('setSettings', pickBy(this.settings));

      new Notification('Ajustes', { body: 'todos los ajustes se han guardado correctamente' });
    },

    reset() {
      if (! confirm('¿Está seguro de que desea restablecer los valores predeterminados?')) {
        return;
      };

      this.$store.dispatch('resetSettings');

      this.settings = this.$store.state.settings;

      new Notification('Ajustes', { body: 'La configuración se ha restablecido a sus valores predeterminados' });
    }
  }
}
</script>