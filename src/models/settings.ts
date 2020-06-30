export type Quality =
  | 'auto'
  | 144
  | 240
  | 360
  | 480
  | 720
  | 1080
  | 1440
  | 2160
  | 4320
export type Settings = {
  quality: Quality
}
