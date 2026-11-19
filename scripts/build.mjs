import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(),assets={};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.pdf':'application/pdf','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.jpg':'image/jpeg','.ico':'image/x-icon'};
async function walk(dir,prefix=''){for(const d of await fs.readdir(dir,{withFileTypes:true})){const rel=prefix+'/'+d.name,full=path.join(dir,d.name);if(d.isDirectory())await walk(full,rel);else assets[rel]={type:types[path.extname(d.name)]||'application/octet-stream',body:(await fs.readFile(full)).toString('base64')}}}
await walk(path.join(root,'public'));
const knowledge=JSON.parse(await fs.readFile('worker/knowledge.json','utf8'));
await fs.mkdir('dist/server',{recursive:true});
await fs.writeFile('dist/server/index.js','const ASSETS='+JSON.stringify(assets)+';\nconst KNOWLEDGE='+JSON.stringify(knowledge)+';\n'+await fs.readFile('worker/index.js','utf8'));
console.log('Built worker with '+Object.keys(assets).length+' original website assets');
