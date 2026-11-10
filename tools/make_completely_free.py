# Script to remove all upgrade pro, paid, freemium, and payment code and make JobPulse 100% Free & Open Access
import os
import re

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def clean_index_html():
    idx_path = os.path.join(root_dir, 'web', 'public', 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Remove Razorpay script
    html = re.sub(r'<script src="https://checkout\.razorpay\.com/v1/checkout\.js"></script>\s*', '', html)

    # 2. Replace Credit Pill and Upgrade Pro button in navbar
    nav_status_old = '''          <div class="credit-pill" id="webCreditPill" title="Your remaining free trial credits">
            <span class="sparkle-pulse"></span>
            <span id="webScansCount" class="credit-num">3</span> <span class="credit-sub">Scans</span>
            <span class="credit-dot">•</span>
            <span id="webCvCount" class="credit-num">1</span> <span class="credit-sub">CV</span>
          </div>
          <button class="btn btn-pro-upgrade" id="btnWebUpgrade">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Upgrade Pro</span>
          </button>'''

    nav_free_badge = '''          <div class="badge-free-access" style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-size: 11px; font-weight: 700;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
            <span>100% Free &amp; Open Access</span>
          </div>'''

    if 'btnWebUpgrade' in html:
        # Match from credit-pill or btnWebUpgrade
        idx_pill = html.find('<div class="credit-pill" id="webCreditPill"')
        idx_ext = html.find('<button class="btn btn-ext-glass"', idx_pill if idx_pill != -1 else 0)
        if idx_pill != -1 and idx_ext != -1:
            html = html[:idx_pill] + nav_free_badge + '\n          ' + html[idx_ext:]

    # 3. Remove Freemium Upgrade Modal (webUpgradeModal)
    idx_modal_start = html.find('<!-- Freemium Upgrade Modal -->')
    if idx_modal_start == -1:
        idx_modal_start = html.find('<div id="webUpgradeModal"')
    idx_modal_end = html.find('<!-- Main Content Container -->')
    if idx_modal_start != -1 and idx_modal_end != -1:
        html = html[:idx_modal_start] + html[idx_modal_end:]

    # 4. Clean Footer (Remove refund policy buttons and Indian INR badge)
    footer_old_start = html.find('<footer')
    footer_old_end = html.find('</footer>')
    if footer_old_start != -1 and footer_old_end != -1:
        clean_footer = '''<footer style="margin-top: 36px; padding: 20px 24px; border-top: 1px solid var(--border-main); display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: var(--text-muted); flex-wrap: wrap; gap: 14px; width: 100%; box-sizing: border-box;">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-weight: 700; color: #f8fafc;">JobPulse AI v2.0 • Autonomous Career Engine &amp; Studio</span>
        <span>100% Free &amp; Open Source • Zero External Database Dependencies</span>
      </div>
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <a href="https://github.com/dreamtelnew-crypto/JobPulse" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 600;">⭐ GitHub Repository</a>
        <a href="https://github.com/dreamtelnew-crypto/JobPulse/blob/main/LICENSE" target="_blank" style="color: #94a3b8; text-decoration: none;">📄 MIT License</a>
        <span style="color: #10b981; font-weight: 700;">● Public Free Access</span>
      </div>
    </footer>'''
        html = html[:footer_old_start] + clean_footer + html[footer_old_end + len('</footer>'):]

    with open(idx_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Cleaned index.html: removed Razorpay, upgrade modal, and paid policies.')

def clean_app_js():
    app_path = os.path.join(root_dir, 'web', 'public', 'app.js')
    with open(app_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. Replace getWebFreemium() to ALWAYS return unlimited Pro
    freemium_old_pattern = r'function getWebFreemium\(\)\s*\{[\s\S]*?return\s*\{[\s\S]*?\};\s*\}'
    freemium_free = """function getWebFreemium() {
    return {
      isPro: true,
      scansRemaining: 999999,
      cvRemaining: 999999,
      proKey: 'COMMUNITY_FREE_EDITION',
      proTier: 'lifetime',
      token: 'FREE_COMMUNITY_TOKEN'
    };
  }"""
    code = re.sub(freemium_old_pattern, freemium_free, code, count=1)

    # 2. Make openWebUpgradeModal a no-op
    modal_old_pattern = r'function openWebUpgradeModal\(reason\)\s*\{[\s\S]*?if\s*\(webUpgradeReason\)\s*webUpgradeReason\.textContent\s*=\s*reason;[\s\S]*?webUpgradeModal\.style\.display\s*=\s*\'flex\';\s*\}'
    modal_free = """function openWebUpgradeModal(reason) {
    // 100% Free & Open Access - No upgrade modal needed
  }"""
    code = re.sub(modal_old_pattern, modal_free, code, count=1)

    # 3. In consumeScanCredit and consumeCvCredit, always return true
    code = re.sub(r'function consumeScanCredit\(\)\s*\{[\s\S]*?return true;\s*\}', 'function consumeScanCredit() { return true; }', code)
    code = re.sub(r'function consumeCvCredit\(\)\s*\{[\s\S]*?return true;\s*\}', 'function consumeCvCredit() { return true; }', code)

    # 4. Remove limit checks in executeSearch
    code = re.sub(r'if\s*\(!freeState\.isPro\s*&&\s*freeState\.scansRemaining\s*<=\s*0\)\s*\{[\s\S]*?return;\s*\}', '', code)
    code = re.sub(r'if\s*\(!freeState\.isPro\s*&&\s*limitVal\s*>\s*5\)\s*\{[\s\S]*?limitVal\s*=\s*5;\s*\}', '', code)

    # 5. Remove quota exhaustion errors in ATS tailor and Interview prep
    code = re.sub(r'if\s*\(!freeState\.isPro\s*&&\s*freeState\.cvRemaining\s*<=\s*0\)\s*\{[\s\S]*?return;\s*\}', '', code)

    with open(app_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Cleaned app.js: all quotas unlocked, 100% free access enabled.')

def clean_server_js():
    server_path = os.path.join(root_dir, 'web', 'server.js')
    with open(server_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. authenticateDeviceOrToken always returns isPro: true
    auth_old_pattern = r'function authenticateDeviceOrToken\(token, deviceId, secretSalt, vault\)\s*\{[\s\S]*?return\s*\{[\s\S]*?\};\s*\}'
    auth_free = """function authenticateDeviceOrToken(token, deviceId, secretSalt, vault) {
  // 100% Free & Open Access for all users
  return { isPro: true, buyer: 'Community Member', tier: 'lifetime', isMasterAdmin: true };
}"""
    code = re.sub(auth_old_pattern, auth_free, code, count=1)

    # 2. Remove 402 quota blocks in /api/search
    search_402 = """      if (usage.searches <= 0) {
        res.writeHead(402, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          error: 'You have used all 3 free searches! Upgrade to Pro for unlimited multi-portal searches across LinkedIn, Internshala, and Google for Jobs.',
          requiresUpgrade: true,
          scansRemaining: 0
        }));
      }"""
    code = code.replace(search_402, "// Free unlimited searches")

    # 3. Remove 402 quota blocks in /api/interview-prep
    prep_402 = """      if (usage.aiActions <= 0) {
        res.writeHead(402, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          error: 'Free AI quota exhausted (1/1 used). To preserve Gemini compute quota and prepare unlimited role-specific interview Q&As, upgrade to Pro.',
          requiresUpgrade: true
        }));
      }"""
    code = code.replace(prep_402, "// Free unlimited interview prep")

    # 4. Remove 402 quota blocks in /api/tailor
    tailor_402 = """      if (usage.aiActions <= 0) {
        res.writeHead(402, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          error: 'Free AI quota exhausted (1/1 used). To preserve Gemini compute quota and generate unlimited tailored ATS resumes & cover letters, upgrade to Pro.',
          requiresUpgrade: true
        }));
      }"""
    code = code.replace(tailor_402, "// Free unlimited tailoring")

    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Cleaned server.js: removed 402 quota responses, all API routes 100% free.')

def clean_extension():
    # sidepanel.js
    sp_path = os.path.join(root_dir, 'extension', 'sidepanel.js')
    if os.path.exists(sp_path):
        with open(sp_path, 'r', encoding='utf-8') as f:
            code = f.read()

        code = re.sub(r'return\s*\{\s*scans:\s*\d+,\s*cv:\s*\d+,\s*isPro:\s*false,\s*proKey:\s*null\s*\};',
                      "return { scans: 999999, cv: 999999, isPro: true, proKey: 'COMMUNITY_FREE' };", code)
        code = re.sub(r'if\s*\(!freeState\.isPro\s*&&\s*freeState\.scans\s*<=\s*0\)\s*\{[\s\S]*?return;\s*\}', '', code)
        code = re.sub(r'if\s*\(!freeState\.isPro\s*&&\s*freeState\.cv\s*<=\s*0\)\s*\{[\s\S]*?return;\s*\}', '', code)

        with open(sp_path, 'w', encoding='utf-8') as f:
            f.write(code)
        print('Cleaned extension sidepanel.js: unlocked unlimited Pro.')

    # sidepanel.html - hide creditBar
    sp_html_path = os.path.join(root_dir, 'extension', 'sidepanel.html')
    if os.path.exists(sp_html_path):
        with open(sp_html_path, 'r', encoding='utf-8') as f:
            sp_html = f.read()
        sp_html = sp_html.replace('class="freemium-credit-bar" id="creditBar"', 'class="freemium-credit-bar" id="creditBar" style="display: none;"')
        with open(sp_html_path, 'w', encoding='utf-8') as f:
            f.write(sp_html)
        print('Cleaned extension sidepanel.html: hidden credit bar.')

if __name__ == '__main__':
    clean_index_html()
    clean_app_js()
    clean_server_js()
    clean_extension()
    print('Successfully removed all paid / upgrade / freemium elements!')
