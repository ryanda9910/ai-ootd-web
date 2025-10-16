import React from 'react'
import { hex, type PaletteColor } from '../utils/color'
export default function PaletteSwatches({ title, colors }:{ title:string; colors:(string|PaletteColor)[] }){
  return (
    <div className="swatches">
      <div className="row between"><h3>{title}</h3></div>
      <div className="swatch-row">
        {colors.map((c,i)=>{
          const h = typeof c==='string' ? c : hex(c)
          return <div key={i} className="swatch" style={{background:h}} title={h}/>
        })}
      </div>
    </div>
  )
}
