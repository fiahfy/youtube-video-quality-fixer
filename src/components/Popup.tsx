import { Box, CssBaseline, GlobalStyles, Typography } from '@mui/material'
import type { ChangeEvent } from 'react'
import type { Settings } from '~/models'
import StoreProvider from '~/providers/StoreProvider'
import { useAppDispatch, useAppSelector } from '~/store'
import { selectQuality, setQuality } from '~/store/settings'

const qualityOptions = [
  { value: 'auto', text: 'Auto' },
  { value: 144, text: '144' },
  { value: 240, text: '240' },
  { value: 360, text: '360' },
  { value: 480, text: '480' },
  { value: 720, text: '720p60' },
  { value: 1080, text: '1080p60 (HD)' },
  { value: 1440, text: '1440p60 (HD)' },
  { value: 2160, text: '2160p60 (4K)' },
  { value: 4320, text: '4320p60 (8K)' },
]

const App = () => {
  const quality = useAppSelector(selectQuality)
  const dispatch = useAppDispatch()

  const handleChangeQuality = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value as Settings['quality']
    dispatch(setQuality(value))
  }

  return (
    <Box sx={{ display: 'flex', mx: 2, my: 1 }}>
      <Typography sx={{ mr: 1 }} variant="subtitle2">
        Highest quality:
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
  )
}

const Popup = () => {
  return (
    <StoreProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { overflowY: 'hidden', width: 250 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup
