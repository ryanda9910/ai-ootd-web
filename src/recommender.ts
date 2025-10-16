import type { AnalysisResult, UserPrefs, SeasonType } from './types'
import { hex } from './utils/color'

const SEASON_PALETTES: Record<SeasonType,string[]> = {
  spring: ['#FFD1A1','#FFA07A','#F6E58D','#A3E635','#7DD3FC','#F472B6'],
  summer: ['#A7C7E7','#C3B1E1','#FDE1E1','#98FB98','#E6E6FA','#87CEFA'],
  autumn: ['#D97706','#92400E','#D1A054','#A3BE8C','#8B5E34','#7C3E1D'],
  winter: ['#0EA5E9','#8B5CF6','#14B8A6','#E11D48','#1F2937','#E5E7EB']
}

export function buildIdea(analysis: AnalysisResult, prefs: UserPrefs){
  const base = SEASON_PALETTES[analysis.season]
  const accent = pickAccents(base, prefs)
  const dom = analysis.dominant.map(hex).slice(0,3)

  const ideaText = describeLook(analysis, prefs, accent)
  return {
    palette: accent,
    dominant: dom,
    title: `OOTD: ${analysis.season.toUpperCase()} tones • ${analysis.undertone} undertone`,
    description: ideaText,
    tips: quickTips(analysis.season),
  }
}

function pickAccents(base:string[], prefs: UserPrefs){
  const filtered = base.filter(c=> !prefs.avoidColors.includes(c.toLowerCase()))
  const pad = [...filtered]
  while(pad.length<3) pad.push(base[pad.length%base.length])
  return pad.slice(0,5)
}

function describeLook(a: AnalysisResult, prefs: UserPrefs, colors: string[]){
  const vibe = (prefs.vibe[0]||'minimalist')
  const gender = prefs.gender
  const [c1,c2,c3] = colors
  const garment = gender==='female' ? ['cardigan','midi skirt','ankle boots'] : (gender==='male' ? ['overshirt','tapered chinos','lo-top sneakers'] : ['overshirt','straight pants','sneakers'])
  const line1 = `Try a ${vibe} look using ${c1}, ${c2}, and ${c3} as your palette.`
  const line2 = `Pair a ${garment[0]} with ${garment[1]} and ${garment[2]}.`
  const line3 = a.undertone==='warm' ? 'Lean into warm metals (gold/bronze).' : a.undertone==='cool' ? 'Silver/steel accessories will pop.' : 'Neutral metals work well.'
  return `${line1} ${line2} ${line3}`
}

function quickTips(season: SeasonType){
  switch(season){
    case 'spring': return ['Light fabrics','Soft warm tones','Cream/khaki base']
    case 'summer': return ['Airy layers','Muted cool tones','Minimal accessories']
    case 'autumn': return ['Earthy textures','Layered browns','Leather accents']
    case 'winter': return ['High contrast','Crisp lines','Dark base + bright accent']
  }
}
