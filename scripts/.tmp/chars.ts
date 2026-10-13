import { loadWorldDataset } from '@/data/registry';
const w=process.argv[2];
const d=await loadWorldDataset(w as any);
for (const c of d.characters.filter(c=>c.importance==='main'||c.importance==='major'))
  console.log([c.id, c.name, c.gender??'', c.race??''].join('\t'));
