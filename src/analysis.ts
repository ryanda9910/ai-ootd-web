import { kmeansColors } from './utils/kmeans'
import { rgbToHsl } from './utils/color'
import type { AnalysisResult, SeasonType } from './types'

export async function analyzeFaceFromVideo(video: HTMLVideoElement): Promise<AnalysisResult>{
  const w=Math.min(400, video.videoWidth||400)
  const h=Math.min(400, video.videoHeight||400)
  const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h
  const ctx = canvas.getContext('2d')!
  const size=Math.min(video.videoWidth||w, video.videoHeight||h)
  const sx=((video.videoWidth||w)-size)/2, sy=((video.videoHeight||h)-size)/2
  ctx.drawImage(video, sx, sy, size, size, 0, 0, w, h)
  const img = ctx.getImageData(0,0,w,h)

  const cx=w/2, cy=h/2, rad=Math.min(w,h)*0.42
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const dx=x-cx, dy=y-cy
      if(dx*dx+dy*dy > rad*rad){
        const i=(y*w+x)*4
        img.data[i+3]=0
      }
    }
  }
  const palette = kmeansColors(img.data, 5, 8)

  let skin: {r:number;g:number;b:number}|undefined
  let bestScore=-1
  for(const c of palette){
    const {h,s,l}=rgbToHsl(c.r,c.g,c.b)
    const score = (1-Math.abs(l-0.7))*0.6 + (1-Math.abs(s-0.35))*0.4 + (h>0&&h<60?0.1:0)
    if(score>bestScore){ bestScore=score; skin=c }
  }

  let warmScore=0, coolScore=0
  for(const c of palette){
    const {h,s,l}=rgbToHsl(c.r,c.g,c.b)
    const isSkinCandidate = l>0.45 && l<0.85 && s<0.6
    if(!isSkinCandidate) continue
    const warm = (h>=10 && h<=70) ? 1 : 0
    const cool = (h>=180 && h<=260) ? 1 : 0
    warmScore += warm
    coolScore += cool
  }
  let undertone: 'warm'|'cool'|'neutral' = 'neutral'
  if(warmScore>coolScore+0.5) undertone='warm'
  else if(coolScore>warmScore+0.5) undertone='cool'

  const season: SeasonType = mapSeason(undertone, skin)
  return { dominant: palette, skinKey: skin, undertone, season }
}

function mapSeason(undertone: 'warm'|'cool'|'neutral', skin?: {r:number;g:number;b:number}): SeasonType{
  if(!skin) return undertone==='cool' ? 'winter':'autumn'
  const {h,s,l}=rgbToHsl(skin.r, skin.g, skin.b)
  if(undertone==='warm') return l>0.65 ? 'spring' : 'autumn'
  if(undertone==='cool') return l>0.65 ? 'summer' : 'winter'
  if(s>0.45 && l<0.6) return 'winter'
  if(s<0.35 && l>0.65) return 'summer'
  return 'autumn'
}
