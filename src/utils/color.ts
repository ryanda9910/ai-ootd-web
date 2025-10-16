export function rgbToHsl(r:number,g:number,b:number){
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h=0,s=0,l=(max+min)/2
  if(max!==min){
    const d=max-min
    s = l>0.5? d/(2-max-min) : d/(max+min)
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break
      case g: h=(b-r)/d+2; break
      case b: h=(r-g)/d+4; break
    }
    h/=6
  }
  return { h:h*360, s, l }
}
export interface PaletteColor { r:number; g:number; b:number }
export function hex(c:PaletteColor){
  const to = (n:number)=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0')
  return `#${to(c.r)}${to(c.g)}${to(c.b)}`
}
export function distance(a:PaletteColor,b:PaletteColor){
  const dr=a.r-b.r,dg=a.g-b.g,db=a.b-b.b
  return Math.sqrt(dr*dr+dg*dg+db*db)
}
