# Python script to inject Theme System, Backend Cloud Connector, and Static Mock Engine into app.js
import os
import re

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app_path = os.path.join(root_dir, 'web', 'public', 'app.js')

with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Rebrand names in app.js
code = code.replace('JobCraft', 'JobPulse AI')
code = code.replace('JobCopilot Pro', 'JobPulse Pro')
code = code.replace('JobCopilot', 'JobPulse')
code = code.replace('jobcraft_server_url', 'jobpulse_server_url')
code = code.replace('copilot_server_url', 'jobpulse_server_url')
code = code.replace('SoloPrimeCareer', 'JobPulseCareer')
code = code.replace('SoloPrime Team', 'JobPulse Team')
code = code.replace('SoloPrime', 'JobPulse AI')

# 2. Insert Theme & Backend & Fallback engine right after 'use strict';
engine_injection = '''
  // =========================================================================
  // THEME CHANGE ENGINE (Dark Obsidian, Aurora Light, Cyber Emerald, Amethyst)
  // =========================================================================
  const THEMES = {
    dark: { name: 'Obsidian', icon: '🌙' },
    light: { name: 'Aurora', icon: '☀️' },
    cyber: { name: 'Cyber', icon: '⚡' },
    amethyst: { name: 'Amethyst', icon: '🔮' }
  };

  function getCurrentTheme() {
    return localStorage.getItem('jobpulse_theme') || 'dark';
  }

  function applyTheme(themeKey) {
    if (!THEMES[themeKey]) themeKey = 'dark';
    document.documentElement.setAttribute('data-theme', themeKey);
    localStorage.setItem('jobpulse_theme', themeKey);

    const iconEl = document.getElementById('themeToggleIcon');
    const nameEl = document.getElementById('themeToggleName');
    if (iconEl) iconEl.textContent = THEMES[themeKey].icon;
    if (nameEl) nameEl.textContent = THEMES[themeKey].name;

    document.querySelectorAll('.theme-dropdown-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === themeKey);
    });
  }

  function initThemeSwitcher() {
    const btnToggle = document.getElementById('btnThemeToggle');
    const dropdown = document.getElementById('themeDropdownMenu');

    applyTheme(getCurrentTheme());

    if (btnToggle && dropdown) {
      btnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
      });

      document.querySelectorAll('.theme-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetTheme = item.getAttribute('data-theme');
          applyTheme(targetTheme);
          dropdown.style.display = 'none';
          showToast(`✓ Switched to ${THEMES[targetTheme].name} Theme`);
        });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== btnToggle) {
          dropdown.style.display = 'none';
        }
      });
    }
  }

  // =========================================================================
  // CLOUD BACKEND CONNECTOR & GITHUB PAGES DUAL-MODE ENGINE
  // =========================================================================
  function getCustomBackendUrl() {
    return (localStorage.getItem('jobpulse_backend_url') || '').trim().replace(/\\/+$/, '');
  }

  function setCustomBackendUrl(url) {
    const clean = (url || '').trim().replace(/\\/+$/, '');
    if (clean) {
      localStorage.setItem('jobpulse_backend_url', clean);
    } else {
      localStorage.removeItem('jobpulse_backend_url');
    }
  }

  let isDemoMode = false;

  async function checkBackendHealth() {
    const backendUrl = getCustomBackendUrl();
    const targetUrl = (backendUrl || '') + '/api/health';
    const statusDot = document.getElementById('backendStatusDot');
    const statusText = document.getElementById('backendStatusText');
    const healthText = document.getElementById('backendHealthText');
    const serviceName = document.getElementById('backendServiceName');

    try {
      const res = await originalFetch(targetUrl, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        isDemoMode = false;
        if (statusDot) {
          statusDot.className = 'backend-status-dot';
          statusDot.style.background = '#10b981';
          statusDot.style.boxShadow = '0 0 8px #10b981';
        }
        if (statusText) statusText.textContent = backendUrl ? 'Cloud Connected' : 'Live Server';
        if (healthText) { healthText.textContent = 'Active (200 OK)'; healthText.style.color = '#10b981'; }
        if (serviceName) serviceName.textContent = data.service || 'JobPulse AI Engine';
        return true;
      }
    } catch (e) {
      // Offline or GitHub Pages static host
    }

    // Fallback: Demo Mode on GitHub Pages or Offline
    isDemoMode = true;
    if (statusDot) {
      statusDot.className = 'backend-status-dot offline';
      statusDot.style.background = '#f59e0b';
      statusDot.style.boxShadow = '0 0 8px #f59e0b';
    }
    if (statusText) statusText.textContent = 'Demo Mode (Static)';
    if (healthText) { healthText.textContent = 'Offline (Client Demo Mode)'; healthText.style.color = '#f59e0b'; }
    if (serviceName) serviceName.textContent = 'JobPulse Client Intelligence Engine';
    return false;
  }

  function initBackendModal() {
    const btnOpen = document.getElementById('btnBackendModal');
    const modal = document.getElementById('backendConfigModal');
    const btnClose = document.getElementById('btnCloseBackendModal');
    const inputUrl = document.getElementById('inputBackendUrl');
    const btnSave = document.getElementById('btnSaveBackend');
    const btnTest = document.getElementById('btnTestBackend');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        if (inputUrl) inputUrl.value = getCustomBackendUrl();
        modal.style.display = 'flex';
        checkBackendHealth();
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (btnTest) {
      btnTest.addEventListener('click', async () => {
        btnTest.disabled = true;
        btnTest.textContent = '⏳ Testing...';
        const testUrl = (inputUrl.value.trim().replace(/\\/+$/, '') || '') + '/api/health';
        try {
          const res = await originalFetch(testUrl, { signal: AbortSignal.timeout(4000) });
          if (res.ok) {
            showToast('✓ Backend connected successfully!');
          } else {
            showToast(`Backend responded with HTTP ${res.status}`, true);
          }
        } catch (e) {
          showToast(`Connection failed: ${e.message}`, true);
        } finally {
          btnTest.disabled = false;
          btnTest.textContent = '⚡ Test Ping';
          checkBackendHealth();
        }
      });
    }

    if (btnSave && modal) {
      btnSave.addEventListener('click', async () => {
        setCustomBackendUrl(inputUrl.value);
        modal.style.display = 'none';
        showToast('✓ Saved Cloud Backend URL');
        await checkBackendHealth();
        executeSearch(true);
      });
    }
  }

  // =========================================================================
  // SMART FETCH INTERCEPTOR & STATIC FALLBACK ENGINE
  // =========================================================================
  const originalFetch = window.fetch;

  // Curated demo catalog for GitHub Pages / Static fallback
  const DEMO_JOBS = [
    {
      id: "demo-01",
      title: "Senior AI & Machine Learning Engineer",
      company: "Anthropic / NeuralCore",
      location: "San Francisco, CA (Remote / Hybrid)",
      salary: "$180,000 - $240,000 / yr",
      seniority: "Senior Level",
      employmentType: "Full-Time",
      industries: "Artificial Intelligence, LLM Systems",
      postedAgo: "2 hours ago",
      source: "LinkedIn Radar",
      score: 95,
      fitVerdict: "Strong Match",
      domainFit: 94,
      skillsFit: 96,
      matchedSkills: ["Python", "PyTorch", "FastAPI", "Docker", "RAG Systems", "LangChain", "Kubernetes"],
      missingSkills: ["CUDA C++ Optimization", "Triton Kernels"],
      verdictSummary: "Candidate has 95% alignment with core AI orchestration, distributed pipelines, and production full-stack systems. Prior RAG architecture experience is an exact match for target deliverables.",
      description: "We are seeking a Senior AI & ML Engineer to lead development of next-generation distributed inference pipelines and agentic tool workflows. You will design and deploy scalable Python microservices, implement low-latency retrieval systems, and integrate frontier foundation models.\\n\\nRequirements:\\n• 5+ years building production-grade software with Python, FastAPI, and Docker.\\n• Hands-on experience architecting RAG (Retrieval Augmented Generation) pipelines and vector search.\\n• Strong background with PyTorch, distributed training/inference, and cloud infrastructure (AWS/GCP, Kubernetes).\\n• Demonstrated ability to ship customer-facing AI products with high availability."
    },
    {
      id: "demo-02",
      title: "Staff Full-Stack Engineer (AI Infrastructure)",
      company: "Stripe AI Platform",
      location: "Bengaluru, India (Hybrid / Remote)",
      salary: "₹45,00,000 - ₹65,00,000 / yr",
      seniority: "Staff / Lead",
      employmentType: "Full-Time",
      industries: "Fintech, Developer Tools, AI",
      postedAgo: "5 hours ago",
      source: "JobPulse Radar",
      score: 91,
      fitVerdict: "Strong Match",
      domainFit: 90,
      skillsFit: 92,
      matchedSkills: ["React", "TypeScript", "Python", "PostgreSQL", "Docker", "CI/CD", "Git"],
      missingSkills: ["Ruby on Rails", "Sorbet Typechecking"],
      verdictSummary: "Exceptional match for full-stack architecture and high-scale developer platforms. Strong achievement profile in sub-millisecond API design and UI engineering.",
      description: "Join our AI Platform team to build the developer infrastructure and modern glassmorphic web studios powering global financial automation. You will bridge complex backend microservices with real-time reactive user interfaces.\\n\\nRequirements:\\n• Expert in TypeScript, React, state management, and modern component design.\\n• Robust backend fluency with Python or Go, PostgreSQL, and event-driven architectures.\\n• Passion for developer ergonomics, performance profiling, and clean UX."
    },
    {
      id: "demo-03",
      title: "Autonomous Agent Architect & RAG Specialist",
      company: "Scale AI & Co",
      location: "New York, NY (Remote Worldwide)",
      salary: "$190,000 - $250,000 / yr",
      seniority: "Lead / Specialist",
      employmentType: "Full-Time",
      industries: "Agentic AI, Enterprise Search",
      postedAgo: "1 day ago",
      source: "LinkedIn Radar",
      score: 88,
      fitVerdict: "Strong Match",
      domainFit: 88,
      skillsFit: 89,
      matchedSkills: ["Python", "FastAPI", "LangChain", "RAG Pipelines", "PostgreSQL", "Docker"],
      missingSkills: ["LlamaIndex Advanced", "Neo4j GraphRAG"],
      verdictSummary: "Candidate displays strong fluency with enterprise autonomous agent loops and vector embedding pipelines. High recruiter alignment.",
      description: "We are scaling autonomous AI copilots for Fortune 500 enterprises. We need an architect who can lead the design of zero-hallucination agentic retrieval systems and multi-modal tool calling loops.\\n\\nKey Duties:\\n• Architect resilient multi-step reasoning frameworks and guardrails.\\n• Optimize vector databases (Pinecone, pgvector, Milvus) for sub-100ms retrieval.\\n• Collaborate with UX researchers to deploy delightful web studios and sidepanels."
    },
    {
      id: "demo-04",
      title: "Principal Cloud Systems & DevOps Engineer",
      company: "Datadog / CloudPulse",
      location: "Bengaluru / London (Remote)",
      salary: "₹50,00,000 - ₹75,00,000 / yr",
      seniority: "Principal",
      employmentType: "Full-Time",
      industries: "Observability, Cloud Native",
      postedAgo: "2 days ago",
      source: "FreeHire Radar",
      score: 84,
      fitVerdict: "Moderate Match",
      domainFit: 82,
      skillsFit: 86,
      matchedSkills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Git", "Python"],
      missingSkills: ["Terraform CDKTF", "eBPF Tracing"],
      verdictSummary: "Solid infrastructure match with robust containerization and CI/CD competencies. Minor technical gaps in kernel-level observability easily bridged via Upskill Hub.",
      description: "Lead enterprise container orchestration, automated zero-downtime canary rollouts, and multi-region Kubernetes clusters handling 500k RPS."
    }
  ];

  function getDemoFallbackResponse(url, init) {
    const parsed = new URL(url, 'http://localhost');
    const pathname = parsed.pathname;

    if (pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'JobPulse AI Engine (Interactive Demo Mode)',
        version: '2.0.0',
        mode: 'static_fallback',
        timestamp: new Date().toISOString()
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/geo' || pathname === '/api/geo-pricing') {
      return new Response(JSON.stringify({
        isIndia: true,
        country: 'IN',
        symbol: '₹',
        rates: { monthly: 299, lifetime: 799 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/profile') {
      if (init && init.method === 'POST') {
        try {
          const body = JSON.parse(init.body);
          localStorage.setItem('jobpulse_profile_data', JSON.stringify(body));
          return new Response(JSON.stringify({ success: true, profile: body }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch {}
      }
      const saved = localStorage.getItem('jobpulse_profile_data');
      if (saved) {
        return new Response(JSON.stringify({ profile: JSON.parse(saved) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({
        profile: {
          fullName: "Alex Rivera",
          email: "alex.rivera.dev@gmail.com",
          phone: "+91 98765 43210",
          location: "Bengaluru, India (Remote or Hybrid)",
          headline: "Senior Full-Stack & AI Engineer | Python, React, PyTorch, RAG Pipelines",
          skills: "Python, PyTorch, FastAPI, React, TypeScript, Docker, Kubernetes, PostgreSQL, LangChain, RAG Systems, Git, CI/CD, AWS",
          achievements: "• Architected distributed RAG semantic search microservices handling 2.5M queries daily with 99.98% pipeline uptime.\\n• Optimized LLM inference latency by 42% utilizing quantized model caching and GPU batching pipelines.\\n• Led engineering of end-to-end full-stack web applications serving 120k active monthly developers."
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/search') {
      const q = (parsed.searchParams.get('q') || '').toLowerCase();
      const loc = (parsed.searchParams.get('location') || '').toLowerCase();
      let filtered = DEMO_JOBS;
      if (q) {
        filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.matchedSkills.some(s => s.toLowerCase().includes(q)) || j.description.toLowerCase().includes(q));
        if (filtered.length === 0) filtered = DEMO_JOBS;
      }
      return new Response(JSON.stringify({
        total: filtered.length,
        jobs: filtered,
        source: 'JobPulse Radar (Curated Demo Catalog)'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname.startsWith('/api/job/')) {
      const jobId = pathname.replace('/api/job/', '');
      const found = DEMO_JOBS.find(j => j.id === jobId) || DEMO_JOBS[0];
      return new Response(JSON.stringify(found), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/evaluate-custom') {
      return new Response(JSON.stringify({
        score: 93,
        fitVerdict: "Strong Match",
        domainFit: 92,
        skillsFit: 94,
        matchedSkills: ["Python", "PyTorch", "FastAPI", "React", "Docker", "RAG Systems"],
        missingSkills: ["Advanced CUDA Optimization", "Kubeflow Pipelines"],
        verdictSummary: "Candidate has 93% quantitative synergy with the required architecture. Achievements in high-concurrency microservices and latency minimization are direct value-multipliers.",
        recommendations: "Emphasize production throughput metrics and distributed vector caching in your introductory statement."
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/tailor') {
      return new Response(JSON.stringify({
        tailoredResume: {
          fullName: "Alex Rivera",
          contact: "alex.rivera.dev@gmail.com • +91 98765 43210 • Bengaluru, India (Remote)",
          summary: "Results-driven Senior AI & Full-Stack Engineer with 6+ years designing high-throughput distributed microservices, low-latency RAG architectures, and scalable cloud platforms. Proven track record reducing inference latency by 42% and architecting systems serving 2.5M+ daily queries.",
          skills: "Python, PyTorch, FastAPI, React, TypeScript, Docker, Kubernetes, PostgreSQL, LangChain, RAG Systems, Git, CI/CD, AWS",
          achievements: "• Architected distributed RAG semantic search microservices handling 2.5M queries daily with 99.98% pipeline uptime.\\n• Optimized LLM inference latency by 42% utilizing quantized model caching and GPU batching pipelines.\\n• Led engineering of end-to-end full-stack web applications serving 120k active monthly developers."
        },
        coverLetter: "Dear Hiring Team,\\n\\nI am writing to express my strong interest in the open position. Having engineered distributed AI microservices handling millions of queries with 99.98% uptime, I bring a demonstrated capability in building resilient, production-grade applications that bridge cutting-edge AI models with exceptional user experiences.\\n\\nIn my prior roles, I spearheaded end-to-end optimizations that cut inference latency by 42% through intelligent vector caching and batched GPU pipelines. I am eager to contribute this expertise to scale your engineering milestones and drive transformative impact for your users.\\n\\nSincerely,\\nAlex Rivera"
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/interview-prep') {
      return new Response(JSON.stringify({
        questions: [
          {
            category: "Technical Architecture",
            question: "How would you design a distributed RAG pipeline to ensure sub-100ms response times while mitigating hallucinations?",
            talkingPoints: "Discuss semantic chunking, hybrid keyword/vector search (BM25 + pgvector), prompt guardrails, and caching frequently retrieved chunks in Redis.",
            followUp: "How do you handle real-time cache invalidation when underlying documentation updates?"
          },
          {
            category: "System Resilience",
            question: "Describe your strategy for graceful degradation when third-party LLM APIs face rate limits or regional downtime.",
            talkingPoints: "Outline exponential backoff retries, multi-key connection pooling, local quantized fallback models, and circuit breaker patterns.",
            followUp: "What metrics would you set alerts on in your observability dashboard?"
          },
          {
            category: "Behavioral & STAR",
            question: "Tell me about a time you optimized a critical production bottleneck under tight delivery constraints.",
            talkingPoints: "Situation: Inference latency spikes. Task: Reduce P99 latency below 200ms. Action: Implemented INT8 quantization and batch pipelining. Result: 42% speedup and 35% compute cost savings.",
            followUp: "What trade-offs did you evaluate regarding model accuracy versus speed?"
          }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/upskill-analysis') {
      return new Response(JSON.stringify({
        skillGaps: [
          { skill: "CUDA C++ & GPU Kernels", priority: "High", estimatedWeeks: 3, roadmap: "Deep dive into Triton language, GPU memory hierarchy, and PyTorch custom C++ extensions." },
          { skill: "Neo4j GraphRAG", priority: "Medium", estimatedWeeks: 2, roadmap: "Implement knowledge graph ontology linking entities with Cypher queries for multi-hop reasoning." }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (pathname === '/api/tracker') {
      let tracker = [];
      try {
        tracker = JSON.parse(localStorage.getItem('jobpulse_tracker_data') || '[]');
      } catch {}
      if (init && init.method === 'POST') {
        try {
          const body = JSON.parse(init.body);
          tracker.push(body);
          localStorage.setItem('jobpulse_tracker_data', JSON.stringify(tracker));
          return new Response(JSON.stringify({ success: true, tracker }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch {}
      }
      return new Response(JSON.stringify({ tracker }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  window.fetch = async function (input, init) {
    let url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
    const backendBase = getCustomBackendUrl();

    if (backendBase && url.startsWith('/api/')) {
      url = backendBase + url;
      if (typeof input === 'string') {
        input = url;
      } else {
        input = new Request(url, input);
      }
    }

    try {
      const res = await originalFetch(input, init);
      if (!res.ok && res.status === 404 && url.includes('/api/')) {
        // Fallback for missing endpoint on static host
        return getDemoFallbackResponse(url, init);
      }
      return res;
    } catch (err) {
      if (url.includes('/api/')) {
        return getDemoFallbackResponse(url, init);
      }
      throw err;
    }
  };
'''

# Insert after 'use strict';
target_strict = "'use strict';"
code = code.replace(target_strict, target_strict + "\n" + engine_injection)

# Add initialization inside loadProfile().then(...)
old_boot = "loadProfile().then(async () => {"
new_boot = """initThemeSwitcher();
  initBackendModal();
  checkBackendHealth();

  loadProfile().then(async () => {"""

code = code.replace(old_boot, new_boot)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)

print('Successfully injected Theme System, Backend Cloud Connector, and Static Mock Engine into app.js!')
