# 🌐 Production Cloud & Custom Domain Deployment

This guide provides 3 simple ways to host JobCraft live on your own custom domain or free cloud instances:

---

## ⚡ Option 1: 1-Click Free Cloud Deployment (Render.com)

Render automatically manages zero-downtime deploys and provisions free SSL for custom domains!

1. Push your repository to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New +** ➔ **Blueprint**.
3. Select this repository (it automatically reads [`render.yaml`](../render.yaml)).
4. Under **Custom Domains** in your Render service settings:
   - Add `yourdomain.com`
   - Add `www.yourdomain.com`
5. Update your domain DNS settings (at GoDaddy, Namecheap, Cloudflare, or Hostinger):

| Type | Name / Host | Target / Value | TTL |
| :---: | :---: | :---: | :---: |
| **A** | `@` | Render IP (provided in Render dashboard) | Auto / 300 |
| **CNAME** | `www` | `jobcraft.onrender.com` | Auto / 300 |

*Render will automatically issue a free Let's Encrypt SSL certificate within 2 minutes!*

---

## 🚀 Option 2: Linux VPS (Ubuntu / Debian / DigitalOcean / AWS)

If running on a VPS (Virtual Private Server):

### 1. Install Node.js & PM2
```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 (Process Manager to keep JobCraft running forever)
sudo npm install -g pm2
```

### 2. Clone and Start JobCraft
```bash
git clone https://github.com/<your-username>/JobCraft.git
cd JobCraft
cp .env.example .env
pm2 start web/server.js --name "jobcraft"
pm2 save
pm2 startup
```

### 3. Setup Nginx & Free SSL
```bash
# Copy the provided pre-configured Nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/yourdomain.com
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Issue free SSL with Certbot
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🛡️ Option 3: Cloudflare Proxy (Recommended for speed & DDoS defense)

1. Add `yourdomain.com` to your free Cloudflare account.
2. In Cloudflare DNS, add:
   - `CNAME` for `@` pointing to your deployment URL (e.g., `jobcraft.onrender.com`) with Proxy enabled (Orange Cloud ☁️).
   - `CNAME` for `www` pointing to `@` with Proxy enabled.
3. Under Cloudflare SSL/TLS, set encryption mode to **Full (strict)**.
4. Your site will immediately be live on **https://yourdomain.com** with global CDN caching and DDoS protection!
