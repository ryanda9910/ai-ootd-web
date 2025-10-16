export type StyleVibe = 'streetwear'|'minimalist'|'k-fashion'|'vintage'|'office'|'sporty'
export type SeasonType = 'spring'|'summer'|'autumn'|'winter'

export interface PaletteColor { r:number; g:number; b:number }
export interface AnalysisResult {
  dominant: PaletteColor[] // top 5 colors from face crop
  skinKey?: PaletteColor
  undertone: 'warm'|'cool'|'neutral'
  season: SeasonType
}

export interface UserPrefs {
  vibe: StyleVibe[]
  gender: 'male'|'female'|'unisex'
  avoidColors: string[]
}
