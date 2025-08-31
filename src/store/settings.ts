import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Settings } from '~/models'
import type { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  quality: 1080,
  shouldUseEnhancedBitrate: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setQuality(state, action: PayloadAction<State['quality']>) {
      return { ...state, quality: action.payload }
    },
    setShouldUseEnhancedBitrate(
      state,
      action: PayloadAction<State['shouldUseEnhancedBitrate']>,
    ) {
      return {
        ...state,
        shouldUseEnhancedBitrate: action.payload,
      }
    },
  },
})

export const { setQuality, setShouldUseEnhancedBitrate } = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectQuality = createSelector(
  selectSettings,
  (settings) => settings.quality,
)

export const selectShouldUseEnhancedBitrate = createSelector(
  selectSettings,
  (settings) => settings.shouldUseEnhancedBitrate,
)
