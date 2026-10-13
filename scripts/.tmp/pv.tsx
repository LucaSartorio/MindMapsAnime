// Anteprima: WORLDS=onepiece:luffy,zoro;naruto:naruto  oppure WORLDS=onepiece (tutti con face)
import { writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadWorldDataset } from '@/data/registry';
import { EntityImage } from '@/components/common/EntityImage';
const size=+(process.env.SIZE??180);
const blocks:any[]=[];
for (const spec of (process.env.WORLDS??'onepiece').split(';')) {
  const [w, list] = spec.split(':');
  const d = await loadWorldDataset(w as any);
  let cs = d.characters.filter(c => c.appearance);
  if (list) { const ids=list.split(','); cs = cs.filter(c => ids.some(i => c.id.endsWith('-'+i) || c.id==='char-'+i)); }
  else if (!process.env.ALL) cs = cs.filter(c => c.appearance?.face);
  blocks.push(<section key={w}><h3>{w} ({cs.length})</h3><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{cs.map(c=><figure key={c.id} style={{margin:0,width:size}}><div style={{width:size,height:size,borderRadius:10,overflow:'hidden'}}><EntityImage kind="character" id={c.id} name={c.name} appearance={c.appearance} worldSlug={w}/></div><figcaption style={{fontSize:11,height:28,overflow:'hidden'}}>{c.name}</figcaption></figure>)}</div></section>);
}
writeFileSync(process.env.OUT!, `<html><body style="background:#0e1220;color:#ddd;font:12px sans-serif;margin:8px">${renderToStaticMarkup(<>{blocks}</>)}</body></html>`);
