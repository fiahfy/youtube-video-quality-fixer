import { Module } from 'vuex'
import { Settings } from '~/models'
import { State as RootState } from '~/store'

export type State = Settings

export const module: Module<State, RootState> = {
  namespaced: true,
  state: () => ({
    quality: 1080,
  }),
  mutations: {
    setQuality(state, { quality }: { quality: State['quality'] }) {
      state.quality = quality
    },
  },
}
