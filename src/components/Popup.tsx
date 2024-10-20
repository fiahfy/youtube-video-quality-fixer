import {
  Box,
  CssBaseline,
  GlobalStyles,
  Typography,
  useTheme,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import type { Settings } from '~/models'
import StoreProvider from '~/providers/StoreProvider'
import { useAppDispatch, useAppSelector } from '~/store'
import {
  selectQuality,
  selectShouldUseEnhancedBitrate,
  setQuality,
  setShouldUseEnhancedBitrate,
} from '~/store/settings'

const qualityOptions = [
  { value: 4320, text: '4320p60 (8K)' },
  { value: 2160, text: '2160p60 (4K)' },
  { value: 1440, text: '1440p60 (HD)' },
  { value: 1080, text: '1080p60 (HD)' },
  { value: 720, text: '720p60' },
  { value: 480, text: '480' },
  { value: 360, text: '360' },
  { value: 240, text: '240' },
  { value: 144, text: '144' },
  { value: 'auto', text: 'Auto' },
]

const App = () => {
  const quality = useAppSelector(selectQuality)
  const shouldUseEnhancedBitrate = useAppSelector(
    selectShouldUseEnhancedBitrate,
  )
  const dispatch = useAppDispatch()

  const theme = useTheme()

  const handleChangeQuality = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as Settings['quality']
    dispatch(setQuality(value))
  }

  const handleChangeShouldUseEnhancedBitrate = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.currentTarget.checked
    dispatch(setShouldUseEnhancedBitrate(value))
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, mx: 2, my: 1 }}
    >
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 1 }} variant="subtitle2">
          Highest Available Quality:
        </Typography>
        <select
          onChange={handleChangeQuality}
          style={{ WebkitAppearance: 'menulist', borderStyle: 'solid' }}
          value={quality}
        >
          {qualityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <input
          checked={shouldUseEnhancedBitrate}
          id="enhancedBitrate"
          onChange={handleChangeShouldUseEnhancedBitrate}
          type="checkbox"
        />
        <label
          htmlFor="enhancedBitrate"
          style={{
            ...theme.typography.caption,
          }}
        >
          Use Enhanced Bitrate for YouTube Premium
        </label>
      </Box>
    </Box>
  )
}

const Popup = () => {
  return (
    <StoreProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { overflowY: 'hidden', width: 310 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup
