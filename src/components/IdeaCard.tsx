import React from 'react'
export default function IdeaCard({ title, description, tips }:{ title:string; description:string; tips:string[] }){
  return (
    <article className="card">
      <div className="card-body">
        <h2>{title}</h2>
        <p className="muted">{description}</p>
        <ul className="tips">
          {tips.map((t,i)=>(<li key={i}>• {t}</li>))}
        </ul>
        <div className="actions">
          <a className="btn" target="_blank" rel="noreferrer" href={`https://www.google.com/search?q=buy+${encodeURIComponent(title.replace('OOTD:','').trim())}`}>Shop similar</a>
          <button className="btn-outline" onClick={()=>navigator.share?.({title, text:description}).catch(()=>{})}>Share</button>
        </div>
      </div>
    </article>
  )
}
