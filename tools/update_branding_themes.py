# Script to update branding and theme system for JobPulse AI
import os
import re

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def update_style_css():
    css_path = os.path.join(root_dir, 'web', 'public', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # Locate :root section up to html {
    idx_root = css.find(':root {')
    idx_html = css.find('html {')
    if idx_root != -1 and idx_html != -1:
        root_old = css[idx_root:idx_html]
        multi_theme_css = """/* ========================================================================= */
/* JobPulse AI — Multi-Theme SaaS Design System                              */
/* Themes: Obsidian Dark (Default), Aurora Light, Cyber Emerald, Royal Amethyst */
/* ========================================================================= */

:root, [data-theme="dark"] {
  --font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Obsidian Luxury Palette (Dark) */
  --bg-deep: #07080c;
  --bg-surface: #0d0f17;
  --bg-card: rgba(16, 19, 29, 0.72);
  --bg-card-hover: rgba(23, 27, 42, 0.85);
  --bg-input: rgba(10, 12, 18, 0.85);
  --bg-navbar: rgba(7, 8, 12, 0.85);
  --bg-nav-capsule: rgba(13, 15, 23, 0.75);
  --bg-btn-hover: rgba(255, 255, 255, 0.06);
  --bg-body-radial-1: rgba(99, 102, 241, 0.16);
  --bg-body-radial-2: rgba(168, 85, 247, 0.08);

  /* Borders & Glass Dividers */
  --border-main: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-focus: #6366f1;
  --border-glow: rgba(99, 102, 241, 0.35);

  /* High-Contrast Typographic Hierarchy */
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --text-muted: #64748b;

  /* Accent Vibrance */
  --accent-primary: #6366f1;
  --accent-primary-hover: #4f46e5;
  --accent-purple: #8b5cf6;
  --accent-cyan: #38bdf8;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;

  /* Radii & Shadows */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 25px rgba(99, 102, 241, 0.25);
}

[data-theme="light"] {
  /* Aurora Daylight Palette (Light) */
  --bg-deep: #f8fafc;
  --bg-surface: #ffffff;
  --bg-card: rgba(255, 255, 255, 0.95);
  --bg-card-hover: #ffffff;
  --bg-input: #ffffff;
  --bg-navbar: rgba(255, 255, 255, 0.92);
  --bg-nav-capsule: rgba(241, 245, 249, 0.95);
  --bg-btn-hover: rgba(15, 23, 42, 0.06);
  --bg-body-radial-1: rgba(99, 102, 241, 0.08);
  --bg-body-radial-2: rgba(56, 189, 248, 0.08);

  --border-main: rgba(15, 23, 42, 0.12);
  --border-subtle: rgba(15, 23, 42, 0.06);
  --border-focus: #4f46e5;
  --border-glow: rgba(79, 70, 229, 0.25);

  --text-main: #0f172a;
  --text-dim: #334155;
  --text-muted: #64748b;

  --accent-primary: #4f46e5;
  --accent-primary-hover: #4338ca;
  --accent-purple: #7c3aed;
  --accent-cyan: #0284c7;
  --accent-emerald: #059669;
  --accent-amber: #d97706;
  --accent-rose: #e11d48;

  --shadow-card: 0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
  --shadow-glow: 0 0 20px rgba(79, 70, 229, 0.15);
}

[data-theme="cyber"] {
  /* Cyber Emerald / Matrix Neon Palette */
  --bg-deep: #030806;
  --bg-surface: #06140e;
  --bg-card: rgba(6, 22, 16, 0.85);
  --bg-card-hover: rgba(9, 32, 23, 0.95);
  --bg-input: rgba(4, 15, 10, 0.95);
  --bg-navbar: rgba(3, 8, 6, 0.90);
  --bg-nav-capsule: rgba(5, 18, 13, 0.85);
  --bg-btn-hover: rgba(16, 185, 129, 0.12);
  --bg-body-radial-1: rgba(16, 185, 129, 0.18);
  --bg-body-radial-2: rgba(6, 182, 212, 0.12);

  --border-main: rgba(16, 185, 129, 0.22);
  --border-subtle: rgba(16, 185, 129, 0.10);
  --border-focus: #10b981;
  --border-glow: rgba(16, 185, 129, 0.4);

  --text-main: #f0fdf4;
  --text-dim: #bbf7d0;
  --text-muted: #86efac;

  --accent-primary: #10b981;
  --accent-primary-hover: #059669;
  --accent-purple: #34d399;
  --accent-cyan: #06b6d4;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;

  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 25px rgba(16, 185, 129, 0.3);
}

[data-theme="amethyst"] {
  /* Royal Amethyst Palette */
  --bg-deep: #090514;
  --bg-surface: #120924;
  --bg-card: rgba(22, 12, 42, 0.82);
  --bg-card-hover: rgba(32, 17, 60, 0.95);
  --bg-input: rgba(15, 8, 28, 0.95);
  --bg-navbar: rgba(9, 5, 20, 0.90);
  --bg-nav-capsule: rgba(18, 10, 34, 0.85);
  --bg-btn-hover: rgba(168, 85, 247, 0.12);
  --bg-body-radial-1: rgba(168, 85, 247, 0.20);
  --bg-body-radial-2: rgba(236, 72, 153, 0.14);

  --border-main: rgba(168, 85, 247, 0.24);
  --border-subtle: rgba(168, 85, 247, 0.12);
  --border-focus: #c084fc;
  --border-glow: rgba(192, 132, 252, 0.4);

  --text-main: #faf5ff;
  --text-dim: #e9d5ff;
  --text-muted: #d8b4fe;

  --accent-primary: #a855f7;
  --accent-primary-hover: #9333ea;
  --accent-purple: #c084fc;
  --accent-cyan: #38bdf8;
  --accent-emerald: #34d399;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;

  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 25px rgba(168, 85, 247, 0.3);
}

"""
        css = css[:idx_root] + multi_theme_css + css[idx_html:]

    # Update body radial gradients
    css = css.replace("rgba(99, 102, 241, 0.16)", "var(--bg-body-radial-1)")
    css = css.replace("rgba(168, 85, 247, 0.08)", "var(--bg-body-radial-2)")

    # Update navbar background
    css = css.replace("background: rgba(7, 8, 12, 0.82);", "background: var(--bg-navbar);")
    css = css.replace("background: rgba(13, 15, 23, 0.75);", "background: var(--bg-nav-capsule);")

    # Add theme switcher styles and light/cyber overrides
    theme_extras = """
/* ========================================================================= */
/* THEME SWITCHER & CLOUD STATUS COMPONENT                                   */
/* ========================================================================= */
.theme-switcher-wrapper {
  position: relative;
  display: inline-block;
}

.btn-theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-main);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  backdrop-filter: blur(10px);
}

.btn-theme-toggle:hover {
  border-color: var(--border-focus);
  background: var(--bg-card-hover);
  box-shadow: 0 0 12px var(--border-glow);
  transform: translateY(-1px);
}

.theme-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 175px;
  background: var(--bg-surface);
  border: 1px solid var(--border-main);
  border-radius: var(--radius-md);
  padding: 6px;
  box-shadow: var(--shadow-card), 0 10px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(16px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 3px;
  animation: fadeInDown 0.15s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.theme-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: 11.5px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  font-family: inherit;
}

.theme-dropdown-item:hover {
  background: var(--bg-btn-hover);
  color: var(--text-main);
}

.theme-dropdown-item.active {
  background: rgba(99, 102, 241, 0.18);
  color: var(--text-main);
}

.theme-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Cloud Backend Status Button */
.btn-backend-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border-main);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-backend-status:hover {
  border-color: var(--accent-cyan);
  background: var(--bg-card-hover);
}

.backend-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.backend-status-dot.offline {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

/* Light Theme Component Overrides */
[data-theme="light"] body {
  background-color: var(--bg-deep);
  color: var(--text-main);
}

[data-theme="light"] .navbar {
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(15, 23, 42, 0.10);
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .nav-links {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

[data-theme="light"] .nav-btn {
  color: #475569;
}

[data-theme="light"] .nav-btn:hover {
  color: #0f172a;
  background: #e2e8f0;
}

[data-theme="light"] .nav-btn.active {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #ffffff;
  border-color: #4338ca;
}

[data-theme="light"] .brand-title {
  color: #0f172a;
}

[data-theme="light"] .card,
[data-theme="light"] .search-card,
[data-theme="light"] .detail-card,
[data-theme="light"] .radar-table-wrap,
[data-theme="light"] .custom-paste-card,
[data-theme="light"] .interview-card,
[data-theme="light"] .upskill-card,
[data-theme="light"] .tracker-card,
[data-theme="light"] .profile-card,
[data-theme="light"] .salary-box,
[data-theme="light"] .modal-card,
[data-theme="light"] .tutorial-card,
[data-theme="light"] .tut-ext-card,
[data-theme="light"] .stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
}

[data-theme="light"] input,
[data-theme="light"] select,
[data-theme="light"] textarea {
  background: #ffffff;
  color: #0f172a;
  border-color: #cbd5e1;
}

[data-theme="light"] input::placeholder,
[data-theme="light"] textarea::placeholder {
  color: #94a3b8;
}

[data-theme="light"] .tut-mockup {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #334155;
}

[data-theme="light"] .radar-row {
  border-color: rgba(15, 23, 42, 0.06);
}

[data-theme="light"] .radar-row:hover {
  background: rgba(99, 102, 241, 0.05);
}

[data-theme="light"] .radar-job-title {
  color: #0f172a;
}

[data-theme="light"] .radar-company {
  color: #475569;
}

[data-theme="light"] .table-head th {
  color: #334155;
  border-bottom-color: #cbd5e1;
}

[data-theme="light"] .credit-pill {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

[data-theme="light"] footer {
  border-top-color: rgba(15, 23, 42, 0.10) !important;
}

[data-theme="light"] footer span {
  color: #475569 !important;
}

[data-theme="light"] footer span:first-child {
  color: #0f172a !important;
}

/* Cyber Emerald Overrides */
[data-theme="cyber"] .nav-btn.active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(6, 182, 212, 0.35));
  border-color: #10b981;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.35);
}

/* Royal Amethyst Overrides */
[data-theme="amethyst"] .nav-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(236, 72, 153, 0.35));
  border-color: #c084fc;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.35);
}
"""
    if '.btn-theme-toggle' not in css:
        css = css + '\n' + theme_extras

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print('Updated style.css with themes.')

def update_server_js():
    server_path = os.path.join(root_dir, 'web', 'server.js')
    with open(server_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # Rebrand constants
    code = code.replace("JobCraft — Autonomous AI Career Engine", "JobPulse AI — Autonomous AI Career Engine")
    code = code.replace("JOBCRAFT_ADMIN_VAULT_2026", "JOBPULSE_ADMIN_VAULT_2026")
    code = code.replace("JOBCRAFT_HWID_SALT_VAULT_2026", "JOBPULSE_HWID_SALT_VAULT_2026")
    code = code.replace("JobCraft Studio", "JobPulse Studio")
    code = code.replace("service: 'JobCraft AI Cloud Engine'", "service: 'JobPulse AI Cloud Engine'")
    code = code.replace("🚀 JobCraft AI Web UI is LIVE at:", "🚀 JobPulse AI Web UI is LIVE at:")

    # Static file serving for any file in public/ (svg, png, ico, etc.)
    static_needle = "  // Static Assets\n  if (pathname === '/' || pathname === '/index.html') {"
    if static_needle not in code:
        static_needle = "  // Static Assets\r\n  if (pathname === '/' || pathname === '/index.html') {"
    
    enhanced_static = """  // Static Assets (Auto-Serves html, css, js, svg, png, ico from public/)
  const publicDir = path.join(__dirname, 'public');
  const safePath = path.normalize(path.join(publicDir, pathname === '/' ? 'index.html' : pathname.slice(1)));
  if (safePath.startsWith(publicDir) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeMap = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.ico': 'image/x-icon',
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.zip': 'application/zip'
    };
    const mime = mimeMap[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    return fs.createReadStream(safePath).pipe(res);
  }
"""
    if "safePath.startsWith(publicDir)" not in code:
        code = code.replace("  // Static Assets", enhanced_static + "\n  // Legacy Static Handlers")

    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Updated server.js with JobPulse AI branding and enhanced static file serving.')

def update_package_jsons():
    # Root package.json
    pkg_path = os.path.join(root_dir, 'package.json')
    if os.path.exists(pkg_path):
        with open(pkg_path, 'r', encoding='utf-8') as f:
            pkg = f.read()
        pkg = pkg.replace('"name": "jobcraft"', '"name": "jobpulse-ai"')
        pkg = pkg.replace('JobCraft', 'JobPulse AI')
        pkg = pkg.replace('"jobcraft"', '"jobpulse-ai"')
        with open(pkg_path, 'w', encoding='utf-8') as f:
            f.write(pkg)
        print('Updated root package.json')

    # Web package.json
    web_pkg_path = os.path.join(root_dir, 'web', 'package.json')
    if os.path.exists(web_pkg_path):
        with open(web_pkg_path, 'r', encoding='utf-8') as f:
            wpkg = f.read()
        wpkg = wpkg.replace('"jobcraft-studio"', '"jobpulse-studio"')
        wpkg = wpkg.replace('JobCraft', 'JobPulse AI')
        with open(web_pkg_path, 'w', encoding='utf-8') as f:
            f.write(wpkg)
        print('Updated web package.json')

def update_extension():
    # manifest.json
    man_path = os.path.join(root_dir, 'extension', 'manifest.json')
    if os.path.exists(man_path):
        with open(man_path, 'r', encoding='utf-8') as f:
            man = f.read()
        man = man.replace('JobCraft — Autonomous AI Career Suite', 'JobPulse AI — Autonomous Career Suite')
        man = man.replace('powered by JobCraft', 'powered by JobPulse AI')
        man = man.replace('Open JobCraft Studio', 'Open JobPulse AI Studio')
        with open(man_path, 'w', encoding='utf-8') as f:
            f.write(man)
        print('Updated extension manifest.json')

    # sidepanel.html
    sp_path = os.path.join(root_dir, 'extension', 'sidepanel.html')
    if os.path.exists(sp_path):
        with open(sp_path, 'r', encoding='utf-8') as f:
            sp = f.read()
        sp = sp.replace('JobCraft — Autonomous AI Studio', 'JobPulse AI — Autonomous AI Studio')
        sp = sp.replace('JOBCRAFT <span class="badge-studio">AI</span>', 'JOBPULSE <span class="badge-studio">AI</span>')
        with open(sp_path, 'w', encoding='utf-8') as f:
            f.write(sp)
        print('Updated extension sidepanel.html')

    # sidepanel.js
    sp_js_path = os.path.join(root_dir, 'extension', 'sidepanel.js')
    if os.path.exists(sp_js_path):
        with open(sp_js_path, 'r', encoding='utf-8') as f:
            sp_js = f.read()
        sp_js = sp_js.replace("localStorage.getItem('jobcraft_server_url')", "localStorage.getItem('jobpulse_server_url') || localStorage.getItem('jobcraft_server_url')")
        with open(sp_js_path, 'w', encoding='utf-8') as f:
            f.write(sp_js)
        print('Updated extension sidepanel.js')

if __name__ == '__main__':
    update_style_css()
    update_server_js()
    update_package_jsons()
    update_extension()
    print('All core theme and branding updates executed successfully!')
