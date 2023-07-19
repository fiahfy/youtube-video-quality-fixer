import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import { Settings } from '~/models'
import { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  quality: 1080,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setQuality(state, action: PayloadAction<State['quality']>) {
      return { ...state, quality: action.payload }
    },
  },
})

export const { setQuality } = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectQuality = createSelector(
  selectSettings,
  (settings) => settings.quality,
)
