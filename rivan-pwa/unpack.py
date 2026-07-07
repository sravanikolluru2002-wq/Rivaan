import json
import base64
import gzip
import re
import os

def unpack_bundled_html(filename):
    if not os.path.exists(filename):
        print(f"{filename} not found.")
        return

    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract manifest
    manifest_match = re.search(r'<script type="__bundler/manifest">(.*?)</script>', html, re.DOTALL)
    template_match = re.search(r'<script type="__bundler/template">(.*?)</script>', html, re.DOTALL)
    
    if not manifest_match or not template_match:
        print(f"Could not find bundler tags in {filename}")
        return

    manifest = json.loads(manifest_match.group(1))
    template = json.loads(template_match.group(1))

    # Process each asset
    for uuid, entry in manifest.items():
        mime = entry.get('mime', 'text/plain')
        compressed = entry.get('compressed', False)
        data_b64 = entry.get('data', '')

        # decode base64
        try:
            raw_bytes = base64.b64decode(data_b64)
            if compressed:
                raw_bytes = gzip.decompress(raw_bytes)
            
            # Re-encode to base64 for data URI
            final_b64 = base64.b64encode(raw_bytes).decode('utf-8')
            data_uri = f"data:{mime};base64,{final_b64}"
            
            template = template.replace(uuid, data_uri)
        except Exception as e:
            print(f"Error unpacking {uuid} in {filename}: {e}")

    # Remove integrity and crossorigin attributes
    template = re.sub(r'\s+integrity="[^"]*"', '', template, flags=re.IGNORECASE)
    template = re.sub(r'\s+crossorigin="[^"]*"', '', template, flags=re.IGNORECASE)

    # Save as unpacked file
    out_name = filename.replace('.html', '.dc.html')
    with open(out_name, 'w', encoding='utf-8') as f:
        f.write(template)
    
    print(f"Successfully unpacked {filename} to {out_name}")

unpack_bundled_html('Rivan Agent Dashboard.html')
unpack_bundled_html('Rivan Admin Dashboard.html')
