# My Website (Frontend)

Static website, bina kisi build ke. GitHub Pages par seedha chalti hai.

## Folder
```
my-website/
├── index.html          main page
├── 404.html            error page
├── CNAME               yahan apna domain likho
├── css/style.css
├── js/main.js
├── assets/favicon.svg
└── projects/aria/      ARIA Jarvis HUD (alag page)
```

## Pehle ye edit karo
1. `index.html` mein `yourmail@example.com` aur `YOUR-USERNAME` apni details se badlo.
2. `js/main.js` mein bhi `yourmail@example.com` badlo (contact form ke liye).
3. `CNAME` file mein `yourdomain.com` ki jagah apna asli domain likho.
4. Projects ke "Add link" wale links apne links se badlo.

## GitHub par upload
1. github.com par New repository banao (naam kuch bhi, e.g. `my-website`), Public rakho.
2. "uploading an existing file" par click karo aur folder ke andar ki saari files drag-drop karo (folder ke andar wali files, folder khud nahi). `.nojekyll` aur `CNAME` bhi include honi chahiye.
3. Commit karo.
4. Repo me Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / root → Save.
5. 1-2 minute baad site `https://USERNAME.github.io/my-website/` par live hogi.

## Domain connect karna
1. Domain kisi registrar se kharido (Namecheap, GoDaddy, Cloudflare etc).
2. Registrar ke DNS settings mein ye records add karo:

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | USERNAME.github.io |

3. GitHub repo → Settings → Pages → Custom domain mein apna domain likho → Save.
4. DNS check pass hone ke baad "Enforce HTTPS" ON karo.
5. DNS ko 10 minute se 24 ghante lag sakte hain.

Agar GitHub ke IPs badal gaye hon to docs.github.com par "Managing a custom domain for your GitHub Pages site" check kar lena.
