import React, { useEffect, useRef, useState } from 'react'
import { analyzeFaceFromVideo } from '../analysis'
import type { AnalysisResult } from '../types'

import { faLogEvent } from  "../firebase"
import { clamp, rgbToHex } from '../utils/color'

export default function CameraCapture({ onAnalysis }:{ onAnalysis:(a:AnalysisResult)=>void }){
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active,setActive] = useState(false)
  const [status,setStatus] = useState('Idle')

  useEffect(()=>{
    if(!active) return
    (async()=>{
      try{
        const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user' }, audio:false })
        if(videoRef.current){ videoRef.current.srcObject = stream; await videoRef.current.play(); setStatus('Camera ready') }
      }catch(err){ console.error(err); setStatus('Permission denied?') }
    })()
    return ()=>{
      const s = videoRef.current?.srcObject as MediaStream|undefined
      s?.getTracks().forEach(t=>t.stop())
    }
  },[active])

  async function scan() {
    if (!videoRef.current) return
    setStatus('Analyzing…')
    try {
      const res = await analyzeFaceFromVideo(videoRef.current)
      const d = (Array.isArray((res as any).dominant) && (res as any).dominant[0]) || { r: 0, g: 0, b: 0 }
      const color_hex = rgbToHex(d.r, d.g, d.b)
      const color_rgb = `rgb(${clamp(d.r)}, ${clamp(d.g)}, ${clamp(d.b)})`
      onAnalysis(res)
      setStatus(`Undertone: ${res.undertone}, Season: ${res.season}`)
      console.info('Analysis result:', res)

      // ✅ Firebase Analytics event
      faLogEvent('analyze_success', {
        undertone: res.undertone,
        season: res.season,
        color_hex,
        color_rgb, 
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error(err)
      setStatus('Analyze failed')
    }
  }


  return (
    <div className="camera">
      <div className="row">
        <button onClick={()=>setActive(a=>!a)}>{active? 'Stop' : 'Start'} Camera</button>
        <button onClick={scan} disabled={!active}>Analyze Face</button>
        <span className="muted">{status}</span>
      </div>
      <div className="guide">
        <div className="ring"/>
        <video ref={videoRef} playsInline muted className="video"/>
      </div>
      <small className="muted">Align your face inside the circle. Images never leave your device.</small>
    </div>
  )
}
