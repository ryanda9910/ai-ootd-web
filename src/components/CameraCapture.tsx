import React, { useEffect, useRef, useState } from 'react'
import { analyzeFaceFromVideo } from '../analysis'
import type { AnalysisResult } from '../types'
import { pushToGTM } from '../utils/gtm'

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

  async function scan(){
    if(!videoRef.current) return
    setStatus('Analyzing…')
    const res = await analyzeFaceFromVideo(videoRef.current)
    onAnalysis(res)
    setStatus(`Undertone: ${res.undertone}, Season: ${res.season}`)

    pushToGTM("analyze_face", {
    undertone: res.undertone,
    season: res.season,
    timestamp: new Date().toISOString()
  })
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
