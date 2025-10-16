import React, { useEffect, useState } from 'react'
import CameraCapture from './components/CameraCapture'
import PaletteSwatches from './components/PaletteSwatches'
import IdeaCard from './components/IdeaCard'
import type { AnalysisResult, UserPrefs } from './types'
import { buildIdea } from './recommender'

const defaultPrefs: UserPrefs = { vibe:['k-fashion','minimalist','streetwear'], gender:'unisex', avoidColors:[] }

export default function App(){
  const [prefs,setPrefs] = useState<UserPrefs>(()=>{
    const s = localStorage.getItem('prefs'); return s? JSON.parse(s): defaultPrefs
  })
  const [analysis,setAnalysis] = useState<AnalysisResult|null>(null)
  const [idea,setIdea] = useState<any|null>(null)

  useEffect(()=>{ localStorage.setItem('prefs', JSON.stringify(prefs)) },[prefs])
  useEffect(()=>{ if(analysis) setIdea(buildIdea(analysis, prefs)) },[analysis, prefs])

  return (
    <div className="app">
      <header>
        <h1>AI OOTD</h1>
        <p className="muted">Face-based color analysis → daily outfit idea. All on-device.</p>
      </header>

      <section className="panel">
        <h2>1) Your style</h2>
        <PrefsForm prefs={prefs} onChange={setPrefs} />
      </section>

      <section className="panel">
        <h2>2) Analyze your face</h2>
        <CameraCapture onAnalysis={setAnalysis} />
        {analysis && (
          <div className="analysis">
            <div className="row">
              <span>Undertone: <b>{analysis.undertone}</b></span>
              <span>Season: <b>{analysis.season}</b></span>
            </div>
            <PaletteSwatches title="Dominant from face" colors={analysis.dominant} />
          </div>
        )}
      </section>

      <section className="panel">
        <h2>3) Today’s idea</h2>
        {idea? <>
          <PaletteSwatches title="Suggested palette" colors={idea.palette} />
          <IdeaCard title={idea.title} description={idea.description} tips={idea.tips} />
        </> : <p className="muted">Scan your face to generate your OOTD palette and idea.</p>}
      </section>

      <footer>
        <small className="muted">Privacy: no images are uploaded. The app only computes colors locally.
        Installable PWA once served over HTTPS.</small>
      </footer>
    </div>
  )
}

function PrefsForm({ prefs, onChange }:{ prefs:UserPrefs; onChange:(p:UserPrefs)=>void }){
  const update=(patch:Partial<UserPrefs>)=>onChange({...prefs,...patch})
  const toggleVibe=(v:string)=> update({ vibe: (prefs.vibe.includes(v as any)? prefs.vibe.filter(x=>x!==v): [...prefs.vibe, v as any]) })
  const [avoid, setAvoid] = useState('')
  return (
    <div className="prefs">
      <div className="row">
        <label>Gender</label>
        <select value={prefs.gender} onChange={(e)=>update({ gender: e.target.value as any })}>
          <option value="unisex">Unisex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="row">
        <label>Style vibes</label>
        {['k-fashion','minimalist','streetwear','vintage','office','sporty'].map(v=> (
          <label key={v} className="pill">
            <input type="checkbox" checked={prefs.vibe.includes(v as any)} onChange={()=>toggleVibe(v)} /> {v}
          </label>
        ))}
      </div>
      <div className="row">
        <label>Avoid hex colors</label>
        <input placeholder="#ff0000" value={avoid} onChange={(e)=>setAvoid(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter' && avoid.trim()){ update({ avoidColors:[...prefs.avoidColors, avoid.trim().toLowerCase()] }); setAvoid('') } }} />
        <div className="chips">
          {prefs.avoidColors.map((c,i)=>(<span key={i} className="chip">{c}<button onClick={()=>update({ avoidColors: prefs.avoidColors.filter((_,ix)=>ix!==i) })}>×</button></span>))}
        </div>
      </div>
    </div>
  )
}
