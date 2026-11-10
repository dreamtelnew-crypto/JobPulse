# Python script to update index.html, app.js, and admin.html for JobPulse AI
import os
import re

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def update_index_html():
    idx_path = os.path.join(root_dir, 'web', 'public', 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update Title
    html = re.sub(r'<title>.*?</title>', '<title>JobPulse AI — Autonomous AI Career Engine &amp; Job Studio</title>', html)

    # 2. Update Brand in Navbar
    brand_old_pattern = r'<div class="brand">.*?</div>\s*</div>\s*</div>'
    new_brand = '''<div class="brand">
          <div class="brand-icon-wrapper">
            <div class="brand-glow"></div>
            <div class="brand-icon">
              <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
                <defs>
                  <linearGradient id="jpNavGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00f2fe"/>
                    <stop offset="40%" stop-color="#38bdf8"/>
                    <stop offset="80%" stop-color="#6366f1"/>
                    <stop offset="100%" stop-color="#c084fc"/>
                  </linearGradient>
                </defs>
                <polygon points="128,18 206,50 238,128 206,206 128,238 50,206 18,128 50,50" fill="rgba(15,23,42,0.85)" stroke="url(#jpNavGrad)" stroke-width="6" stroke-linejoin="round"/>
                <path d="M42 136 L72 136 L86 154 L102 96 L118 168 L138 106 L154 148 L170 126 L184 136 L214 136" stroke="url(#jpNavGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
                <path d="M128 52 L128 112 L92 128 Z" fill="url(#jpNavGrad)"/>
                <path d="M128 52 L164 128 L128 112 Z" fill="#f43f5e"/>
                <path d="M128 112 L86 130 L66 162 L116 144 Z" fill="url(#jpNavGrad)" opacity="0.85"/>
                <path d="M128 112 L140 144 L190 162 L170 130 Z" fill="#818cf8" opacity="0.85"/>
                <path d="M128 154 L98 178 L128 210 L158 178 Z" fill="url(#jpNavGrad)"/>
                <polygon points="128,120 134,132 128,144 122,132" fill="#ffffff"/>
              </svg>
            </div>
          </div>
          <div class="brand-meta">
            <div class="brand-title">JobPulse <span class="brand-pro-pill">AI</span></div>
          </div>
        </div>'''

    # Replace brand
    start_brand = html.find('<div class="brand">')
    if start_brand != -1:
        end_brand = html.find('</div>\n          </div>\n        </div>', start_brand)
        if end_brand == -1:
            end_brand = html.find('</div>\r\n          </div>\r\n        </div>', start_brand)
        if end_brand != -1:
            end_brand += len('</div>\n          </div>\n        </div>')
            html = html[:start_brand] + new_brand + html[end_brand:]

    # 3. Insert Theme Switcher and Backend Pill into nav-status
    nav_status_needle = '<div class="nav-status">'
    nav_status_replacement = '''<div class="nav-status">
          <!-- Multi-Theme Switcher -->
          <div class="theme-switcher-wrapper">
            <button type="button" class="btn btn-theme-toggle" id="btnThemeToggle" title="Switch Theme (Dark / Light / Cyber / Amethyst)">
              <span id="themeToggleIcon">🌙</span>
              <span id="themeToggleName" class="theme-name-text">Obsidian</span>
            </button>
            <div class="theme-dropdown-menu" id="themeDropdownMenu" style="display: none;">
              <button type="button" class="theme-dropdown-item active" data-theme="dark">
                <span class="theme-dot" style="background: #6366f1;"></span>
                <span>Obsidian Dark</span>
              </button>
              <button type="button" class="theme-dropdown-item" data-theme="light">
                <span class="theme-dot" style="background: #38bdf8;"></span>
                <span>Aurora Light</span>
              </button>
              <button type="button" class="theme-dropdown-item" data-theme="cyber">
                <span class="theme-dot" style="background: #10b981;"></span>
                <span>Cyber Emerald</span>
              </button>
              <button type="button" class="theme-dropdown-item" data-theme="amethyst">
                <span class="theme-dot" style="background: #c084fc;"></span>
                <span>Royal Amethyst</span>
              </button>
            </div>
          </div>

          <!-- Cloud Backend Config (for GitHub Pages & Remote Server Connection) -->
          <button type="button" class="btn btn-backend-status" id="btnBackendModal" title="Cloud Server Connection Status">
            <span class="backend-status-dot" id="backendStatusDot"></span>
            <span id="backendStatusText">Live Server</span>
          </button>'''

    if 'theme-switcher-wrapper' not in html:
        html = html.replace(nav_status_needle, nav_status_replacement)

    # 4. Insert Backend Connection Modal before </body>
    backend_modal = '''    <!-- Cloud Backend Connection Modal (Allows GitHub Pages or custom host to connect to Render Backend) -->
    <div id="backendConfigModal" class="modal-overlay" style="display: none;">
      <div class="modal-card" style="max-width: 480px; width: 95%;">
        <div class="modal-header-row">
          <div style="font-size: 13px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
            <span>☁️ Cloud Backend &amp; Deployment Settings</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="btnCloseBackendModal">✕ Close</button>
        </div>
        <div style="margin-top: 14px;">
          <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px; line-height: 1.5;">
            JobPulse AI connects to your live server on Render, Docker, or Localhost. If hosting this interface statically on <strong>GitHub Pages</strong>, enter your live Render backend URL below to enable real-time multi-portal scrapers and Gemini AI.
          </p>
          <div class="form-group" style="margin-bottom: 14px;">
            <label style="font-size: 11px; font-weight: 700; color: var(--text-main); margin-bottom: 5px; display: block;">Backend Server URL</label>
            <input type="url" id="inputBackendUrl" class="input-text" placeholder="e.g. https://jobpulse-ai.onrender.com (or empty for localhost)" style="width: 100%; box-sizing: border-box;">
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">Leave empty to connect to the current origin (e.g. http://localhost:3000).</div>
          </div>
          <div id="backendStatusDetail" style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-main); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: var(--text-muted);">Connection Status:</span>
              <strong id="backendHealthText" style="color: #10b981;">Checking...</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Active Service:</span>
              <span id="backendServiceName" style="font-family: var(--font-mono); color: var(--text-dim);">JobPulse AI Cloud Engine</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm" id="btnTestBackend">⚡ Test Ping</button>
            <button type="button" class="btn btn-primary btn-sm" id="btnSaveBackend">✓ Save &amp; Connect</button>
          </div>
        </div>
      </div>
    </div>
'''
    if 'backendConfigModal' not in html:
        html = html.replace('  <script src="app.js"></script>', backend_modal + '\n  <script src="app.js"></script>')

    # 5. Rebrand text throughout index.html
    html = html.replace('JobCraft AI v2.0 • Autonomous Career Engine &amp; Studio', 'JobPulse AI v2.0 • Autonomous Career Engine &amp; Studio')
    html = html.replace('JobCraft Shield', 'JobPulse Shield')
    html = html.replace('JobCraft', 'JobPulse AI')
    html = html.replace('JobCopilot Pro', 'JobPulse Pro')
    html = html.replace('JobCopilot', 'JobPulse')

    with open(idx_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated index.html with JobPulse AI branding, Theme Switcher, and Cloud Backend modal.')

def update_admin_html():
    admin_path = os.path.join(root_dir, 'web', 'public', 'admin.html')
    if os.path.exists(admin_path):
        with open(admin_path, 'r', encoding='utf-8') as f:
            code = f.read()
        code = code.replace('JobCraft', 'JobPulse AI')
        code = code.replace('JobCopilot', 'JobPulse')
        code = code.replace('jobcopilot-licenses', 'jobpulse-licenses')
        with open(admin_path, 'w', encoding='utf-8') as f:
            f.write(code)
        print('Updated admin.html')

if __name__ == '__main__':
    update_index_html()
    update_admin_html()
