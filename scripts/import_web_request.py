import io, zipfile, urllib.request, xml.etree.ElementTree as ET, pathlib, re, html
url = 'https://github.com/user-attachments/files/35419927/Network.Web.Request.docx'
with urllib.request.urlopen(url, timeout=45) as response:
    doc = zipfile.ZipFile(io.BytesIO(response.read()))
ns = {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
rels = {e.get('Id'):e.get('Target') for e in ET.fromstring(doc.read('word/_rels/document.xml.rels'))}
page = pathlib.Path('public/articles/web-request.html')
folder = page.parent / 'web-request'
folder.mkdir(exist_ok=True)
content = []
images = []
n = 0
for p in ET.fromstring(doc.read('word/document.xml')).findall('.//w:body//w:p',ns):
    for b in p.findall('.//a:blip',ns):
        target = rels[b.get('{'+ns['r']+'}embed')]
        ext = pathlib.PurePosixPath(target).suffix.lower()
        assert ext in {'.png','.jpg','.jpeg','.gif','.webp'}
        n += 1
        name = f'figure-{n}{ext}'
        (folder/name).write_bytes(doc.read('word/'+target))
        images.append('/articles/web-request/'+name)
    text = ''.join(t.text or '' for t in p.findall('.//w:t',ns)).strip()
    if not text: continue
    safe = html.escape(text)
    if re.match(r'^Figure\s+\d+',text,re.I) and images:
        tags = ''.join(f'<a href="{src}"><img loading="lazy" src="{src}" alt="{safe}"></a>' for src in images)
        content.append(f'<figure>{tags}<figcaption>{safe}</figcaption></figure>')
        images.clear()
        continue
    style=p.find('./w:pPr/w:pStyle',ns)
    level=style.get('{'+ns['w']+'}val','') if style is not None else ''
    tag='h1' if not content else 'h3' if re.match(r'^\d+\.\d+\s',text) else 'h2' if re.match(r'^\d+\.\s',text) or level.startswith('Heading') or text in ['Introduction','Conclusion','References'] else 'p'
    content.append(f'<{tag}>{safe}</{tag}>')
assert n >= 9 and not images, (n,images)
template=page.read_text()
page.write_text(template[:template.index('<h1>')]+'\n'.join(content)+'\n</article></main></body></html>\n')
