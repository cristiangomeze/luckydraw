import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultSettings = {
  split: '\n',
  limit: 0,
  duration: 2000,
  fps: 30
};

export default new Vuex.Store({
  state: {
    stringInput: '',
    contestants: [],
    currentWinner: '',
    winners: [],
    chosenWinnerEvent: null,
    settings: defaultSettings
  },

  getters: {
    totalContestants: state => {
      return state.stringInput.length 
        ? Array.from(new Set(state.stringInput
            .split(state.settings.split)
            .map(contestant => contestant.toLowerCase().trim())
            .filter(contestant =>  /\S/.test(contestant))
          ))
        : []
    },

    contestants: state => {
      return state.contestants;
    },

    randomContestant: (state, getters) => {
      return getters.contestants[Math.floor(Math.random() * getters.contestants.length)]
    },

    winners: state => {
      return state.winners;
    },

    currentWinner: state => {
      return state.currentWinner;
    },

    settings: state => {
      return state.settings;
    }
  },

  mutations: {
    setStringInput (state, string) {
      state.stringInput = string
    },

    setContestants (state, array) {
      state.contestants = array
    },

    setCurrentWinner (state, string) {
      state.currentWinner = string
    },

    setWinners (state, string) {
      state.winners.push(string);
    },

    resetWinners (state)  {
      state.winners = [];
    },

    setChosenWinnerEvent (state, event) {
      state.chosenWinnerEvent = event;
    },

    setSettings (state, object) {
      state.settings = object;
      localStorage.setItem('settings', JSON.stringify(object));
    },

    initialiseSettings(state) {
			if(! localStorage.getItem('settings')) {
        return;       
			}

      state.settings = JSON.parse(localStorage.getItem('settings'))
		},
  },

  actions: {
    updateContestants (context) {
      context.commit('setContestants', context.getters.totalContestants)
    },

    updateWinners ({ commit, getters}) {
      commit('setWinners', getters.currentWinner);
    },

    chooseWinner ({commit, getters, state}) {
      if (0 === getters.contestants.length) {
        return;
      }

      commit('setCurrentWinner', getters.randomContestant);
      commit('setContestants', getters.contestants.filter(item => item !== getters.randomContestant));

      state.chosenWinnerEvent.dispatchEvent(new Event('chosenWinner'));

    },

    resetSettings ({ commit }) {
      commit('setSettings', defaultSettings);
    }
  }
})
