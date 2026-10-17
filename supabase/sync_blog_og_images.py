"""
Generate 1200x630 JPEG `og_image` for all published blogs in Supabase.
This enables WhatsApp, LinkedIn, Facebook, and Twitter rich card image previews.
"""
import json, os, sys, urllib.request, urllib.parse, time

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
env = {}
for line in open(os.path.join(ROOT, '.env'), encoding='utf8'):
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

URL = env['SUPABASE_URL'].rstrip('/')
KEY = env['SUPABASE_SERVICE_KEY']
FALLBACK_OG = 'https://easywaygermany.com/og-banner.jpg'

def call_supabase(method, path, body=None):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{path}",
        method=method,
        data=json.dumps(body).encode('utf8') if body is not None else None,
        headers={
            'apikey': KEY,
            'Authorization': f'Bearer {KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation' if method == 'PATCH' else 'return=minimal'
        }
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        d = r.read()
        return json.loads(d.decode('utf8')) if d else None

def upload_to_cloudinary(image_url):
    data = urllib.parse.urlencode({
        'file': image_url,
        'upload_preset': 'easyway_uploads'
    }).encode('utf8')
    req = urllib.request.Request('https://api.cloudinary.com/v1_1/p1y2txhc/image/upload', data=data)
    with urllib.request.urlopen(req, timeout=60) as res:
        c_json = json.loads(res.read().decode('utf8'))
        raw_url = c_json['secure_url']
        # Convert to 1200x630 JPEG for optimal WhatsApp / Meta preview
        og_url = raw_url.replace('/upload/', '/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/').rsplit('.', 1)[0] + '.jpg'
        return og_url

def main():
    print("Fetching published blogs from Supabase...")
    blogs = call_supabase('GET', 'blogs?select=id,title,slug,image,og_image&is_published=eq.true&order=id.asc')
    print(f"Found {len(blogs)} blogs.")

    updated_count = 0
    for idx, b in enumerate(blogs, 1):
        bid = b['id']
        slug = b['slug']
        img = b.get('image') or ''
        curr_og = b.get('og_image') or ''

        # If already a cloudinary 1200x630 jpg, skip
        if curr_og and 'cloudinary.com' in curr_og and curr_og.endswith('.jpg'):
            print(f"[{idx}/{len(blogs)}] ID {bid} ({slug}): Already has Cloudinary OG image.")
            continue

        target_og = None
        if img.startswith('http://') or img.startswith('https://'):
            if 'cloudinary.com' in img:
                # Direct conversion of cloudinary URL to 1200x630 jpg
                target_og = img.replace('/upload/', '/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/').rsplit('.', 1)[0] + '.jpg'
            else:
                try:
                    print(f"[{idx}/{len(blogs)}] ID {bid} ({slug}): Uploading remote image to Cloudinary...")
                    target_og = upload_to_cloudinary(img)
                except Exception as e:
                    print(f"  Warning: Cloudinary upload failed for {img}: {e}. Using fallback banner.")
                    target_og = FALLBACK_OG
        else:
            print(f"[{idx}/{len(blogs)}] ID {bid} ({slug}): No external image, setting fallback banner.")
            target_og = FALLBACK_OG

        # Update row in Supabase
        call_supabase('PATCH', f'blogs?id=eq.{bid}', {'og_image': target_og})
        print(f"  -> Set og_image: {target_og}")
        updated_count += 1
        time.sleep(0.3)

    print(f"\nDone! Updated og_image for {updated_count} blogs.")

if __name__ == '__main__':
    main()
