// tiny k-means for color quantization
export function kmeansColors(pixels:Uint8ClampedArray,k=5,maxIter=10){
  const pts:number[][]=[]
  for(let i=0;i<pixels.length;i+=4){
    const a=pixels[i+3]; if(a<200) continue
    pts.push([pixels[i],pixels[i+1],pixels[i+2]])
  }
  if(pts.length===0) return []
  const centers:number[][]=[]
  for(let i=0;i<k;i++) centers.push(pts[Math.floor(Math.random()*pts.length)].slice())
  for(let it=0;it<maxIter;it++){
    const groups:number[][][] = Array.from({length:k},()=>[])
    for(const p of pts){
      let bi=0,bd=1e9
      for(let i=0;i<k;i++){
        const c=centers[i];
        const d=(p[0]-c[0])**2+(p[1]-c[1])**2+(p[2]-c[2])**2
        if(d<bd){bd=d;bi=i}
      }
      groups[bi].push(p)
    }
    for(let i=0;i<k;i++){
      if(groups[i].length===0) continue
      const s=[0,0,0]
      for(const p of groups[i]){s[0]+=p[0];s[1]+=p[1];s[2]+=p[2]}
      centers[i]=[s[0]/groups[i].length,s[1]/groups[i].length,s[2]/groups[i].length]
    }
  }
  return centers.map(c=>({r:Math.round(c[0]),g:Math.round(c[1]),b:Math.round(c[2])}))
}
