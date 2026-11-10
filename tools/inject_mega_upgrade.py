# Complete Mega-Upgrade Injector for JobPulse AI
import os
import re

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def create_pwa_files():
    manifest_content = """{
  "name": "JobPulse AI — Autonomous Career Studio",
  "short_name": "JobPulse AI",
  "description": "Autonomous AI Career Engine, Real-time Job Radar & Application Studio",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#07080c",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "favicon.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}"""
    with open(os.path.join(root_dir, 'web', 'public', 'manifest.webmanifest'), 'w', encoding='utf-8') as f:
        f.write(manifest_content)

    sw_content = """// JobPulse AI Service Worker (Offline PWA Caching)
const CACHE_NAME = 'jobpulse-cache-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './logo.svg',
  './logo.png',
  './favicon.ico',
  './favicon.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});"""
    with open(os.path.join(root_dir, 'web', 'public', 'sw.js'), 'w', encoding='utf-8') as f:
        f.write(sw_content)
    print('Created PWA files.')

def update_html():
    idx_path = os.path.join(root_dir, 'web', 'public', 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Add manifest link in head if missing
    if 'manifest.webmanifest' not in html:
        html = html.replace('</head>', '  <link rel="manifest" href="manifest.webmanifest">\n</head>')

    # Add Hacker News to selectPortal
    hn_option = '<option value="hackernews">🟠 Hacker News (YC Tech &amp; High-Yield Remote)</option>'
    if 'hackernews' not in html:
        html = html.replace('<option value="arbeitnow">', hn_option + '\n                  <option value="arbeitnow">')

    # Add Recruiter DM button in tabDetail
    outreach_btn = '<button class="btn btn-secondary" id="btnOutreachFromDetail" style="background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">✉️ Recruiter DM &amp; Outreach</button>'
    if 'btnOutreachFromDetail' not in html:
        html = html.replace('<button class="btn btn-primary" id="btnTailorFromDetail">', outreach_btn + '\n                <button class="btn btn-primary" id="btnTailorFromDetail">')

    # Add Keyword Heatmap Card in tabDetail right after detail-header-card
    heatmap_card = '''            <!-- Live JD vs Profile Keyword Heatmap & Auto-Injector -->
            <div class="card keyword-heatmap-card" style="margin-top: 18px; margin-bottom: 20px;">
              <div class="card-toolbar" style="margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 16px;">🔍</span>
                  <h3 style="font-size: 13.5px; font-weight: 700;">JD vs Profile Keyword Heatmap</h3>
                </div>
                <button type="button" class="btn btn-sm btn-primary" id="btnAutoInjectKeywords">
                  ⚡ Auto-Inject Missing Keywords
                </button>
              </div>
              <p class="subtitle" style="font-size: 11.5px; margin-bottom: 12px;">Real-time comparison between required job competencies and your active profile keywords:</p>
              <div class="heatmap-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
                <div class="heatmap-box matched-box" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 12px;">
                  <div style="color: #10b981; font-weight: 700; font-size: 11.5px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span>✓ Matched Keywords</span>
                    <span id="heatmapMatchedCount" class="badge-num">6 matched</span>
                  </div>
                  <div class="chip-cloud" id="heatmapMatchedCloud" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                </div>
                <div class="heatmap-box missing-box" style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: 8px; padding: 12px;">
                  <div style="color: #f43f5e; font-weight: 700; font-size: 11.5px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                    <span>⚠ Missing / High-Priority Keywords</span>
                    <span id="heatmapMissingCount" class="badge-num" style="color: #f43f5e;">2 missing</span>
                  </div>
                  <div class="chip-cloud" id="heatmapMissingCloud" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                </div>
              </div>
            </div>'''
    
    if 'keyword-heatmap-card' not in html:
        det_header_end = '<div class="card detail-header-card">'
        html = html.replace(det_header_end, det_header_end + '\n' + heatmap_card)

    # In tabCV: Add ATS Template Picker & Direct PDF & Recruiter Pitch Email button
    cv_toolbar_needle = '<div class="card-toolbar">'
    template_picker = '''            <!-- ATS Template Switcher & Score Bar -->
            <div class="ats-template-bar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-main); padding: 8px 14px; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 11px; font-weight: 700; color: var(--text-dim);">ATS Template:</span>
                <div class="template-btns" style="display: flex; gap: 4px;">
                  <button type="button" class="btn-template-choice active" data-template="faang">FAANG Standard</button>
                  <button type="button" class="btn-template-choice" data-template="executive">Executive Modern</button>
                  <button type="button" class="btn-template-choice" data-template="minimal">Minimalist Tech</button>
                  <button type="button" class="btn-template-choice" data-template="startup">Startup Builder</button>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="btn btn-outline btn-sm" id="btnOpenOutreachFromCv">✉️ Recruiter Email</button>
                <button type="button" class="btn btn-primary btn-sm" id="btnDownloadPdfDirect">📥 Download Clean PDF</button>
              </div>
            </div>'''

    if 'ats-template-bar' not in html:
        html = html.replace('<!-- ATS Pre-Flight Verification Scorecard -->', template_picker + '\n\n            <!-- ATS Pre-Flight Verification Scorecard -->')

    # In tabInterview: Add Voice AI Mock Interview Console
    voice_console = '''          <!-- Interactive Voice AI Mock Interview Studio -->
          <div class="card voice-studio-card" style="margin-bottom: 20px; border: 1px solid rgba(99, 102, 241, 0.35); background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08));">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 26px;">🎙️</span>
                <div>
                  <h3 style="font-size: 14.5px; font-weight: 700; color: #fff;">Interactive Voice AI Mock Interviewer</h3>
                  <p style="font-size: 11.5px; color: var(--text-dim); margin-top: 2px;">AI reads question aloud • Answer into microphone • Real-time STAR evaluation &amp; pacing feedback</p>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn btn-secondary btn-sm" id="btnVoiceSpeakQuestion">
                  🔊 Speak Question
                </button>
                <button type="button" class="btn btn-primary btn-sm" id="btnVoiceToggleMic">
                  🎤 Start Speaking Answer
                </button>
              </div>
            </div>

            <!-- Voice Equalizer Animation -->
            <div id="voiceWaveformContainer" style="display: none; align-items: center; justify-content: center; gap: 5px; height: 38px; margin-bottom: 12px; background: rgba(0,0,0,0.3); border-radius: 8px;">
              <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
            </div>

            <!-- Real-Time Speech Transcript -->
            <div class="form-group" style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                <span>Live Speech Transcript:</span>
                <span id="voiceWordCount" style="font-family: var(--font-mono); color: #38bdf8;">0 words • 0 WPM</span>
              </div>
              <textarea id="voiceTranscriptArea" class="input-control textarea-control" rows="3" placeholder="Click 'Start Speaking Answer' and speak into your microphone, or type your answer here..."></textarea>
            </div>

            <!-- Live Coaching Evaluation Panel -->
            <div id="voiceEvaluationPanel" style="display: none; background: rgba(0,0,0,0.35); border: 1px solid var(--border-main); border-radius: 8px; padding: 12px; font-size: 11.5px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <div style="font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px;">
                  <span>🎯 AI Answer Score:</span>
                  <span id="voiceScoreBadge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 2px 8px; border-radius: 12px; font-weight: 800;">92 / 100 (Pass)</span>
                </div>
                <div style="display: flex; gap: 14px; font-size: 11px;">
                  <span>Filler Words: <strong id="voiceFillerCount" style="color: #fbbf24;">0 detected</strong></span>
                  <span>STAR Method: <strong id="voiceStarStatus" style="color: #10b981;">Complete</strong></span>
                </div>
              </div>
              <div id="voiceFeedbackText" style="color: var(--text-dim); line-height: 1.5;">
                Solid response! You clearly structured the situation and highlighted technical ownership.
              </div>
            </div>
          </div>'''

    if 'voice-studio-card' not in html:
        html = html.replace('<!-- Loading State -->', voice_console + '\n\n          <!-- Loading State -->')

    # In tabTracker: Add Offer Comparison & Negotiation button
    offer_btn = '<button class="btn btn-primary" id="btnOpenOfferMatrixModal" style="background: linear-gradient(135deg, #059669, #10b981);">💰 Salary Negotiation &amp; Offer Matrix</button>'
    if 'btnOpenOfferMatrixModal' not in html:
        html = html.replace('<button class="btn btn-secondary" id="btnCopyAllCsv">', offer_btn + '\n              <button class="btn btn-secondary" id="btnCopyAllCsv">')

    # Add Modals before </body>
    modals_html = '''    <!-- Modal 1: AI Recruiter Outreach & LinkedIn DM Generator -->
    <div id="outreachModal" class="modal-overlay" style="display: none;">
      <div class="modal-card" style="max-width: 620px; width: 95%;">
        <div class="modal-header-row">
          <div style="font-size: 13.5px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 8px;">
            <span>✉️ AI Recruiter Outreach &amp; LinkedIn DM Generator</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="btnCloseOutreachModal">✕ Close</button>
        </div>

        <div style="margin-top: 14px;">
          <!-- Outreach Tabs -->
          <div class="outreach-tab-row" style="display: flex; gap: 6px; margin-bottom: 14px; border-bottom: 1px solid var(--border-main); padding-bottom: 8px;">
            <button type="button" class="outreach-tab-btn active" data-tab="note">LinkedIn Note (&lt;300 Chars)</button>
            <button type="button" class="outreach-tab-btn" data-tab="inmail">InMail / Pitch Email</button>
            <button type="button" class="outreach-tab-btn" data-tab="followup">3-Step Follow-Up Sequence</button>
          </div>

          <!-- Tab Content 1: LinkedIn Connection Note -->
          <div id="outreachTabNote" class="outreach-pane">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">
              <span>Personalized Connection Request:</span>
              <span id="charCountNote" style="font-family: var(--font-mono); color: #10b981;">248 / 300 Chars</span>
            </div>
            <textarea id="outreachNoteText" class="input-control textarea-control" rows="4" style="font-size: 12px; margin-bottom: 12px;"></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <a href="#" target="_blank" id="btnSearchLinkedInRecruiters" class="btn btn-outline btn-sm">🔍 Find Recruiters on LinkedIn</a>
              <button type="button" class="btn btn-primary btn-sm" id="btnCopyOutreachNote">📋 Copy Note</button>
            </div>
          </div>

          <!-- Tab Content 2: InMail Pitch -->
          <div id="outreachTabInmail" class="outreach-pane" style="display: none;">
            <div class="form-group" style="margin-bottom: 8px;">
              <label style="font-size: 11px; font-weight: 700; color: var(--text-dim);">Subject Line:</label>
              <input type="text" id="outreachSubjectText" class="input-control" style="font-size: 12px; font-weight: 600;" value="Experienced Senior AI Engineer — Background &amp; Impact">
            </div>
            <textarea id="outreachInmailText" class="input-control textarea-control" rows="7" style="font-size: 12px; margin-bottom: 12px;"></textarea>
            <div style="display: flex; justify-content: flex-end;">
              <button type="button" class="btn btn-primary btn-sm" id="btnCopyOutreachInmail">📋 Copy Subject &amp; Pitch</button>
            </div>
          </div>

          <!-- Tab Content 3: Follow-Up Sequence -->
          <div id="outreachTabFollowup" class="outreach-pane" style="display: none;">
            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-main); border-radius: 8px; padding: 10px;">
                <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; margin-bottom: 4px;">Day 3 • Polite Bump</div>
                <div id="outreachFollowup1" style="font-size: 11.5px; color: var(--text-dim); line-height: 1.4;">Following up on my note regarding the engineering opening...</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-main); border-radius: 8px; padding: 10px;">
                <div style="font-weight: 700; color: #a855f7; font-size: 11.5px; margin-bottom: 4px;">Day 7 • Value-Add Project Bump</div>
                <div id="outreachFollowup2" style="font-size: 11.5px; color: var(--text-dim); line-height: 1.4;">Wanted to share a recent system benchmark our team achieved that parallels your roadmap...</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-main); border-radius: 8px; padding: 10px;">
                <div style="font-weight: 700; color: #10b981; font-size: 11.5px; margin-bottom: 4px;">Day 14 • Graceful Keep-in-Touch Wrap-Up</div>
                <div id="outreachFollowup3" style="font-size: 11.5px; color: var(--text-dim); line-height: 1.4;">I assume your current sprint is full, so I will pause my follow-ups. Let us stay connected here...</div>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button type="button" class="btn btn-primary btn-sm" id="btnCopyAllFollowups">📋 Copy Sequence</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 2: Salary Negotiation & Offer Matrix -->
    <div id="offerMatrixModal" class="modal-overlay" style="display: none;">
      <div class="modal-card" style="max-width: 680px; width: 95%;">
        <div class="modal-header-row">
          <div style="font-size: 13.5px; font-weight: 800; color: #10b981; display: flex; align-items: center; gap: 8px;">
            <span>💰 Salary Negotiation &amp; Offer Comparison Matrix</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" id="btnCloseOfferModal">✕ Close</button>
        </div>

        <div style="margin-top: 14px;">
          <p style="font-size: 11.5px; color: var(--text-dim); margin-bottom: 14px;">Compare compensation packages side-by-side and generate tactical AI counter-offer scripts to increase base pay or bonuses.</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
            <!-- Offer A Card -->
            <div style="background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: 12px;">
              <h4 style="color: #38bdf8; font-size: 12.5px; margin-bottom: 8px;">Offer A (Primary)</h4>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px;">
                <input type="text" id="offerACompany" class="input-control" placeholder="Company (e.g. Anthropic)" value="Anthropic">
                <input type="number" id="offerABase" class="input-control" placeholder="Base Salary ($)" value="190000">
                <input type="number" id="offerAEquity" class="input-control" placeholder="Equity / RSUs ($)" value="50000">
                <input type="number" id="offerABonus" class="input-control" placeholder="Annual Bonus ($)" value="20000">
                <div style="font-weight: 700; color: #38bdf8; margin-top: 4px;">Total Year 1: <span id="offerATotal" style="font-family: var(--font-mono);">$260,000</span></div>
              </div>
            </div>

            <!-- Offer B Card -->
            <div style="background: rgba(168, 85, 247, 0.06); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 8px; padding: 12px;">
              <h4 style="color: #c084fc; font-size: 12.5px; margin-bottom: 8px;">Offer B (Competing / Baseline)</h4>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px;">
                <input type="text" id="offerBCompany" class="input-control" placeholder="Company (e.g. Stripe)" value="Stripe">
                <input type="number" id="offerBBase" class="input-control" placeholder="Base Salary ($)" value="180000">
                <input type="number" id="offerBEquity" class="input-control" placeholder="Equity / RSUs ($)" value="65000">
                <input type="number" id="offerBBonus" class="input-control" placeholder="Annual Bonus ($)" value="15000">
                <div style="font-weight: 700; color: #c084fc; margin-top: 4px;">Total Year 1: <span id="offerBTotal" style="font-family: var(--font-mono);">$260,000</span></div>
              </div>
            </div>
          </div>

          <!-- Negotiation Strategy Script Generator -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-main); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-size: 12px; font-weight: 700; color: #fff;">Tactical Negotiation Counter-Offer Script</div>
              <div style="display: flex; gap: 6px;">
                <button type="button" class="btn-neg-strategy active" data-strategy="base">Base (+15%)</button>
                <button type="button" class="btn-neg-strategy" data-strategy="signing">Sign-On Bonus</button>
                <button type="button" class="btn-neg-strategy" data-strategy="remote">Remote / Flexibility</button>
              </div>
            </div>
            <textarea id="negotiationScriptText" class="input-control textarea-control" rows="5" style="font-size: 11.5px;"></textarea>
            <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
              <button type="button" class="btn btn-primary btn-sm" id="btnCopyNegotiationScript">📋 Copy Counter Script</button>
            </div>
          </div>
        </div>
      </div>
    </div>'''

    if 'outreachModal' not in html:
        html = html.replace('  <script src="app.js"></script>', modals_html + '\n  <script src="app.js"></script>')

    with open(idx_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated index.html with all Mega-Upgrade components.')

def update_css():
    css_path = os.path.join(root_dir, 'web', 'public', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    css_extras = """
/* ========================================================================= */
/* MEGA UPGRADE STYLES: Templates, Voice Studio, Heatmap & Matrix           */
/* ========================================================================= */

/* ATS Template Selector */
.btn-template-choice {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border-main);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-template-choice:hover {
  color: var(--text-main);
  background: var(--bg-btn-hover);
}

.btn-template-choice.active {
  background: var(--accent-primary);
  color: #fff;
  border-color: var(--accent-primary);
}

/* Resume Paper Template Variations */
.resume-paper.template-faang {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 30px 36px;
  line-height: 1.45;
}

.resume-paper.template-faang .sec-heading {
  border-bottom: 1.5px solid #0f172a;
  font-size: 11px;
  letter-spacing: 0.8px;
  font-weight: 800;
  margin-bottom: 8px;
}

.resume-paper.template-executive {
  font-family: 'Plus Jakarta Sans', Georgia, serif;
  padding: 34px 40px;
  background: #fbfbfb;
}

.resume-paper.template-executive .resume-head h1 {
  color: #1e1b4b;
  font-size: 24px;
}

.resume-paper.template-executive .sec-heading {
  border-bottom: 2px solid #3b82f6;
  color: #1e3a8a;
  font-size: 11.5px;
}

.resume-paper.template-minimal {
  font-family: 'JetBrains Mono', monospace;
  padding: 30px;
  font-size: 11px;
  line-height: 1.6;
}

.resume-paper.template-minimal .sec-heading {
  border-bottom: 1px dashed #64748b;
  font-size: 10.5px;
}

.resume-paper.template-startup {
  font-family: 'Inter', sans-serif;
  padding: 32px 38px;
}

.resume-paper.template-startup .resume-bullets li {
  margin-bottom: 7px;
}

/* Voice Equalizer Animation */
.wave-bar {
  display: inline-block;
  width: 4px;
  height: 12px;
  background: #38bdf8;
  border-radius: 2px;
  animation: wavePulse 1s ease-in-out infinite;
}

.wave-bar:nth-child(2) { animation-delay: 0.1s; height: 18px; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; height: 24px; background: #818cf8; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; height: 28px; background: #a855f7; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; height: 20px; }
.wave-bar:nth-child(6) { animation-delay: 0.5s; height: 26px; }
.wave-bar:nth-child(7) { animation-delay: 0.6s; height: 18px; background: #38bdf8; }
.wave-bar:nth-child(8) { animation-delay: 0.7s; height: 22px; }
.wave-bar:nth-child(9) { animation-delay: 0.8s; height: 14px; }
.wave-bar:nth-child(10) { animation-delay: 0.9s; height: 20px; }

@keyframes wavePulse {
  0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
  50% { transform: scaleY(1.3); opacity: 1; }
}

/* Outreach Tabs */
.outreach-tab-btn {
  background: transparent;
  color: var(--text-dim);
  border: none;
  font-size: 11.5px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.outreach-tab-btn:hover {
  color: var(--text-main);
  background: var(--bg-btn-hover);
}

.outreach-tab-btn.active {
  background: rgba(56, 189, 248, 0.18);
  color: #38bdf8;
}

/* Negotiation Strategy Pills */
.btn-neg-strategy {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border-main);
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}

.btn-neg-strategy.active {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border-color: #10b981;
}

/* Heatmap Chips */
.heatmap-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
}

.heatmap-chip.matched {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.heatmap-chip.missing {
  background: rgba(244, 63, 94, 0.15);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.3);
}
"""
    if 'btn-template-choice' not in css:
        css += '\n' + css_extras

    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print('Updated style.css with Mega-Upgrade styles.')

def update_js():
    js_path = os.path.join(root_dir, 'web', 'public', 'app.js')
    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    js_extras = """
  // =========================================================================
  // MEGA UPGRADE 1: ATS TEMPLATES & 1-CLICK PDF EXPORT
  // =========================================================================
  function initAtsTemplates() {
    const templateBtns = document.querySelectorAll('.btn-template-choice');
    const resumePaper = document.getElementById('resumePaper');
    const btnDownloadPdfDirect = document.getElementById('btnDownloadPdfDirect');

    templateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        templateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tmpl = btn.getAttribute('data-template');
        if (resumePaper) {
          resumePaper.className = 'resume-paper template-' + tmpl;
        }
        showToast(`✓ Switched to ${btn.textContent} Layout`);
      });
    });

    if (btnDownloadPdfDirect) {
      btnDownloadPdfDirect.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // =========================================================================
  // MEGA UPGRADE 2: RECRUITER OUTREACH & LINKEDIN DM GENERATOR
  // =========================================================================
  function generateOutreachCopy(job, profile) {
    const company = job ? job.company : "Target Company";
    const title = job ? job.title : "Software Engineer";
    const candidate = profile ? profile.fullName : "Candidate";

    // 1. LinkedIn Note (<300 Chars)
    const note = `Hi team! Noticed the ${title} opening at ${company}. Having architected distributed pipelines (99.98% uptime, 42% latency cut) with Python & cloud systems, I would love to connect and share how my technical background aligns with your engineering deliverables. Best, ${candidate}`;

    // 2. InMail / Pitch Email
    const subject = `Experienced ${title} — ${candidate} • Background & Technical Alignment`;
    const inmail = `Hi ${company} Hiring Team,\\n\\nI came across the ${title} position at ${company} and was immediately impressed by your technical vision. Given my background designing high-throughput distributed microservices, low-latency AI architectures, and scalable full-stack applications, I wanted to reach out directly.\\n\\nIn my recent deliverables:\\n• Engineered distributed semantic search microservices handling 2.5M daily queries with 99.98% uptime.\\n• Optimized inference pipelines by 42% utilizing quantized model caching and batched GPU execution.\\n• Built customer-facing production platforms serving 120k active developers.\\n\\nI would welcome a brief conversation to explore how my hands-on background can help accelerate your engineering roadmap. My resume is attached for review.\\n\\nBest regards,\\n${candidate}\\n${profile ? profile.email : 'candidate@email.com'} • ${profile ? profile.phone : '+1 234 567 8900'}`;

    // 3. Follow-Ups
    const f1 = `Hi again, following up on my note regarding the ${title} role at ${company}. Would love to connect briefly if your schedule allows!`;
    const f2 = `Hi team, sharing a quick technical insight: we recently cut pipeline latency by 42% using batched GPU inference, which directly maps to the scale targets in your job requirements. Eager to discuss!`;
    const f3 = `Hi team, I know you are in active recruitment sprints, so I will pause follow-ups here. I remain very enthusiastic about ${company} and hope to stay connected for future opportunities.`;

    return { note, subject, inmail, f1, f2, f3 };
  }

  function initOutreachModal() {
    const modal = document.getElementById('outreachModal');
    const btnOpenDetail = document.getElementById('btnOutreachFromDetail');
    const btnOpenCv = document.getElementById('btnOpenOutreachFromCv');
    const btnClose = document.getElementById('btnCloseOutreachModal');
    const tabBtns = document.querySelectorAll('.outreach-tab-btn');
    const noteText = document.getElementById('outreachNoteText');
    const inmailText = document.getElementById('outreachInmailText');
    const subjectText = document.getElementById('outreachSubjectText');
    const charCount = document.getElementById('charCountNote');
    const searchLink = document.getElementById('btnSearchLinkedInRecruiters');
    const btnCopyNote = document.getElementById('btnCopyOutreachNote');
    const btnCopyInmail = document.getElementById('btnCopyOutreachInmail');

    function populate() {
      const copy = generateOutreachCopy(activeJobDetail, candidateProfile);
      if (noteText) {
        noteText.value = copy.note;
        if (charCount) charCount.textContent = `${copy.note.length} / 300 Chars`;
      }
      if (subjectText) subjectText.value = copy.subject;
      if (inmailText) inmailText.value = copy.inmail;
      if (searchLink && activeJobDetail) {
        searchLink.href = `https://www.linkedin.com/search/results/people/?keywords=Recruiter%20${encodeURIComponent(activeJobDetail.company)}`;
      }
    }

    if (btnOpenDetail) {
      btnOpenDetail.addEventListener('click', () => {
        populate();
        if (modal) modal.style.display = 'flex';
      });
    }

    if (btnOpenCv) {
      btnOpenCv.addEventListener('click', () => {
        populate();
        if (modal) modal.style.display = 'flex';
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.outreach-pane').forEach(p => p.style.display = 'none');
        if (tab === 'note') document.getElementById('outreachTabNote').style.display = 'block';
        if (tab === 'inmail') document.getElementById('outreachTabInmail').style.display = 'block';
        if (tab === 'followup') document.getElementById('outreachTabFollowup').style.display = 'block';
      });
    });

    if (noteText && charCount) {
      noteText.addEventListener('input', () => {
        charCount.textContent = `${noteText.value.length} / 300 Chars`;
        charCount.style.color = noteText.value.length > 300 ? '#f43f5e' : '#10b981';
      });
    }

    if (btnCopyNote && noteText) {
      btnCopyNote.addEventListener('click', () => {
        navigator.clipboard.writeText(noteText.value);
        showToast('✓ Copied LinkedIn Connection Note!');
      });
    }

    if (btnCopyInmail && inmailText) {
      btnCopyInmail.addEventListener('click', () => {
        const full = `${subjectText.value}\\n\\n${inmailText.value}`;
        navigator.clipboard.writeText(full);
        showToast('✓ Copied Subject & InMail Pitch!');
      });
    }
  }

  // =========================================================================
  // MEGA UPGRADE 3: INTERACTIVE VOICE AI MOCK INTERVIEWER
  // =========================================================================
  function initVoiceMockInterviewer() {
    const btnSpeak = document.getElementById('btnVoiceSpeakQuestion');
    const btnMic = document.getElementById('btnVoiceToggleMic');
    const transcript = document.getElementById('voiceTranscriptArea');
    const waveform = document.getElementById('voiceWaveformContainer');
    const evalPanel = document.getElementById('voiceEvaluationPanel');
    const wordCountEl = document.getElementById('voiceWordCount');
    const fillerEl = document.getElementById('voiceFillerCount');
    const starEl = document.getElementById('voiceStarStatus');
    const scoreBadge = document.getElementById('voiceScoreBadge');
    const feedbackText = document.getElementById('voiceFeedbackText');

    let isRecording = false;
    let recognition = null;
    let startTime = null;

    if (btnSpeak) {
      btnSpeak.addEventListener('click', () => {
        const activeQ = document.querySelector('.prep-card-q') || { textContent: "How do you optimize distributed inference pipelines and mitigate hallucinations in high-throughput RAG systems?" };
        const textToSpeak = activeQ.textContent || "Tell me about a challenging technical bottleneck you resolved.";
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(textToSpeak);
          utter.rate = 1.0;
          utter.pitch = 1.0;
          window.speechSynthesis.speak(utter);
          showToast('🔊 AI Interviewer is asking the question...');
        } else {
          showToast('Speech synthesis is not supported on this browser', true);
        }
      });
    }

    // Speech-to-Text Setup
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isRecording = true;
        startTime = Date.now();
        if (waveform) waveform.style.display = 'flex';
        btnMic.textContent = '⏹ Stop Speaking & Grade';
        btnMic.style.background = '#e11d48';
      };

      recognition.onresult = (e) => {
        let finalStr = '';
        for (let i = 0; i < e.results.length; i++) {
          finalStr += e.results[i][0].transcript + ' ';
        }
        if (transcript) {
          transcript.value = finalStr;
          updateVoiceStats(finalStr);
        }
      };

      recognition.onerror = () => {
        stopRecording();
      };

      recognition.onend = () => {
        stopRecording();
        gradeAnswer(transcript.value);
      };
    }

    function updateVoiceStats(text) {
      const words = text.trim().split(/\\s+/).filter(Boolean);
      const elapsedMin = Math.max(0.05, (Date.now() - startTime) / 60000);
      const wpm = Math.round(words.length / elapsedMin);
      if (wordCountEl) {
        wordCountEl.textContent = `${words.length} words • ${wpm} WPM`;
      }
    }

    function gradeAnswer(text) {
      if (!text || text.trim().length < 10) return;
      const lower = text.toLowerCase();

      // Detect Fillers
      const fillers = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of'];
      let fillerHits = 0;
      fillers.forEach(f => {
        const matches = lower.match(new RegExp('\\\\b' + f + '\\\\b', 'g'));
        if (matches) fillerHits += matches.length;
      });

      // Detect STAR keywords
      const hasSit = /challenge|problem|project|context|company|team|situation/.test(lower);
      const hasAct = /architected|built|designed|implemented|optimized|led|developed|refactored/.test(lower);
      const hasRes = /reduced|increased|boosted|uptime|latency|percent|%|saved|scale/.test(lower);

      let starScore = 75;
      if (hasSit && hasAct && hasRes) starScore = 94;
      else if (hasAct && hasRes) starScore = 88;

      if (fillerHits > 4) starScore -= 8;

      if (evalPanel) evalPanel.style.display = 'block';
      if (fillerEl) fillerEl.textContent = `${fillerHits} detected`;
      if (starEl) starEl.textContent = (hasSit && hasAct && hasRes) ? 'Complete (S+T+A+R)' : 'Partial STAR';
      if (scoreBadge) scoreBadge.textContent = `${starScore} / 100`;
      if (feedbackText) {
        feedbackText.textContent = starScore >= 90 
          ? '🌟 Outstanding answer! You clearly outlined your direct technical ownership, specific architectural choices, and quantifiable production impact.'
          : '👍 Good response. To make it compelling for senior hiring leads, quantify your final business impact with specific percentages or throughput metrics.';
      }
      showToast('✓ AI Answer Evaluation complete!');
    }

    function stopRecording() {
      isRecording = false;
      if (waveform) waveform.style.display = 'none';
      if (btnMic) {
        btnMic.textContent = '🎤 Start Speaking Answer';
        btnMic.style.background = '';
      }
    }

    if (btnMic) {
      btnMic.addEventListener('click', () => {
        if (!recognition) {
          showToast('Speech recognition requires Chrome/Edge/Safari microphone support', true);
          return;
        }
        if (!isRecording) {
          transcript.value = '';
          recognition.start();
        } else {
          recognition.stop();
        }
      });
    }
  }

  // =========================================================================
  // MEGA UPGRADE 4: KEYWORD HEATMAP & 1-CLICK KEYWORD INJECTION
  // =========================================================================
  function renderKeywordHeatmap(job, profile) {
    const matchedCloud = document.getElementById('heatmapMatchedCloud');
    const missingCloud = document.getElementById('heatmapMissingCloud');
    const matchedCount = document.getElementById('heatmapMatchedCount');
    const missingCount = document.getElementById('heatmapMissingCount');

    if (!matchedCloud || !missingCloud) return;

    const matched = (job && job.matchedSkills) ? job.matchedSkills : ["Python", "PyTorch", "FastAPI", "React", "Docker", "RAG Systems"];
    const missing = (job && job.missingSkills) ? job.missingSkills : ["Distributed CUDA Kernels", "Kubeflow Pipelines", "Triton"];

    matchedCloud.innerHTML = matched.map(s => `<span class="heatmap-chip matched">✓ ${s}</span>`).join('');
    missingCloud.innerHTML = missing.map(s => `<span class="heatmap-chip missing">+ ${s}</span>`).join('');

    if (matchedCount) matchedCount.textContent = `${matched.length} matched`;
    if (missingCount) missingCount.textContent = `${missing.length} missing`;
  }

  function initKeywordAutoInject() {
    const btnInject = document.getElementById('btnAutoInjectKeywords');
    if (btnInject) {
      btnInject.addEventListener('click', () => {
        const missing = (activeJobDetail && activeJobDetail.missingSkills) ? activeJobDetail.missingSkills : ["Distributed CUDA Kernels", "Triton"];
        if (candidateProfile) {
          candidateProfile.skills += ', ' + missing.join(', ');
          const cvSkillsEl = document.getElementById('cvSkills');
          if (cvSkillsEl) {
            cvSkillsEl.innerHTML += `<br><strong>Tailored Enhancements:</strong> ${missing.join(', ')}`;
          }
        }
        showToast(`✓ Injected ${missing.length} missing keywords into ATS Resume!`);
        // Switch to resume tab
        const navCvBtn = document.querySelector('[data-tab="tabCV"]');
        if (navCvBtn) navCvBtn.click();
      });
    }
  }

  // =========================================================================
  // MEGA UPGRADE 5: SALARY NEGOTIATION & OFFER MATRIX
  // =========================================================================
  function initOfferMatrix() {
    const btnOpen = document.getElementById('btnOpenOfferMatrixModal');
    const modal = document.getElementById('offerMatrixModal');
    const btnClose = document.getElementById('btnCloseOfferModal');
    const scriptText = document.getElementById('negotiationScriptText');
    const btnCopy = document.getElementById('btnCopyNegotiationScript');
    const strategyBtns = document.querySelectorAll('.btn-neg-strategy');

    function updateTotals() {
      const aBase = Number(document.getElementById('offerABase').value) || 0;
      const aEq = Number(document.getElementById('offerAEquity').value) || 0;
      const aBon = Number(document.getElementById('offerABonus').value) || 0;
      const aTotal = aBase + aEq + aBon;
      document.getElementById('offerATotal').textContent = '$' + aTotal.toLocaleString();

      const bBase = Number(document.getElementById('offerBBase').value) || 0;
      const bEq = Number(document.getElementById('offerBEquity').value) || 0;
      const bBon = Number(document.getElementById('offerBBonus').value) || 0;
      const bTotal = bBase + bEq + bBon;
      document.getElementById('offerBTotal').textContent = '$' + bTotal.toLocaleString();
    }

    const scripts = {
      base: `Dear Hiring Team,\\n\\nThank you sincerely for this offer. I am genuinely excited about the role and confident in my ability to immediately accelerate your engineering targets.\\n\\nBased on competing conversations and my track record designing distributed architectures with 99.98% uptime, I would be thrilled to sign immediately if we could align the base compensation closer to $215,000. Is there flexibility on the base pay to help bridge this gap?\\n\\nSincerely,\\nAlex Rivera`,
      signing: `Dear Hiring Team,\\n\\nI am very excited about the prospect of joining the team! As I evaluate this opportunity alongside another active offer, a one-time signing bonus of $25,000 would offset my unvested equity and allow me to enthusiastically accept right away.\\n\\nLooking forward to your thoughts,\\nAlex Rivera`,
      remote: `Dear Hiring Team,\\n\\nThank you for extending this offer. To ensure I can deliver at my highest productive output, could we formalize full remote flexibility alongside a $10,000 annual home-lab & learning stipend? If so, I am ready to sign today.\\n\\nBest regards,\\nAlex Rivera`
    };

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        updateTotals();
        if (scriptText) scriptText.value = scripts.base;
        modal.style.display = 'flex';
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    strategyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        strategyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const strat = btn.getAttribute('data-strategy');
        if (scriptText) scriptText.value = scripts[strat] || scripts.base;
      });
    });

    ['offerABase', 'offerAEquity', 'offerABonus', 'offerBBase', 'offerBEquity', 'offerBBonus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateTotals);
    });

    if (btnCopy && scriptText) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(scriptText.value);
        showToast('✓ Copied Negotiation Counter-Offer Script!');
      });
    }
  }

  // =========================================================================
  // MEGA UPGRADE 6: PWA SERVICE WORKER
  // =========================================================================
  function initPwa() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
"""

    if 'initAtsTemplates' not in js:
        # Add functions before initial boot
        js = js.replace('// Initial Boot', js_extras + '\n  // Initial Boot')

        # Hook into initial boot
        boot_hook = """initAtsTemplates();
    initOutreachModal();
    initVoiceMockInterviewer();
    initKeywordAutoInject();
    initOfferMatrix();
    initPwa();
    renderKeywordHeatmap(activeJobDetail, candidateProfile);"""

        js = js.replace('initSmartGeoPricing();', 'initSmartGeoPricing();\n    ' + boot_hook)

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print('Updated app.js with Mega-Upgrade engines.')

if __name__ == '__main__':
    create_pwa_files()
    update_html()
    update_css()
    update_js()
    print('Mega-Upgrade injected successfully!')
