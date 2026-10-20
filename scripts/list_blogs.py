import os, json, urllib.request

env = {}
if os.path.exists('.env'):
    for line in open('.env', encoding='utf-8'):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip('"').strip("'")

url = env['SUPABASE_URL'].rstrip('/') + '/rest/v1/blogs?select=id,title,slug,seo_title,seo_description,category,is_published&order=id'
req = urllib.request.Request(
    url, 
    headers={
        'apikey': env['SUPABASE_SERVICE_KEY'],
        'Authorization': 'Bearer ' + env['SUPABASE_SERVICE_KEY']
    }
)
with urllib.request.urlopen(req, timeout=30) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print(f"Total blogs: {len(data)}")
    for b in data:
        print(f"ID {b['id']} | Slug: {b['slug']} | Title: {b['title']}")
