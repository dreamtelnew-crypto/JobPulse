// AI Job Copilot Web UI — Frontend Engine (Full Autonomous Career Suite)
(function () {
  'use strict';

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
    return (localStorage.getItem('jobpulse_backend_url') || '').trim().replace(/\/+$/, '');
  }

  function setCustomBackendUrl(url) {
    const clean = (url || '').trim().replace(/\/+$/, '');
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
        const testUrl = (inputUrl.value.trim().replace(/\/+$/, '') || '') + '/api/health';
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
      description: "We are seeking a Senior AI & ML Engineer to lead development of next-generation distributed inference pipelines and agentic tool workflows. You will design and deploy scalable Python microservices, implement low-latency retrieval systems, and integrate frontier foundation models.\n\nRequirements:\n• 5+ years building production-grade software with Python, FastAPI, and Docker.\n• Hands-on experience architecting RAG (Retrieval Augmented Generation) pipelines and vector search.\n• Strong background with PyTorch, distributed training/inference, and cloud infrastructure (AWS/GCP, Kubernetes).\n• Demonstrated ability to ship customer-facing AI products with high availability."
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
      description: "Join our AI Platform team to build the developer infrastructure and modern glassmorphic web studios powering global financial automation. You will bridge complex backend microservices with real-time reactive user interfaces.\n\nRequirements:\n• Expert in TypeScript, React, state management, and modern component design.\n• Robust backend fluency with Python or Go, PostgreSQL, and event-driven architectures.\n• Passion for developer ergonomics, performance profiling, and clean UX."
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
      description: "We are scaling autonomous AI copilots for Fortune 500 enterprises. We need an architect who can lead the design of zero-hallucination agentic retrieval systems and multi-modal tool calling loops.\n\nKey Duties:\n• Architect resilient multi-step reasoning frameworks and guardrails.\n• Optimize vector databases (Pinecone, pgvector, Milvus) for sub-100ms retrieval.\n• Collaborate with UX researchers to deploy delightful web studios and sidepanels."
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
    },
    {
      id: "demo-05",
      title: "Founding AI Systems Engineer (YC W26)",
      company: "CognitiveFlow (YC W26)",
      location: "San Francisco, CA (Remote Worldwide)",
      salary: "$195,000 - $260,000 / yr • 1.5% - 2.5% Equity",
      seniority: "Founding Engineer",
      employmentType: "Full-Time",
      industries: "Hacker News Who is Hiring, Foundation AI",
      postedAgo: "3 hours ago",
      source: "Hacker News (YC)",
      score: 97,
      fitVerdict: "Strong Match",
      domainFit: 96,
      skillsFit: 98,
      matchedSkills: ["Python", "PyTorch", "FastAPI", "RAG Systems", "PostgreSQL", "Docker", "Git"],
      missingSkills: ["vLLM Kernels", "Ray Clusters"],
      verdictSummary: "Near-perfect 97% synergy with founding AI engineering requirements. High equity upside and rapid leadership growth.",
      description: "Direct founder post from Hacker News 'Who is Hiring?'. Backed by top YC partners. Building autonomic reasoning models for enterprise workflows. Seeking our founding AI systems engineer to own inference throughput and model pipelines."
    }];

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
          achievements: "• Architected distributed RAG semantic search microservices handling 2.5M queries daily with 99.98% pipeline uptime.\n• Optimized LLM inference latency by 42% utilizing quantized model caching and GPU batching pipelines.\n• Led engineering of end-to-end full-stack web applications serving 120k active monthly developers."
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
          achievements: "• Architected distributed RAG semantic search microservices handling 2.5M queries daily with 99.98% pipeline uptime.\n• Optimized LLM inference latency by 42% utilizing quantized model caching and GPU batching pipelines.\n• Led engineering of end-to-end full-stack web applications serving 120k active monthly developers."
        },
        coverLetter: "Dear Hiring Team,\n\nI am writing to express my strong interest in the open position. Having engineered distributed AI microservices handling millions of queries with 99.98% uptime, I bring a demonstrated capability in building resilient, production-grade applications that bridge cutting-edge AI models with exceptional user experiences.\n\nIn my prior roles, I spearheaded end-to-end optimizations that cut inference latency by 42% through intelligent vector caching and batched GPU pipelines. I am eager to contribute this expertise to scale your engineering milestones and drive transformative impact for your users.\n\nSincerely,\nAlex Rivera"
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


  // Global State
  let activeJobDetail = null;
  let candidateProfile = null;
  let lastInterviewPrepText = "";
  let selectedTone = "executive";
  let interviewCardsData = [];

  // DOM Elements
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const toast = document.getElementById('toast');

  // Search Elements
  const searchForm = document.getElementById('searchForm');
  const inputQuery = document.getElementById('inputQuery');
  const inputLocation = document.getElementById('inputLocation');
  const selectRemote = document.getElementById('selectRemote');
  const selectPortal = document.getElementById('selectPortal');
  const selectLimit = document.getElementById('selectLimit');
  const btnRunSearch = document.getElementById('btnRunSearch');
  const searchLoading = document.getElementById('searchLoading');
  const jobsGrid = document.getElementById('jobsGrid');
  const resultsCount = document.getElementById('resultsCount');
  const directJobId = document.getElementById('directJobId');
  const btnLoadDirectId = document.getElementById('btnLoadDirectId');
  const btnOpenPasteModal = document.getElementById('btnOpenPasteModal');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnExportJson = document.getElementById('btnExportJson');

  // Detail Elements
  const detTitle = document.getElementById('detTitle');
  const detCompany = document.getElementById('detCompany');
  const detLocation = document.getElementById('detLocation');
  const detSeniority = document.getElementById('detSeniority');
  const detEmployment = document.getElementById('detEmployment');
  const detIndustries = document.getElementById('detIndustries');
  const detStatus = document.getElementById('detStatus');
  const detDescription = document.getElementById('detDescription');
  const detLiveUrl = document.getElementById('detLiveUrl');
  const detScore = document.getElementById('detScore');
  const detVerdictBadge = document.getElementById('detVerdictBadge');
  const detVerdictSummary = document.getElementById('detVerdictSummary');
  const detDomainBar = document.getElementById('detDomainBar');
  const detDomainVal = document.getElementById('detDomainVal');
  const detSkillsBar = document.getElementById('detSkillsBar');
  const detSkillsVal = document.getElementById('detSkillsVal');
  const detMatchedChips = document.getElementById('detMatchedChips');
  const detMissingChips = document.getElementById('detMissingChips');
  const detSalaryBody = document.getElementById('detSalaryBody');
  const btnTailorFromDetail = document.getElementById('btnTailorFromDetail');
  const btnInterviewFromDetail = document.getElementById('btnInterviewFromDetail');
  const btnTrackFromDetail = document.getElementById('btnTrackFromDetail');

  // Salary Explorer
  const salarySearchInput = document.getElementById('salarySearchInput');
  const btnSearchSalary = document.getElementById('btnSearchSalary');
  const salarySearchResult = document.getElementById('salarySearchResult');

  // Custom Job Paste Elements
  const customPasteCard = document.getElementById('customPasteCard');
  const btnCloseCustomPaste = document.getElementById('btnCloseCustomPaste');
  const btnTogglePasteFromDetail = document.getElementById('btnTogglePasteFromDetail');
  const btnSubmitCustomJob = document.getElementById('btnSubmitCustomJob');
  const customTitle = document.getElementById('customTitle');
  const customCompany = document.getElementById('customCompany');
  const customLocation = document.getElementById('customLocation');
  const customDesc = document.getElementById('customDesc');

  // CV & Letter Elements
  const cvName = document.getElementById('cvName');
  const cvContact = document.getElementById('cvContact');
  const cvSummary = document.getElementById('cvSummary');
  const cvSkills = document.getElementById('cvSkills');
  const cvAchievements = document.getElementById('cvAchievements');
  const letterTargetRole = document.getElementById('letterTargetRole');
  const letterTargetComp = document.getElementById('letterTargetComp');
  const letterTextarea = document.getElementById('letterTextarea');
  const btnPrintPdf = document.getElementById('btnPrintPdf');
  const btnCopyResumeText = document.getElementById('btnCopyResumeText');
  const btnCopyCoverLetter = document.getElementById('btnCopyCoverLetter');
  const btnRegenerateAi = document.getElementById('btnRegenerateAi');
  const btnInterviewFromCv = document.getElementById('btnInterviewFromCv');
  const toneBtns = document.querySelectorAll('.btn-tone');

  // Interview Studio Elements
  const prepTargetTitle = document.getElementById('prepTargetTitle');
  const prepTargetCompany = document.getElementById('prepTargetCompany');
  const prepLoading = document.getElementById('prepLoading');
  const prepRenderedContent = document.getElementById('prepRenderedContent');
  const btnGenerateInterviewNow = document.getElementById('btnGenerateInterviewNow');
  const btnCopyInterviewPrep = document.getElementById('btnCopyInterviewPrep');
  const btnChooseAnotherJobForPrep = document.getElementById('btnChooseAnotherJobForPrep');
  const prepFilterBtns = document.querySelectorAll('.btn-prep-filter');

  // Upskill Hub Elements
  const upskillGapsGrid = document.getElementById('upskillGapsGrid');
  const roadmapTimeline = document.getElementById('roadmapTimeline');
  const btnRefreshUpskill = document.getElementById('btnRefreshUpskill');

  // Tracker & Analytics Elements
  const trackerTableBody = document.getElementById('trackerTableBody');
  const btnCopyAllCsv = document.getElementById('btnCopyAllCsv');
  const statTotalApps = document.getElementById('statTotalApps');
  const statActiveApps = document.getElementById('statActiveApps');
  const statInterviews = document.getElementById('statInterviews');
  const statConvRate = document.getElementById('statConvRate');

  // Communication Modal Elements (/outcome)
  const followupModal = document.getElementById('followupModal');
  const followupModalTitle = document.getElementById('followupModalTitle');
  const followupModalSubtitle = document.getElementById('followupModalSubtitle');
  const followupSubject = document.getElementById('followupSubject');
  const followupBody = document.getElementById('followupBody');
  const btnCloseFollowupModal = document.getElementById('btnCloseFollowupModal');
  const btnCopyFollowupNote = document.getElementById('btnCopyFollowupNote');

  // Profile Form Elements
  const profileForm = document.getElementById('profileForm');
  const profFullName = document.getElementById('profFullName');
  const profEmail = document.getElementById('profEmail');
  const profPhone = document.getElementById('profPhone');
  const profLocation = document.getElementById('profLocation');
  const profHeadline = document.getElementById('profHeadline');
  const profSkills = document.getElementById('profSkills');
  const profAchievements = document.getElementById('profAchievements');
  const btnAutoEnrichProfile = document.getElementById('btnAutoEnrichProfile');

  // =========================================================================
  // FREEMIUM CREDITS & PRO LICENSING (3 Free Searches & 1 Free CV)
  // =========================================================================
  // =========================================================================
  // HARDWARE DEVICE LOCK, SMART GEO PRICING & ANTI-RESELLING ENGINE
  // =========================================================================
  function getOrGenerateDeviceId() {
    let devId = localStorage.getItem('copilot_device_id');
    if (!devId) {
      const raw = `${navigator.userAgent}|${screen.width}x${screen.height}|${navigator.language}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      devId = 'DEV-' + Math.abs(hash).toString(16).toUpperCase() + '-' + Date.now().toString(16).slice(-4).toUpperCase();
      localStorage.setItem('copilot_device_id', devId);
    }
    return devId;
  }

  let currentGeo = { isIndia: true, currency: 'INR', symbol: '₹' };

  async function initSmartGeoPricing() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const browserLang = navigator.language || '';
    const clientDetectIndia = tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India') || tz.includes('IST') || browserLang.includes('IN') || browserLang.includes('hi');
    
    currentGeo = {
      isIndia: clientDetectIndia,
      currency: clientDetectIndia ? 'INR' : 'USD',
      symbol: clientDetectIndia ? '₹' : '$'
    };
    applyGeoToUi(currentGeo.isIndia);

    try {
      const res = await fetch(`/api/geo?tz=${encodeURIComponent(tz)}`);
      if (res.ok) {
        currentGeo = await res.json();
        applyGeoToUi(currentGeo.isIndia);
      }
    } catch {}
  }

  function applyGeoToUi(isIndia) {
    currentGeo.isIndia = isIndia;
    const displayRegion = document.getElementById('displayDetectedRegion');
    const footerGeo = document.getElementById('footerGeoBadge');
    const indiaCard = document.getElementById('indiaPlanCard');
    const globalCard = document.getElementById('globalPlanCard');
    const btnInr = document.getElementById('btnSwitchToInr');
    const btnUsd = document.getElementById('btnSwitchToUsd');

    const regionText = isIndia ? '🇮🇳 India (INR - ₹)' : '🌍 Global / US (USD - $)';
    if (displayRegion) displayRegion.textContent = regionText;
    if (footerGeo) footerGeo.textContent = regionText;

    if (indiaCard && globalCard) {
      if (isIndia) {
        indiaCard.style.display = 'flex';
        globalCard.style.display = 'none';
        if (btnInr) { btnInr.style.background = '#f59e0b'; btnInr.style.color = '#000'; }
        if (btnUsd) { btnUsd.style.background = 'transparent'; btnUsd.style.color = 'var(--text-muted)'; }
      } else {
        indiaCard.style.display = 'none';
        globalCard.style.display = 'flex';
        if (btnInr) { btnInr.style.background = 'transparent'; btnInr.style.color = 'var(--text-muted)'; }
        if (btnUsd) { btnUsd.style.background = '#38bdf8'; btnUsd.style.color = '#000'; }
      }
    }
  }

  function getWebFreemium() {
    try {
      const saved = localStorage.getItem('ai_copilot_freemium_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.aiActions === undefined) {
          parsed.aiActions = parsed.cv !== undefined ? parsed.cv : 1;
        }
        return parsed;
      }
    } catch {}
    return { scans: 3, aiActions: 1, cv: 1, isPro: false, proKey: null };
  }

  function saveWebFreemium(state) {
    try {
      localStorage.setItem('ai_copilot_freemium_state', JSON.stringify(state));
    } catch {}
  }

  function renderWebFreemiumUI() {
    const state = getWebFreemium();
    const pill = document.getElementById('webCreditPill');
    const btnUpgrade = document.getElementById('btnWebUpgrade');

    if (!pill) return;

    if (state.isPro) {
      pill.style.background = 'rgba(16, 185, 129, 0.15)';
      pill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      const validityBadge = state.daysRemaining === 'Lifetime' 
        ? '👑 Lifetime Pass' 
        : (state.daysRemaining ? `⏳ ${state.daysRemaining}d Left` : '👑 Lifetime Pass');
      pill.innerHTML = `
        <span style="color: #10b981; font-size: 13px;">✓</span>
        <strong style="color: #10b981; font-size: 11.5px;">PRO ACTIVE</strong>
        <span style="color: var(--text-muted); font-size: 10px;">•</span>
        <span style="color: #38bdf8; font-size: 11px; font-weight: 700;">${validityBadge}</span>
      `;
      if (btnUpgrade) btnUpgrade.style.display = 'none';
    } else {
      const aiCount = state.aiActions !== undefined ? state.aiActions : (state.cv || 0);
      pill.style.background = 'rgba(39, 39, 42, 0.6)';
      pill.style.borderColor = 'var(--border-color)';
      pill.innerHTML = `
        <span class="sparkle" style="color: #fbbf24;">⚡</span>
        <span id="webScansCount" style="color: #38bdf8; font-weight: 700;">${state.scans}</span> <span style="color: var(--text-muted); font-size: 11px;">Scans</span>
        <span style="color: var(--text-muted); font-size: 10px;">•</span>
        <span id="webAiCount" style="color: ${aiCount > 0 ? '#38bdf8' : '#f87171'}; font-weight: 700;">${aiCount}</span> <span style="color: var(--text-muted); font-size: 11px;">Free AI</span>
      `;
      if (btnUpgrade) btnUpgrade.style.display = 'flex';
    }
  }

  async function verifyProSessionOnBoot() {
    const state = getWebFreemium();
    if (!state.isPro || !state.token || !state.proKey) return;

    const deviceId = getOrGenerateDeviceId();
    try {
      const res = await fetch('/api/license/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: state.proKey, deviceId, token: state.token })
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        console.warn('Pro token invalid, hardware mismatch, or license expired.');
        state.isPro = false;
        state.token = null;
        state.proKey = null;
        saveWebFreemium(state);
        renderWebFreemiumUI();
        showToast('⚠️ Pro subscription expired or revoked. Reverted to free preview.', true);
      } else {
        state.buyer = data.buyer;
        state.tier = data.tier;
        state.daysRemaining = data.daysRemaining;
        state.expiresAt = data.expiresAt;
        saveWebFreemium(state);
        renderWebFreemiumUI();
      }
    } catch {}
  }

  function openWebUpgradeModal(reason) {
    const modal = document.getElementById('webUpgradeModal');
    const reasonEl = document.getElementById('webUpgradeReason');
    if (reasonEl && reason) reasonEl.textContent = reason;
    initSmartGeoPricing();
    initAtsTemplates();
    initOutreachModal();
    initVoiceMockInterviewer();
    initKeywordAutoInject();
    initOfferMatrix();
    initPwa();
    renderKeywordHeatmap(activeJobDetail, candidateProfile);
    if (modal) modal.style.display = 'flex';
  }

  function closeWebUpgradeModal() {
    const modal = document.getElementById('webUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  // Freemium Modal DOM Listeners
  const btnWebUpgrade = document.getElementById('btnWebUpgrade');
  const btnCloseWebUpgradeModal = document.getElementById('btnCloseWebUpgradeModal');
  const webUpgradeModal = document.getElementById('webUpgradeModal');
  const btnWebPayUpi = document.getElementById('btnWebPayUpi');
  const webUpiDetailsBox = document.getElementById('webUpiDetailsBox');
  const btnWebCopyUpi = document.getElementById('btnWebCopyUpi');
  const btnWebPayCard = document.getElementById('btnWebPayCard');
  const webActivationInput = document.getElementById('webActivationInput');
  const btnWebActivateKey = document.getElementById('btnWebActivateKey');
  const webActivationStatus = document.getElementById('webActivationStatus');
  const btnSwitchToInr = document.getElementById('btnSwitchToInr');
  const btnSwitchToUsd = document.getElementById('btnSwitchToUsd');

  if (btnSwitchToInr) btnSwitchToInr.addEventListener('click', () => applyGeoToUi(true));
  if (btnSwitchToUsd) btnSwitchToUsd.addEventListener('click', () => applyGeoToUi(false));

  if (btnWebUpgrade) btnWebUpgrade.addEventListener('click', () => openWebUpgradeModal("Unlock unlimited live job scans, 1-click ATS resume tailoring, and anti-fraud shield."));
  if (btnCloseWebUpgradeModal) btnCloseWebUpgradeModal.addEventListener('click', closeWebUpgradeModal);
  if (webUpgradeModal) {
    webUpgradeModal.addEventListener('click', (e) => {
      if (e.target === webUpgradeModal) closeWebUpgradeModal();
    });
  }

  // Chrome Extension Modal
  const btnOpenExtModal = document.getElementById('btnOpenExtModal');
  const extInstallModal = document.getElementById('extInstallModal');
  const btnCloseExtModal = document.getElementById('btnCloseExtModal');

  if (btnOpenExtModal) {
    btnOpenExtModal.addEventListener('click', () => {
      if (extInstallModal) extInstallModal.style.display = 'flex';
    });
  }
  if (btnCloseExtModal) {
    btnCloseExtModal.addEventListener('click', () => {
      if (extInstallModal) extInstallModal.style.display = 'none';
    });
  }
  if (extInstallModal) {
    extInstallModal.addEventListener('click', (e) => {
      if (e.target === extInstallModal) extInstallModal.style.display = 'none';
    });
  }

  // Multi-Payment Method Tabs, Dynamic QR Code & Official Gateway Engine
  const payTabs = document.querySelectorAll('.btn-pay-tab');
  const payMethodViews = document.querySelectorAll('.pay-method-view');
  const planInrLifetime = document.getElementById('planInrLifetime');
  const planInrMonthly = document.getElementById('planInrMonthly');
  const planUsdLifetime = document.getElementById('planUsdLifetime');
  const planUsdMonthly = document.getElementById('planUsdMonthly');
  const upiRealQrImage = document.getElementById('upiRealQrImage');
  const displayQrAmountText = document.getElementById('displayQrAmountText');

  let activeUpiId = 'soloprime@upi';
  let activeWhatsappNumber = '919876543210';
  let activeSelectedAmount = 799;
  let activeSelectedLabel = '₹799 Lifetime Pass';
  let isRazorpayConfigured = false;
  let razorpayKeyId = '';

  function updateUpiQrCode(amount, label) {
    activeSelectedAmount = amount;
    activeSelectedLabel = label;
    if (displayQrAmountText) displayQrAmountText.textContent = `${label}`;
    if (upiRealQrImage) {
      const upiUrl = `upi://pay?pa=${activeUpiId}&pn=JobPulseCareer&am=${amount}&cu=INR&tn=JobPulsePro`;
      upiRealQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;
    }
    const txtInstantOnlineBtn = document.getElementById('txtInstantOnlineBtn');
    if (txtInstantOnlineBtn) {
      txtInstantOnlineBtn.textContent = `⚡ Instant Online Pay ₹${amount} (UPI • Cards • NetBanking)`;
    }
  }

  // Fetch Public Config (UPI ID, WhatsApp number, Razorpay status)
  async function loadPublicPaymentConfig() {
    try {
      const res = await fetch('/api/geo-pricing');
      if (res.ok) {
        const data = await res.json();
        if (data.merchantUpi) {
          activeUpiId = data.merchantUpi;
          const upiVal = document.getElementById('upiIdValDisplay');
          if (upiVal) upiVal.textContent = activeUpiId;
        }
        if (data.businessWhatsapp) {
          activeWhatsappNumber = data.businessWhatsapp;
          const policyWa = document.getElementById('policyWhatsappLink');
          if (policyWa) {
            policyWa.textContent = `+${activeWhatsappNumber} (Tap to Chat)`;
            policyWa.href = `https://wa.me/${activeWhatsappNumber}?text=${encodeURIComponent('Hi JobPulse Team, I need assistance with JobPulse Pro.')}`;
          }
        }
        isRazorpayConfigured = Boolean(data.razorpayEnabled);
        razorpayKeyId = data.razorpayKeyId || '';
        updateUpiQrCode(activeSelectedAmount, activeSelectedLabel);
      }
    } catch (e) {
      console.warn('Config fetch notice:', e.message);
    }
  }
  loadPublicPaymentConfig();

  if (planInrLifetime) {
    planInrLifetime.addEventListener('click', () => {
      planInrLifetime.classList.add('active');
      if (planInrMonthly) planInrMonthly.classList.remove('active');
      updateUpiQrCode(799, '₹799 Lifetime Pass');
    });
  }

  if (planInrMonthly) {
    planInrMonthly.addEventListener('click', () => {
      planInrMonthly.classList.add('active');
      if (planInrLifetime) planInrLifetime.classList.remove('active');
      updateUpiQrCode(299, '₹299 Monthly Plan');
    });
  }

  if (planUsdLifetime) {
    planUsdLifetime.addEventListener('click', () => {
      planUsdLifetime.classList.add('active');
      if (planUsdMonthly) planUsdMonthly.classList.remove('active');
    });
  }

  if (planUsdMonthly) {
    planUsdMonthly.addEventListener('click', () => {
      planUsdMonthly.classList.add('active');
      if (planUsdLifetime) planUsdLifetime.classList.remove('active');
    });
  }

  // Payment Tabs Switcher
  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => {
        t.classList.remove('active');
        t.removeAttribute('style');
      });
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      payMethodViews.forEach(v => {
        if (v.id === targetId) {
          v.style.display = 'block';
          v.classList.add('active');
        } else {
          v.style.display = 'none';
          v.classList.remove('active');
        }
      });
    });
  });

  // Dynamic WhatsApp Fast-Track Click Handler
  const btnWhatsappProof = document.getElementById('btnWhatsappProof');
  if (btnWhatsappProof) {
    btnWhatsappProof.addEventListener('click', () => {
      const devId = getOrGenerateDeviceId();
      const utrVal = (document.getElementById('webActivationInput')?.value || '').trim();
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      let msg = `🚀 *JobPulse Pro — Payment Confirmation*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📌 *Plan:* ${activeSelectedLabel}\n`;
      msg += `💳 *Order Ref:* ${orderId}\n`;
      if (utrVal) {
        msg += `🔢 *UTR / Ref:* ${utrVal}\n`;
      } else {
        msg += `🔢 *UTR / Ref:* [Screenshot Attached Below]\n`;
      }
      msg += `💻 *Device ID:* ${devId}\n`;
      msg += `⏰ *Timestamp:* ${nowStr}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `I have completed the payment via UPI. Please confirm my bank credit and issue my hardware-locked Pro license!`;

      const cleanPhone = activeWhatsappNumber.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

  // Official Razorpay Instant Online Checkout
  const btnRazorpayInstantPay = document.getElementById('btnRazorpayInstantPay');
  if (btnRazorpayInstantPay) {
    btnRazorpayInstantPay.addEventListener('click', async () => {
      btnRazorpayInstantPay.disabled = true;
      btnRazorpayInstantPay.textContent = 'Initializing Secure Gateway...';

      try {
        const devId = getOrGenerateDeviceId();
        const plan = (activeSelectedAmount == 299) ? 'pro_monthly' : 'lifetime_pass';
        const res = await fetch('/api/payment/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, deviceId: devId })
        });
        const orderData = await res.json();

        if (!orderData.success) {
          throw new Error(orderData.error || 'Failed to initialize payment.');
        }

        if (window.Razorpay && orderData.keyId) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: 'INR',
            name: 'JobPulse AI Technologies',
            description: `JobPulse ${activeSelectedLabel}`,
            order_id: (orderData.orderId && orderData.isLiveGateway) ? orderData.orderId : undefined,
            prefill: {
              name: 'Candidate Member',
              email: 'candidate@career.in',
              contact: '9999999999'
            },
            theme: { color: '#0284c7' },
            handler: async function (response) {
              btnRazorpayInstantPay.textContent = 'Verifying Transaction...';
              const verifyRes = await fetch('/api/payment/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                  razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                  razorpay_signature: response.razorpay_signature,
                  plan,
                  deviceId: devId
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                const state = getWebFreemium();
                state.isPro = true;
                state.proKey = verifyData.licenseKey;
                state.token = verifyData.token;
                state.buyer = verifyData.buyer;
                state.tier = verifyData.tier;
                state.daysRemaining = verifyData.daysRemaining;
                state.expiresAt = verifyData.expiresAt;
                saveWebFreemium(state);
                renderWebFreemiumUI();
                showToast(`👑 Pro Unlocked Instantly via Gateway!`);
                closeWebUpgradeModal();
              } else {
                alert(`Payment verification notice: ${verifyData.error || 'Please contact support.'}`);
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert(`⚡ Direct UPI QR Method:\n\nTo ensure 100% security with zero merchant gateway fees, please scan the official UPI QR code below with PhonePe, Google Pay, or Paytm.\n\nThen tap 'Confirm on WhatsApp' to receive your hardware-locked Pro key in 2 minutes!`);
        }
      } catch (err) {
        alert('Payment notice: ' + err.message);
      } finally {
        btnRazorpayInstantPay.disabled = false;
        btnRazorpayInstantPay.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span id="txtInstantOnlineBtn">⚡ Instant Online Pay ₹${activeSelectedAmount} (UPI • Cards • NetBanking)</span>
        `;
      }
    });
  }

  // Legal & Consumer Protection Policy Modal Handler
  const policyModal = document.getElementById('policyModal');
  const btnClosePolicyModal = document.getElementById('btnClosePolicyModal');
  const policyTabs = document.querySelectorAll('[data-policy-tab]');
  const policyContents = document.querySelectorAll('.policy-tab-content');

  function openPolicyModal(tabId = 'tabRefundPolicy') {
    if (!policyModal) return;
    policyModal.style.display = 'flex';
    policyTabs.forEach(t => {
      if (t.dataset.policyTab === tabId) t.classList.add('active');
      else t.classList.remove('active');
    });
    policyContents.forEach(c => {
      if (c.id === tabId) c.style.display = 'block';
      else c.style.display = 'none';
    });
  }

  function closePolicyModal() {
    if (policyModal) policyModal.style.display = 'none';
  }

  if (btnClosePolicyModal) {
    btnClosePolicyModal.addEventListener('click', closePolicyModal);
  }
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  policyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.policyTab;
      policyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      policyContents.forEach(c => {
        if (c.id === targetId) c.style.display = 'block';
        else c.style.display = 'none';
      });
    });
  });

  document.querySelectorAll('.btn-footer-policy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target || 'tabRefundPolicy';
      openPolicyModal(target);
    });
  });

  // Copy Buttons (UPI ID, Bank A/C, IFSC, Crypto)
  if (btnWebCopyUpi) {
    btnWebCopyUpi.addEventListener('click', () => {
      navigator.clipboard.writeText(activeUpiId).then(() => {
        btnWebCopyUpi.textContent = 'Copied!';
        setTimeout(() => { btnWebCopyUpi.textContent = 'Copy'; }, 2000);
      });
    });
  }

  document.querySelectorAll('.btn-copy-prop').forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = btn.dataset.text;
      if (txt) {
        navigator.clipboard.writeText(txt);
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
      }
    });
  });

  if (btnWebPayCard) {
    btnWebPayCard.addEventListener('click', () => {
      window.open('https://paypal.me/soloprime', '_blank');
    });
  }

  // Secure Server-Side Device-Locked Activation (Accepts Keys & UPI UTR references)
  async function performActivation(rawKey, isAuto = false) {
    const key = (rawKey || '').trim().toUpperCase();
    if (!key) {
      if (webActivationStatus) {
        webActivationStatus.textContent = 'Please enter a valid license key or UPI UTR reference.';
        webActivationStatus.style.color = '#ef4444';
        webActivationStatus.style.display = 'block';
      }
      return false;
    }

    const deviceId = getOrGenerateDeviceId();
    if (btnWebActivateKey) {
      btnWebActivateKey.disabled = true;
      btnWebActivateKey.textContent = 'Verifying Hardware...';
    }

    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key, deviceId, clientPlatform: 'Web Studio Dashboard' })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const state = getWebFreemium();
        state.isPro = true;
        state.proKey = data.licenseKey || key;
        state.token = data.token;
        state.buyer = data.buyer;
        state.tier = data.tier;
        state.daysRemaining = data.daysRemaining || (data.tier === 'lifetime_pass' ? 'Lifetime' : '30');
        state.expiresAt = data.expiresAt || null;
        saveWebFreemium(state);
        renderWebFreemiumUI();

        if (webActivationStatus) {
          webActivationStatus.textContent = `✓ Hardware Locked & Verified: Welcome ${data.buyer}! Unlimited Pro Suite Unlocked.`;
          webActivationStatus.style.color = '#10b981';
          webActivationStatus.style.display = 'block';
        }
        showToast(`👑 Pro Unlocked for ${data.buyer}!`);
        setTimeout(() => {
          closeWebUpgradeModal();
        }, 1400);
        return true;
      } else if (data.pending) {
        if (webActivationStatus) {
          webActivationStatus.innerHTML = `
            <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); padding: 10px 12px; border-radius: 8px; color: #fbbf24; text-align: left; font-size: 11.5px; line-height: 1.5;">
              <strong>⏳ Payment Verification In Progress</strong><br>
              Reference <code>${data.utr || key}</code> has been submitted. To prevent fraudulent bypasses, accounts unlock once bank credit is confirmed (2-5 mins).<br>
              <a href="https://wa.me/?text=Hi%20JobPulse AI%2C%20I%20have%20paid%20for%20JobPulse%20Pro.%20My%20UTR%20is%20${encodeURIComponent(data.utr || key)}" target="_blank" style="color: #38bdf8; font-weight: 700; text-decoration: underline; display: inline-block; margin-top: 5px;">💬 Send screenshot on WhatsApp for instant 1-min activation ➔</a>
            </div>
          `;
          webActivationStatus.style.display = 'block';
        }
        showToast('⏳ UTR submitted for bank verification.');
        return false;
      } else {
        if (webActivationStatus) {
          webActivationStatus.textContent = `❌ ${data.error || 'Invalid or already locked license.'}`;
          webActivationStatus.style.color = '#ef4444';
          webActivationStatus.style.display = 'block';
        }
        if (isAuto) {
          openWebUpgradeModal(`1-Click Activation Notice: ${data.error || 'Invalid key'}`);
        }
        return false;
      }
    } catch (err) {
      if (webActivationStatus) {
        webActivationStatus.textContent = 'Verification error. Server may be offline.';
        webActivationStatus.style.color = '#ef4444';
        webActivationStatus.style.display = 'block';
      }
      return false;
    } finally {
      if (btnWebActivateKey) {
        btnWebActivateKey.disabled = false;
        btnWebActivateKey.textContent = 'Unlock Pro';
      }
    }
  }

  if (btnWebActivateKey) {
    btnWebActivateKey.addEventListener('click', () => {
      performActivation(webActivationInput?.value);
    });
  }

  // 1-Click Magic Link Auto-Activation (?activate=PRO-XXXX or ?key=PRO-XXXX)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const magicKey = urlParams.get('activate') || urlParams.get('key');
    if (magicKey) {
      const cleanKey = magicKey.trim().toUpperCase();
      if (webActivationInput) webActivationInput.value = cleanKey;
      const currentPro = getWebFreemium();
      if (!currentPro.isPro || currentPro.proKey !== cleanKey) {
        showToast(`⚡ 1-Click Activation detected: Activating ${cleanKey}...`);
        performActivation(cleanKey, true);
      }
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    }
  } catch {}



  // Show Toast
  function showToast(msg, isError = false) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    toast.style.color = isError ? '#f87171' : '#38bdf8';
    toast.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)';
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  }

  // Switch Tabs
  function switchTab(tabId) {
    navBtns.forEach(b => {
      if (b.dataset.tab === tabId) b.classList.add('active');
      else b.classList.remove('active');
    });

    tabPanes.forEach(p => {
      if (p.id === tabId) {
        p.style.display = 'block';
        p.classList.add('active');
      } else {
        p.style.display = 'none';
        p.classList.remove('active');
      }
    });

    if (tabId === 'tabTracker') {
      loadTracker();
      loadPipelineAnalytics();
    }
    if (tabId === 'tabUpskill') loadUpskillData();
    if (tabId === 'tabProfile') loadProfile();
    if (tabId === 'tabInterview' && !lastInterviewPrepText && activeJobDetail) {
      generateInterviewPrep();
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Quick Presets
  document.querySelectorAll('.btn-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      inputQuery.value = tag.dataset.q;
      inputLocation.value = tag.dataset.loc;
      executeSearch();
    });
  });

  // 1. Search Execution
  async function executeSearch(isInitialBoot = false) {
    if (!isInitialBoot) {
      const freeState = getWebFreemium();
      if (!freeState.isPro && freeState.scans <= 0) {
        openWebUpgradeModal("You have used all 3 free searches! Upgrade to Pro for unlimited multi-portal searches across LinkedIn, Internshala, and Google for Jobs.");
        return;
      }
    }

    const q = inputQuery.value.trim() || 'AI Engineer';
    const loc = inputLocation.value.trim() || 'Remote';
    const remote = selectRemote.value;
    const portal = selectPortal ? selectPortal.value : 'all';
    
    const freeState = getWebFreemium();
    let limitVal = parseInt(selectLimit.value, 10) || 5;
    if (!freeState.isPro && limitVal > 5) {
      openWebUpgradeModal('Unlock 30 to 100+ Live Jobs with Pro Access!');
      limitVal = 5;
      selectLimit.value = '5';
    }
    const limit = limitVal;

    searchLoading.style.display = 'block';
    jobsGrid.innerHTML = '';
    resultsCount.textContent = 'Scanning...';
    btnRunSearch.disabled = true;

    try {
      const devId = getOrGenerateDeviceId();
      const url = `/api/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}&remote=${remote}&portal=${portal}&limit=${limit}${isInitialBoot ? '&boot=true' : ''}`;
      const res = await fetch(url, {
        headers: {
          'x-device-id': devId,
          'x-license-key': freeState.proKey || '',
          'x-license-token': freeState.token || ''
        }
      });
      if (res.status === 402) {
        const errData = await res.json();
        openWebUpgradeModal(errData.error);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      window._lastScannedJobs = data.jobs || [];
      renderJobCards(data.jobs || []);
      resultsCount.textContent = `${data.jobs.length} Roles Found`;
      showToast(`✓ Evaluated ${data.jobs.length} jobs!`);

      if (!isInitialBoot) {
        const freeState = getWebFreemium();
        if (!freeState.isPro) {
          freeState.scans = Math.max(0, freeState.scans - 1);
          saveWebFreemium(freeState);
          renderWebFreemiumUI();
        }
      }
    } catch (e) {
      showToast(`Search notice: ${e.message}`, true);
      resultsCount.textContent = 'Results calibrated';
    } finally {
      searchLoading.style.display = 'none';
      btnRunSearch.disabled = false;
    }
  }

  // Auto-refresh when dropdowns change (Fixes limit change not updating)
  selectLimit.addEventListener('change', () => executeSearch());
  selectRemote.addEventListener('change', () => executeSearch());
  if (selectPortal) selectPortal.addEventListener('change', () => executeSearch());

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch();
  });

  // Render Search Job Cards
  function renderJobCards(jobs) {
    jobsGrid.innerHTML = '';
    if (jobs.length === 0) {
      jobsGrid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 36px;">No jobs found matching criteria. Try broadening keyword or location.</div>`;
      return;
    }

    const freeState = getWebFreemium();
    const displayedJobs = !freeState.isPro ? jobs.slice(0, 5) : jobs;

    displayedJobs.forEach(item => {
      const card = document.createElement('div');
      card.className = 'job-card-item';

      const ev = item.eval || { score: 4.0, badge: 'MATCH', badgeClass: 'strong', summary: '', dimensions: {} };
      let scoreClass = 'score-strong';
      if (ev.score < 2.5) scoreClass = 'score-disqualified';
      else if (ev.score < 4.0) scoreClass = 'score-moderate';

      const matchedChipsHtml = (ev.matched || []).slice(0, 3).map(s => `<span class="mini-chip chip-match">${s}</span>`).join('');
      const missingChipsHtml = (ev.missing || []).slice(0, 2).map(s => `<span class="mini-chip chip-gap">${s}</span>`).join('');
      const sourceName = item.source || 'LinkedIn';
      const salText = item.salary?.baseline || 'Competitive Baseline';

      card.innerHTML = `
        <div class="job-card-inner">
          <div class="job-card-top">
            <div class="job-card-header-meta">
              <div class="card-meta-chips">
                <span class="source-badge">${sourceName}</span>
                <span class="salary-card-pill">${salText}</span>
                ${item.ambitionbox ? `<span class="ambitionbox-pill">★ ${item.ambitionbox.rating}</span>` : ''}
                ${item.audit ? `<span class="trust-badge-pill">🛡️ Verified</span>` : ''}
              </div>
              <h4 class="card-role-title" title="${item.title}">${item.title}</h4>
              <div class="card-comp-row">
                <span class="card-comp-name">${item.company || 'Direct Employer'}</span>
                <span class="card-comp-dot">•</span>
                <span class="card-loc-name">${item.location || 'Remote'}</span>
              </div>
            </div>
            <div class="score-container">
              <div class="score-pill ${scoreClass}">
                <span class="score-dot"></span>
                <span>${ev.score.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <p class="card-summary-text">${ev.summary}</p>
          <div class="card-chips-row">
            ${matchedChipsHtml}
            ${missingChipsHtml}
          </div>
        </div>
        <div class="card-btn-row">
          <button class="btn btn-secondary btn-sm btn-inspect-job" data-id="${item.id}">
            Inspect Fit
          </button>
          <button class="btn btn-primary btn-sm btn-tailor-job" data-id="${item.id}">
            ⚡ Tailor CV
          </button>
          <button class="btn-icon-action btn-quick-track" data-id="${item.id}" title="Save to Pipeline Tracker">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <a href="${item.url || '#'}" target="_blank" class="btn-icon-action" title="Open Original Posting">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      `;

      card.querySelector('.btn-inspect-job').addEventListener('click', () => loadJobDetails(item.id));
      card.querySelector('.btn-tailor-job').addEventListener('click', async () => {
        await loadJobDetails(item.id, false);
        triggerTailorFlow();
      });
      card.querySelector('.btn-quick-track').addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await fetch('/api/tracker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: new Date().toISOString().split('T')[0],
              company: item.company || 'Target Employer',
              role: item.title,
              score: (ev.score || 4.0).toFixed(1),
              url: item.url || '#'
            })
          });
          showToast(`✓ Tracked ${item.company} application!`);
        } catch {
          showToast(`Could not track role`, true);
        }
      });

      jobsGrid.appendChild(card);
    });

    // Pro Locked Roles Teaser Card for Free Users
    if (!freeState.isPro && jobs.length >= 5) {
      const lockCard = document.createElement('div');
      lockCard.className = 'job-card-item pro-locked-card';
      lockCard.innerHTML = `
        <div class="pro-lock-badge">🔒 25+ MORE HIGH-MATCH ROLES HIDDEN</div>
        <h4 style="font-size: 16px; font-weight: 800; color: #fff; margin: 10px 0 6px 0;">Unlock Full Daily Job Feed</h4>
        <p style="font-size: 12.5px; color: var(--text-dim); margin-bottom: 16px; max-width: 520px;">Free preview displays top 5 roles. Pro members unlock all 30 to 100+ daily scraped tech jobs with direct unauthenticated company apply URLs, salary benchmarks, and 1-click ATS resumes.</p>
        <button type="button" class="btn btn-pro-upgrade" id="btnUnlockGridRoles" style="padding: 10px 24px; font-size: 13px;">
          Unlock All Jobs — ₹799 Lifetime Pass
        </button>
      `;
      lockCard.querySelector('#btnUnlockGridRoles').addEventListener('click', () => {
        openWebUpgradeModal('Unlock all 30 to 100+ daily scraped jobs with Pro Access!');
      });
      jobsGrid.appendChild(lockCard);
    }
  }

  // 2. Load Single Job Details
  async function loadJobDetails(jobId, shouldSwitchTab = true) {
    showToast(`Loading job #${jobId}...`);
    try {
      const res = await fetch(`/api/job/${jobId}`);
      if (!res.ok) throw new Error(`Could not load job #${jobId}`);
      const data = await res.json();
      applyJobDataToUi(data, shouldSwitchTab);
    } catch (e) {
      showToast(e.message, true);
    }
  }

  function applyJobDataToUi(data, shouldSwitchTab = true) {
    activeJobDetail = data;
    const job = data.job;
    const ev = data.eval;
    const sal = data.salary;

    detTitle.textContent = job.title;
    detCompany.textContent = job.company;
    detLocation.textContent = job.location;
    detSeniority.textContent = job.seniority || 'Mid-Senior Level';
    detEmployment.textContent = job.employmentType || 'Full-time';
    detIndustries.textContent = job.industries || 'Technology';
    detStatus.textContent = job.isActive ? '● Active Posting' : '○ Closed / Expired';
    detDescription.textContent = job.description;
    detLiveUrl.href = job.url || '#';

    detScore.textContent = ev.score.toFixed(1);
    detVerdictBadge.textContent = ev.badge;
    detVerdictBadge.className = `score-badge ${ev.badgeClass === 'disqualified' ? 'text-warning' : ''}`;
    detVerdictSummary.textContent = ev.summary;

    detDomainVal.textContent = `${ev.domainOverlap}%`;
    // Update 4 Dimension Meters from framework (/rank)
    const dims = ev.dimensions || { technical: 90, experience: 85, behavioral: 85, career: 92 };
    const dimTechVal = document.getElementById('dimTechVal');
    const dimTechBar = document.getElementById('dimTechBar');
    const dimExpVal = document.getElementById('dimExpVal');
    const dimExpBar = document.getElementById('dimExpBar');
    const dimBehVal = document.getElementById('dimBehVal');
    const dimBehBar = document.getElementById('dimBehBar');
    const dimCareerVal = document.getElementById('dimCareerVal');
    const dimCareerBar = document.getElementById('dimCareerBar');

    if (dimTechVal && dimTechBar) {
      dimTechVal.textContent = `${dims.technical}%`;
      dimTechBar.style.width = `${dims.technical}%`;
    }
    if (dimExpVal && dimExpBar) {
      dimExpVal.textContent = `${dims.experience}%`;
      dimExpBar.style.width = `${dims.experience}%`;
    }
    if (dimBehVal && dimBehBar) {
      dimBehVal.textContent = `${dims.behavioral}%`;
      dimBehBar.style.width = `${dims.behavioral}%`;
    }
    if (dimCareerVal && dimCareerBar) {
      dimCareerVal.textContent = `${dims.career}%`;
      dimCareerBar.style.width = `${dims.career}%`;
    }

    detMatchedChips.innerHTML = (ev.matched && ev.matched.length > 0)
      ? ev.matched.map(m => `<span class="chip chip-matched">${m}</span>`).join('')
      : '<span class="chip chip-missing">None</span>';

    detMissingChips.innerHTML = (ev.missing && ev.missing.length > 0)
      ? ev.missing.map(m => `<span class="chip chip-missing">${m}</span>`).join('')
      : '<span class="chip chip-matched">Zero Critical Gaps</span>';

    detSalaryBody.innerHTML = `
      <div class="salary-row">
        <span>Target Comp Baseline:</span>
        <span class="sal-val">${sal.baseline}</span>
      </div>
      <div class="salary-row">
        <span>Market Comp Index:</span>
        <span class="sal-val">${sal.index} (Base 100)</span>
      </div>
      <div class="salary-row">
        <span>Benchmark Profile:</span>
        <span class="sal-val">${sal.role}</span>
      </div>
    `;

    // Populate AmbitionBox & Anti-Spam Audit
    const amb = job.ambitionbox || (activeJobDetail && activeJobDetail.ambitionbox);
    const audit = job.audit || (activeJobDetail && activeJobDetail.audit);
    const detAmbitionBoxBody = document.getElementById('detAmbitionBoxBody');
    const detAmbitionBadge = document.getElementById('detAmbitionBadge');
    const detAuditBadge = document.getElementById('detAuditBadge');

    if (detAmbitionBoxBody && amb) {
      if (detAmbitionBadge) detAmbitionBadge.textContent = `★ ${amb.rating} ${amb.verified ? 'Verified' : 'Benchmark'}`;
      detAmbitionBoxBody.innerHTML = `
        <div class="salary-row">
          <span>Overall Culture & Rating:</span>
          <span class="sal-val" style="color: #fbbf24; font-weight: 700;">★ ${amb.rating} / 5.0 (${amb.reviews} reviews)</span>
        </div>
        <div class="salary-row">
          <span>Expected CTC Range:</span>
          <span class="sal-val" style="color: #34d399; font-weight: 700;">${amb.ctcRange}</span>
        </div>
        <div class="salary-row">
          <span>Work-Life Balance:</span>
          <span class="sal-val">${amb.wlb} / 5.0</span>
        </div>
        <div class="salary-row">
          <span>Recommend to Friend:</span>
          <span class="sal-val">${amb.recommend}</span>
        </div>
      `;
    }

    if (detAuditBadge && audit) {
      if (audit.isSpam) {
        detAuditBadge.className = 'trust-badge-spam';
        detAuditBadge.style.color = '#f87171';
        detAuditBadge.style.background = 'rgba(239, 68, 68, 0.1)';
        detAuditBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        detAuditBadge.innerHTML = `⚠️ <strong>Suspicious Listing:</strong> ${audit.reason}`;
      } else {
        detAuditBadge.style.color = '#34d399';
        detAuditBadge.style.background = 'rgba(16, 185, 129, 0.1)';
        detAuditBadge.style.borderColor = 'rgba(16, 185, 129, 0.25)';
        detAuditBadge.innerHTML = `🛡️ <strong>${audit.badgeText}:</strong> ${audit.reason}`;
      }
    }

    // Sync targets
    letterTargetRole.textContent = job.title;
    letterTargetComp.textContent = job.company;
    prepTargetTitle.textContent = job.title;
    prepTargetCompany.textContent = `${job.company} • ${job.location}`;

    lastInterviewPrepText = "";

    if (shouldSwitchTab) {
      switchTab('tabDetail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  btnLoadDirectId.addEventListener('click', () => {
    let raw = directJobId.value.trim();
    const m = raw.match(/(\d{6,})/);
    if (m) {
      loadJobDetails(m[1]);
    } else {
      showToast('Please enter a valid 6+ digit LinkedIn Job ID or URL', true);
    }
  });

  // Export Scanned Jobs to CSV / JSON
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const jobs = window._lastScannedJobs || [];
      if (jobs.length === 0) {
        showToast('No scanned jobs to export. Run a search first!', true);
        return;
      }
      let csv = 'ID,Title,Company,Location,Source,FitScore,Benchmark,Date,URL\n';
      jobs.forEach(j => {
        const score = (j.eval?.score || 4.0).toFixed(1);
        const sal = (j.salary?.baseline || 'Market Baseline').replace(/,/g, ' ');
        csv += `"${j.id}","${(j.title || '').replace(/"/g, '""')}","${(j.company || '').replace(/"/g, '""')}","${(j.location || '').replace(/"/g, '""')}","${j.source || 'LinkedIn'}","${score}","${sal}","${j.date || ''}","${j.url || ''}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_shortlist_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`✓ Exported ${jobs.length} jobs to CSV!`);
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const jobs = window._lastScannedJobs || [];
      if (jobs.length === 0) {
        showToast('No scanned jobs to export. Run a search first!', true);
        return;
      }
      const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_shortlist_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`✓ Exported ${jobs.length} jobs to JSON!`);
    });
  }

  // Salary Quick Lookup
  if (btnSearchSalary) {
    btnSearchSalary.addEventListener('click', async () => {
      const q = salarySearchInput.value.trim();
      if (!q) return;
      try {
        const res = await fetch(`/api/salary-benchmark?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        salarySearchResult.style.display = 'block';
        salarySearchResult.innerHTML = `<strong>${data.name}:</strong> ${data.baseline} (Index: ${data.index}) • ${data.role}`;
      } catch {
        salarySearchResult.style.display = 'block';
        salarySearchResult.textContent = 'Company benchmark available in standard tier.';
      }
    });
  }

  // 3. Custom Job Paste Handling
  function openCustomPaste() {
    switchTab('tabDetail');
    customPasteCard.style.display = 'block';
    customTitle.focus();
    customPasteCard.scrollIntoView({ behavior: 'smooth' });
  }

  btnOpenPasteModal.addEventListener('click', openCustomPaste);
  btnTogglePasteFromDetail.addEventListener('click', () => {
    const isHidden = customPasteCard.style.display === 'none';
    customPasteCard.style.display = isHidden ? 'block' : 'none';
    if (isHidden) customTitle.focus();
  });
  btnCloseCustomPaste.addEventListener('click', () => {
    customPasteCard.style.display = 'none';
  });

  btnSubmitCustomJob.addEventListener('click', async () => {
    const title = customTitle.value.trim() || 'AI / Software Engineer';
    const company = customCompany.value.trim() || 'Direct Tech Employer';
    const location = customLocation.value.trim() || 'Remote / Hybrid';
    const desc = customDesc.value.trim();

    if (!desc) {
      showToast('Please paste the job description or requirements!', true);
      return;
    }

    btnSubmitCustomJob.disabled = true;
    btnSubmitCustomJob.textContent = '⏳ Calibrating Candidate Fit...';

    try {
      const res = await fetch('/api/evaluate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, location, description: desc })
      });
      if (!res.ok) throw new Error('Failed to evaluate custom job');
      const data = await res.json();
      applyJobDataToUi(data, true);
      customPasteCard.style.display = 'none';
      showToast(`✓ Analyzed "${title} at ${company}" with fit score ${data.eval.score}!`);
    } catch (e) {
      showToast(e.message, true);
    } finally {
      btnSubmitCustomJob.disabled = false;
      btnSubmitCustomJob.textContent = '⚡ Evaluate Custom Job Fit';
    }
  });

  // 4. Tailor CV & Letter Flow with Tone Selection
  toneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toneBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTone = btn.dataset.tone;
      triggerTailorFlow();
    });
  });

  async function triggerTailorFlow() {
    if (!activeJobDetail) {
      showToast('Please select or inspect a job first!', true);
      return;
    }

    const freeState = getWebFreemium();
    const currentAiQuota = freeState.aiActions !== undefined ? freeState.aiActions : (freeState.cv !== undefined ? freeState.cv : 1);
    if (!freeState.isPro && currentAiQuota <= 0) {
      openWebUpgradeModal("Free AI quota exhausted (1/1 used). To preserve Gemini compute quota and generate unlimited tailored ATS resumes & cover letters, upgrade to Pro.");
      return;
    }

    switchTab('tabCV');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const job = activeJobDetail.job;
    letterTargetRole.textContent = job.title;
    letterTargetComp.textContent = job.company;
    btnTailorFromDetail.textContent = '⏳ Tailoring with Strategy Engine...';
    btnRegenerateAi.textContent = '⏳ Generating Cover Letter...';

    const prof = candidateProfile || {
      fullName: '',
      skills: '',
      achievements: ''
    };

    try {
      const devId = getOrGenerateDeviceId();
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-device-id': devId,
          'x-license-key': freeState.proKey || '',
          'x-license-token': freeState.token || ''
        },
        body: JSON.stringify({ job, profile: prof, tone: selectedTone })
      });
      if (res.status === 402) {
        const errData = await res.json();
        openWebUpgradeModal(errData.error);
        return;
      }
      const data = await res.json();
      if (data.letter) letterTextarea.value = data.letter;
      if (data.summary) cvSummary.textContent = data.summary;
      showToast('✓ Tailored ATS Resume & Letter ready!');

      if (!freeState.isPro) {
        freeState.aiActions = 0;
        freeState.cv = 0;
        saveWebFreemium(freeState);
        renderWebFreemiumUI();
      }
    } catch (e) {
      showToast('Generated using standard high-impact template.');
    } finally {
      btnTailorFromDetail.textContent = '⚡ 1-Click Tailor ATS Resume & Cover Letter';
      btnRegenerateAi.textContent = '✨ Re-generate Tailored Letter';
    }
  }

  btnTailorFromDetail.addEventListener('click', triggerTailorFlow);
  btnRegenerateAi.addEventListener('click', triggerTailorFlow);

  btnPrintPdf.addEventListener('click', () => {
    window.print();
  });

  btnCopyCoverLetter.addEventListener('click', () => {
    navigator.clipboard.writeText(letterTextarea.value);
    btnCopyCoverLetter.textContent = '✓ Copied!';
    setTimeout(() => { btnCopyCoverLetter.textContent = '📋 Copy Letter'; }, 2000);
    showToast('Cover letter copied to clipboard!');
  });

  btnCopyResumeText.addEventListener('click', () => {
    const text = `
${cvName.textContent}
${cvContact.textContent}
${candidateProfile?.linkedin || 'linkedin.com/in/candidate'} • ${candidateProfile?.github || 'github.com/candidate'}

PROFESSIONAL SUMMARY:
${cvSummary.textContent.trim()}

TECHNICAL COMPETENCIES:
${candidateProfile?.skills || ''}

VERIFIED ACHIEVEMENTS & PRODUCTION IMPACT:
${candidateProfile?.achievements || ''}
    `.trim();
    navigator.clipboard.writeText(text);
    btnCopyResumeText.textContent = '✓ Copied!';
    setTimeout(() => { btnCopyResumeText.textContent = '📄 Copy Resume Text'; }, 2000);
    showToast('ATS resume text copied to clipboard!');
  });

  // 5. In-Depth Interview Prep Studio
  async function generateInterviewPrep() {
    if (!activeJobDetail) {
      showToast('Please select or inspect a job first!', true);
      return;
    }

    const freeState = getWebFreemium();
    const currentAiQuota = freeState.aiActions !== undefined ? freeState.aiActions : (freeState.cv !== undefined ? freeState.cv : 1);
    if (!freeState.isPro && currentAiQuota <= 0) {
      openWebUpgradeModal("Free AI quota exhausted (1/1 used). To preserve Gemini compute quota and generate role-specific interview Q&As, upgrade to Pro.");
      return;
    }

    const job = activeJobDetail.job;
    const prof = candidateProfile || {};

    prepLoading.style.display = 'block';
    prepRenderedContent.innerHTML = '';
    btnGenerateInterviewNow.disabled = true;

    try {
      const devId = getOrGenerateDeviceId();
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-device-id': devId,
          'x-license-key': freeState.proKey || '',
          'x-license-token': freeState.token || ''
        },
        body: JSON.stringify({ job, profile: prof })
      });
      if (res.status === 402) {
        const errData = await res.json();
        openWebUpgradeModal(errData.error);
        return;
      }
      const data = await res.json();
      lastInterviewPrepText = data.prep || "";
      parseAndRenderInterviewCards(lastInterviewPrepText);
      showToast(`✓ Comprehensive Interview Prep Guide generated for ${job.title}!`);

      if (!freeState.isPro) {
        freeState.aiActions = 0;
        freeState.cv = 0;
        saveWebFreemium(freeState);
        renderWebFreemiumUI();
      }
    } catch (e) {
      showToast('Generated using standard master prep dossier.');
    } finally {
      prepLoading.style.display = 'none';
      btnGenerateInterviewNow.disabled = false;
    }
  }

  function parseAndRenderInterviewCards(rawText) {
    interviewCardsData = [];
    const lines = rawText.split('\n');
    let currentCategory = 'tech';
    let currentCard = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (/behavioral/i.test(line) || /leadership/i.test(line) || /star/i.test(line)) {
        currentCategory = 'star';
      } else if (/reverse/i.test(line) || /ask the (team|interviewer|hiring)/i.test(line)) {
        currentCategory = 'reverse';
      } else if (/technical/i.test(line) || /system/i.test(line)) {
        currentCategory = 'tech';
      }

      if (/^####\s+/i.test(line) || /^[0-9]+\.\s+\*\*/i.test(line) || /^\*\*[0-9]+\.\s+/i.test(line)) {
        if (currentCard) interviewCardsData.push(currentCard);
        const title = line.replace(/^####\s+/, '').replace(/^[0-9]+\.\s+/, '').replace(/\*\*/g, '').trim();
        currentCard = {
          category: currentCategory,
          title: title,
          question: '',
          strategy: '',
          star: null,
          metric: ''
        };
        continue;
      }

      if (!currentCard && currentCategory === 'reverse' && /^[0-9]+\.\s+/.test(line)) {
        interviewCardsData.push({
          category: 'reverse',
          title: 'Strategic Reverse Question',
          question: line.replace(/^[0-9]+\.\s+/, '').replace(/\*\*/g, '').trim(),
          strategy: 'Signals strategic foresight, business alignment, and technical seniority.',
          star: null,
          metric: ''
        });
        continue;
      }

      if (currentCard) {
        if (/target question|question:/i.test(line)) {
          currentCard.question = line.replace(/.*(?:question:|\*\*target question:\*\*)\s*/i, '').replace(/\*+/g, '').trim();
        } else if (/star breakdown|situation:|task:|action:|result:/i.test(line)) {
          if (!currentCard.star) currentCard.star = { s: '', t: '', a: '', r: '' };
          if (/situation:/i.test(line)) currentCard.star.s = line.replace(/.*situation:\s*/i, '').replace(/\*+/g, '').trim();
          if (/task:/i.test(line)) currentCard.star.t = line.replace(/.*task:\s*/i, '').replace(/\*+/g, '').trim();
          if (/action:/i.test(line)) currentCard.star.a = line.replace(/.*action:\s*/i, '').replace(/\*+/g, '').trim();
          if (/result:/i.test(line)) currentCard.star.r = line.replace(/.*result:\s*/i, '').replace(/\*+/g, '').trim();
        } else if (/key metrics|metric/i.test(line)) {
          currentCard.metric = line.replace(/.*metrics?(?: to cite)?:?\s*/i, '').replace(/[\*"\\]/g, '').trim();
        } else {
          currentCard.strategy += (currentCard.strategy ? '<br>' : '') + line.replace(/^[\*\•\-]\s*/, '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        }
      }
    }
    if (currentCard) interviewCardsData.push(currentCard);

    if (interviewCardsData.length === 0) {
      renderRawFormatted(rawText);
      return;
    }

    renderFilteredCards('all');
  }

  function renderFilteredCards(filterType) {
    prepRenderedContent.innerHTML = '';
    const filtered = interviewCardsData.filter(c => filterType === 'all' || c.category === filterType);

    if (filtered.length === 0) {
      prepRenderedContent.innerHTML = `<div class="card" style="text-align: center; color: var(--text-muted); padding: 24px;">No questions under this category. Switch to "All Prep Modules".</div>`;
      return;
    }

    filtered.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'interview-q-card';

      let badgeClass = 'q-badge';
      let badgeLabel = 'Technical Deep-Dive';
      if (card.category === 'star') {
        badgeClass = 'q-badge q-badge-star';
        badgeLabel = 'STAR Leadership';
      } else if (card.category === 'reverse') {
        badgeClass = 'q-badge q-badge-rev';
        badgeLabel = 'Reverse Inquiry';
      }

      let starHtml = '';
      if (card.star) {
        starHtml = `
          <div class="star-grid">
            <div class="star-card">
              <div class="star-card-label">S — Situation</div>
              <div class="star-card-text">${card.star.s || 'High-volume production load or system constraint.'}</div>
            </div>
            <div class="star-card">
              <div class="star-card-label">T — Task</div>
              <div class="star-card-text">${card.star.t || 'Maintain 99.9% uptime and prevent latency spikes.'}</div>
            </div>
            <div class="star-card">
              <div class="star-card-label">A — Action</div>
              <div class="star-card-text">${card.star.a || 'Implemented asynchronous dead-letter queues and batching.'}</div>
            </div>
            <div class="star-card">
              <div class="star-card-label">R — Result</div>
              <div class="star-card-text">${card.star.r || 'Achieved sub-second inference with zero lost embeddings.'}</div>
            </div>
          </div>
        `;
      }

      let metricHtml = card.metric ? `<div class="q-metric-pill">📈 Verified Benchmark: ${card.metric}</div>` : '';

      cardEl.innerHTML = `
        <div class="q-header-row">
          <span class="${badgeClass}">${badgeLabel}</span>
          <div class="q-title-bold">#${idx + 1}: ${card.title}</div>
        </div>
        ${card.question ? `<div class="q-target-box"><strong>Target Question:</strong> "${card.question}"</div>` : ''}
        ${card.strategy ? `<div class="q-strategy-box"><strong style="color: #38bdf8; display: block; margin-bottom: 6px;">Recommended Answer Architecture & Strategy:</strong>${card.strategy}</div>` : ''}
        ${starHtml}
        ${metricHtml}
      `;

      prepRenderedContent.appendChild(cardEl);
    });
  }

  function renderRawFormatted(text) {
    let html = text
      .replace(/^### (.*$)/gim, '<div class="prep-sec-header">💡 $1</div>')
      .replace(/^#### (.*$)/gim, '<div class="q-title-bold" style="margin-top: 14px; color: #38bdf8;">$1</div>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/• (.*$)/gim, '<div style="margin-left: 12px; margin-bottom: 6px;">• $1</div>');
    prepRenderedContent.innerHTML = `<div style="line-height: 1.7; font-size: 13.5px; color: #e2e8f0;">${html}</div>`;
  }

  prepFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      prepFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFilteredCards(btn.dataset.filter);
    });
  });

  btnInterviewFromDetail.addEventListener('click', () => {
    switchTab('tabInterview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    generateInterviewPrep();
  });

  btnInterviewFromCv.addEventListener('click', () => {
    switchTab('tabInterview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    generateInterviewPrep();
  });

  btnGenerateInterviewNow.addEventListener('click', generateInterviewPrep);

  btnCopyInterviewPrep.addEventListener('click', () => {
    if (!lastInterviewPrepText) {
      showToast('Generate prep questions first!', true);
      return;
    }
    navigator.clipboard.writeText(lastInterviewPrepText);
    btnCopyInterviewPrep.textContent = '✓ Copied Q&A!';
    setTimeout(() => { btnCopyInterviewPrep.textContent = '📋 Copy All Prep Q&A'; }, 2000);
    showToast('Interview Q&A copied to clipboard!');
  });

  btnChooseAnotherJobForPrep.addEventListener('click', () => {
    switchTab('tabSearch');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 6. Upskill Hub (/upskill CLI equivalent)
  async function loadUpskillData() {
    try {
      const res = await fetch('/api/upskill-analysis');
      const data = await res.json();

      // Render Gaps
      upskillGapsGrid.innerHTML = '';
      (data.gaps || []).forEach(gap => {
        const card = document.createElement('div');
        card.className = 'gap-card';

        let pillClass = 'priority-high';
        if (gap.priority === 'Medium') pillClass = 'priority-med';
        if (gap.priority === 'Low') pillClass = 'priority-low';

        card.innerHTML = `
          <div>
            <div class="gap-top">
              <div>
                <div class="gap-name">${gap.name}</div>
                <div class="gap-cat">${gap.category}</div>
              </div>
              <span class="priority-pill ${pillClass}">${gap.priority} Priority</span>
            </div>
            <p class="gap-reason">${gap.reason}</p>
          </div>
          <div class="gap-footer">
            <span class="gap-hours">⏱ Est. ${gap.hours} Study</span>
            <a href="${gap.link}" target="_blank" class="btn btn-outline btn-sm">Documentation ↗</a>
          </div>
        `;
        upskillGapsGrid.appendChild(card);
      });

      // Render Timeline
      roadmapTimeline.innerHTML = '';
      (data.roadmap || []).forEach(step => {
        const row = document.createElement('div');
        row.className = 'roadmap-step';
        row.innerHTML = `
          <div class="step-week">${step.week}</div>
          <div>
            <div class="step-focus">${step.focus}</div>
            <div class="step-obj">${step.objective}</div>
          </div>
        `;
        roadmapTimeline.appendChild(row);
      });

      showToast('✓ Market skill gap heatmap & roadmap updated!');
    } catch {
      showToast('Failed to load upskill data', true);
    }
  }

  if (btnRefreshUpskill) {
    btnRefreshUpskill.addEventListener('click', loadUpskillData);
  }

  // 7. Pipeline Funnel Analytics & Tracker (/html-report & /outcome)
  async function loadPipelineAnalytics() {
    try {
      const res = await fetch('/api/pipeline-analytics');
      const data = await res.json();
      statTotalApps.textContent = data.total;
      statActiveApps.textContent = data.active;
      statInterviews.textContent = data.interviews;
      statConvRate.textContent = `${data.interviewRate}%`;
    } catch {
      // ignore
    }
  }

  async function loadTracker() {
    try {
      const res = await fetch('/api/tracker');
      const data = await res.json();
      renderTrackerTable(data.applications || []);
    } catch (e) {
      showToast('Could not load tracker data', true);
    }
  }

  function renderTrackerTable(rows) {
    trackerTableBody.innerHTML = '';
    if (rows.length === 0) {
      trackerTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px;">No applications tracked yet. Click "Add to Tracker" on any job.</td></tr>`;
      return;
    }

    rows.slice().reverse().forEach(r => {
      const tr = document.createElement('tr');
      const currentStatus = r.status.toLowerCase().replace(/\s+/g, '_');

      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-size: 11px;">${r.date}</td>
        <td style="font-weight: 600; color: #fff;">${r.company}</td>
        <td>${r.role}</td>
        <td><strong style="color: #34d399; font-family: var(--font-mono);">${r.score}</strong></td>
        <td>
          <select class="status-select-control" data-company="${r.company}" data-role="${r.role}">
            <option value="applied" ${currentStatus === 'applied' ? 'selected' : ''}>Applied</option>
            <option value="interview" ${currentStatus === 'interview' ? 'selected' : ''}>Interview</option>
            <option value="offer" ${currentStatus === 'offer' ? 'selected' : ''}>Offer</option>
            <option value="hired" ${currentStatus === 'hired' ? 'selected' : ''}>Hired</option>
            <option value="rejected" ${currentStatus === 'rejected' ? 'selected' : ''}>Rejected</option>
            <option value="no_response" ${currentStatus === 'no_response' ? 'selected' : ''}>No Response</option>
          </select>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm btn-open-followup" data-company="${r.company}" data-role="${r.role}" data-type="followup">
              ✉ 10-Day Follow-Up
            </button>
            <button class="btn btn-outline btn-sm btn-open-thankyou" data-company="${r.company}" data-role="${r.role}" data-type="thank_you">
              🤝 Thank-You
            </button>
          </div>
        </td>
      `;

      // Status Change Listener
      const selectEl = tr.querySelector('.status-select-control');
      selectEl.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        try {
          await fetch('/api/update-tracker-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company: r.company, role: r.role, newStatus })
          });
          showToast(`✓ Updated ${r.company} status to "${newStatus}"!`);
          loadPipelineAnalytics();
        } catch {
          showToast('Failed to update status', true);
        }
      });

      // Follow-Up Note Button
      tr.querySelector('.btn-open-followup').addEventListener('click', () => openCommunicationModal(r.company, r.role, 'followup'));
      tr.querySelector('.btn-open-thankyou').addEventListener('click', () => openCommunicationModal(r.company, r.role, 'thank_you'));

      trackerTableBody.appendChild(tr);
    });
  }

  // Communication Modal (/outcome)
  async function openCommunicationModal(company, role, type) {
    followupModal.style.display = 'flex';
    followupSubject.value = 'Drafting communication note...';
    followupBody.value = 'Generating personalized executive note...';

    if (type === 'thank_you') {
      followupModalTitle.textContent = `🤝 Post-Interview Thank-You Note: ${role} at ${company}`;
      followupModalSubtitle.textContent = 'Signals technical depth, professionalism, and immediate alignment.';
    } else {
      followupModalTitle.textContent = `✉ 10-Day Polite Follow-Up: ${role} at ${company}`;
      followupModalSubtitle.textContent = 'Surfaces quiet applications with polite, anti-cliché follow-up framing.';
    }

    try {
      const res = await fetch('/api/draft-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, type })
      });
      const data = await res.json();
      followupSubject.value = data.subject || 'Follow-Up Regarding Application';
      followupBody.value = data.draft || '';
    } catch {
      showToast('Failed to draft communication note', true);
    }
  }

  btnCloseFollowupModal.addEventListener('click', () => {
    followupModal.style.display = 'none';
  });

  btnCopyFollowupNote.addEventListener('click', () => {
    const full = `${followupSubject.value}\n\n${followupBody.value}`;
    navigator.clipboard.writeText(full);
    btnCopyFollowupNote.textContent = '✓ Copied Message!';
    setTimeout(() => { btnCopyFollowupNote.textContent = '📋 Copy to Clipboard'; }, 2000);
    showToast('✓ Message copied to clipboard ready to send!');
  });

  async function addActiveJobToTracker() {
    if (!activeJobDetail) {
      showToast('Please select or inspect a job first!', true);
      return;
    }

    const job = activeJobDetail.job;
    const ev = activeJobDetail.eval;
    const dateStr = new Date().toISOString().slice(0, 10);

    try {
      const res = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          company: job.company,
          role: job.title,
          score: ev.score.toFixed(1),
          url: job.url || '#'
        })
      });
      showToast(`✓ Tracked: "${job.title} at ${job.company}" saved to job_search_tracker.csv!`);
      btnTrackFromDetail.textContent = '✓ Saved in Tracker!';
      setTimeout(() => { btnTrackFromDetail.textContent = '💾 Add to Tracker'; }, 2500);
      loadPipelineAnalytics();
    } catch (e) {
      showToast('Could not save to tracker CSV', true);
    }
  }

  btnTrackFromDetail.addEventListener('click', addActiveJobToTracker);

  btnCopyAllCsv.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/tracker');
      const data = await res.json();
      const rows = data.applications || [];
      const header = '"date","company","sector","role","status","match_score","posting_url"\n';
      const body = rows.map(r => `"${r.date}","${r.company}","Technology","${r.role}","${r.status}","${r.score}","${r.url}"`).join('\n');
      navigator.clipboard.writeText(header + body);
      showToast('✓ All applications CSV copied to clipboard!');
      btnCopyAllCsv.textContent = '✓ Copied CSV!';
      setTimeout(() => { btnCopyAllCsv.textContent = '📥 Copy All CSV'; }, 2000);
    } catch {
      showToast('Failed to copy CSV', true);
    }
  });

  // 8. Profile Vault Management & Auto-Enrichment (/setup & /expand)
  const profileSetupBanner = document.getElementById('profileSetupBanner');
  const btnNudgeSetupProfile = document.getElementById('btnNudgeSetupProfile');
  if (btnNudgeSetupProfile) {
    btnNudgeSetupProfile.addEventListener('click', () => {
      switchTab('tabProfile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (profFullName) profFullName.focus();
    });
  }

  const SAMPLE_DEMO_PROFILE = {
    fullName: "Alex Rivera",
    email: "alex.rivera.dev@gmail.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India (Remote or Hybrid)",
    headline: "Senior Full-Stack & AI Engineer | Python, React, PyTorch, RAG Pipelines",
    skills: "Python, PyTorch, FastAPI, React, TypeScript, Docker, Kubernetes, PostgreSQL, LangChain, RAG Systems, Git, CI/CD, AWS",
    achievements: "• Architected distributed RAG semantic search microservices handling 2.5M queries daily with 99.98% pipeline uptime.\n• Optimized LLM inference latency by 42% utilizing quantized model caching and GPU batching pipelines.\n• Led engineering of end-to-end full-stack web applications serving 120k active monthly developers."
  };

  async function loadSampleCandidateProfile() {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SAMPLE_DEMO_PROFILE)
      });
      candidateProfile = SAMPLE_DEMO_PROFILE;
      if (profFullName) profFullName.value = SAMPLE_DEMO_PROFILE.fullName;
      if (profEmail) profEmail.value = SAMPLE_DEMO_PROFILE.email;
      if (profPhone) profPhone.value = SAMPLE_DEMO_PROFILE.phone;
      if (profLocation) profLocation.value = SAMPLE_DEMO_PROFILE.location;
      if (profHeadline) profHeadline.value = SAMPLE_DEMO_PROFILE.headline;
      if (profSkills) profSkills.value = SAMPLE_DEMO_PROFILE.skills;
      if (profAchievements) profAchievements.value = SAMPLE_DEMO_PROFILE.achievements;

      if (cvName) cvName.textContent = SAMPLE_DEMO_PROFILE.fullName;
      if (cvContact) cvContact.textContent = `${SAMPLE_DEMO_PROFILE.location} • ${SAMPLE_DEMO_PROFILE.email} • ${SAMPLE_DEMO_PROFILE.phone}`;
      if (cvSkills) cvSkills.innerHTML = `<strong>Technical Stack:</strong> ${SAMPLE_DEMO_PROFILE.skills}`;

      if (profileSetupBanner) profileSetupBanner.style.display = 'none';

      showToast('✓ Sample Demo Profile loaded! Job match scores calibrated.');
      executeSearch(true);
    } catch {
      showToast('Failed to load sample profile', true);
    }
  }

  const btnNudgeLoadSample = document.getElementById('btnNudgeLoadSample');
  const btnLoadSampleProfile = document.getElementById('btnLoadSampleProfile');
  if (btnNudgeLoadSample) btnNudgeLoadSample.addEventListener('click', loadSampleCandidateProfile);
  if (btnLoadSampleProfile) btnLoadSampleProfile.addEventListener('click', loadSampleCandidateProfile);

  const btnTutorialDownloadExt = document.getElementById('btnTutorialDownloadExt');
  if (btnTutorialDownloadExt) {
    btnTutorialDownloadExt.addEventListener('click', () => {
      if (extInstallModal) extInstallModal.style.display = 'flex';
    });
  }

  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      candidateProfile = await res.json();
      profFullName.value = candidateProfile.fullName || '';
      profEmail.value = candidateProfile.email || '';
      profPhone.value = candidateProfile.phone || '';
      profLocation.value = candidateProfile.location || '';
      profHeadline.value = candidateProfile.headline || '';
      profSkills.value = candidateProfile.skills || '';
      profAchievements.value = candidateProfile.achievements || '';

      cvName.textContent = candidateProfile.fullName || 'Candidate Name';
      cvContact.textContent = `${candidateProfile.location || 'Location'} • ${candidateProfile.email || 'candidate@example.com'} • ${candidateProfile.phone || ''}`;
      cvSkills.innerHTML = `<strong>Technical Stack:</strong> ${candidateProfile.skills || 'Add competencies in Profile Vault'}`;

      if (profileSetupBanner) {
        if (candidateProfile.fullName && candidateProfile.skills) {
          profileSetupBanner.style.display = 'none';
        } else {
          profileSetupBanner.style.display = 'block';
        }
      }
    } catch (e) {
      showToast('Could not load profile', true);
    }
  }

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      ...candidateProfile,
      fullName: profFullName.value.trim(),
      email: profEmail.value.trim(),
      phone: profPhone.value.trim(),
      location: profLocation.value.trim(),
      headline: profHeadline.value.trim(),
      skills: profSkills.value.trim(),
      achievements: profAchievements.value.trim()
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      candidateProfile = updated;
      cvName.textContent = updated.fullName || 'Candidate Name';
      cvContact.textContent = `${updated.location || 'Location'} • ${updated.email || 'candidate@example.com'} • ${updated.phone || ''}`;
      cvSkills.innerHTML = `<strong>Technical Stack:</strong> ${updated.skills || 'Add competencies in Profile Vault'}`;
      if (profileSetupBanner && updated.fullName && updated.skills) {
        profileSetupBanner.style.display = 'none';
      }
      showToast('✓ Profile updated and saved to candidate_profile.json!');
    } catch (e) {
      showToast('Failed to save profile', true);
    }
  });

  if (btnAutoEnrichProfile) {
    btnAutoEnrichProfile.addEventListener('click', async () => {
      btnAutoEnrichProfile.disabled = true;
      btnAutoEnrichProfile.textContent = '⏳ Scanning GitHub & Repos...';

      try {
        const res = await fetch('/api/expand-profile', { method: 'POST' });
        const data = await res.json();
        candidateProfile = data.profile;
        profSkills.value = candidateProfile.skills;
        profAchievements.value = candidateProfile.achievements;
        cvSkills.innerHTML = `<strong>Technical Stack:</strong> ${candidateProfile.skills}`;
        showToast('✓ Profile enriched with production benchmarks & competencies (/expand)!');
      } catch {
        showToast('Failed to auto-enrich profile', true);
      } finally {
        btnAutoEnrichProfile.disabled = false;
        btnAutoEnrichProfile.textContent = '⚡ Auto-Enrich Profile (/expand)';
      }
    });
  }

  
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
    const inmail = `Hi ${company} Hiring Team,\n\nI came across the ${title} position at ${company} and was immediately impressed by your technical vision. Given my background designing high-throughput distributed microservices, low-latency AI architectures, and scalable full-stack applications, I wanted to reach out directly.\n\nIn my recent deliverables:\n• Engineered distributed semantic search microservices handling 2.5M daily queries with 99.98% uptime.\n• Optimized inference pipelines by 42% utilizing quantized model caching and batched GPU execution.\n• Built customer-facing production platforms serving 120k active developers.\n\nI would welcome a brief conversation to explore how my hands-on background can help accelerate your engineering roadmap. My resume is attached for review.\n\nBest regards,\n${candidate}\n${profile ? profile.email : 'candidate@email.com'} • ${profile ? profile.phone : '+1 234 567 8900'}`;

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
        const full = `${subjectText.value}\n\n${inmailText.value}`;
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
      const words = text.trim().split(/\s+/).filter(Boolean);
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
        const matches = lower.match(new RegExp('\\b' + f + '\\b', 'g'));
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
      base: `Dear Hiring Team,\n\nThank you sincerely for this offer. I am genuinely excited about the role and confident in my ability to immediately accelerate your engineering targets.\n\nBased on competing conversations and my track record designing distributed architectures with 99.98% uptime, I would be thrilled to sign immediately if we could align the base compensation closer to $215,000. Is there flexibility on the base pay to help bridge this gap?\n\nSincerely,\nAlex Rivera`,
      signing: `Dear Hiring Team,\n\nI am very excited about the prospect of joining the team! As I evaluate this opportunity alongside another active offer, a one-time signing bonus of $25,000 would offset my unvested equity and allow me to enthusiastically accept right away.\n\nLooking forward to your thoughts,\nAlex Rivera`,
      remote: `Dear Hiring Team,\n\nThank you for extending this offer. To ensure I can deliver at my highest productive output, could we formalize full remote flexibility alongside a $10,000 annual home-lab & learning stipend? If so, I am ready to sign today.\n\nBest regards,\nAlex Rivera`
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

  // Initial Boot
  initThemeSwitcher();
  initBackendModal();
  checkBackendHealth();

  loadProfile().then(async () => {
    initSmartGeoPricing();
    initAtsTemplates();
    initOutreachModal();
    initVoiceMockInterviewer();
    initKeywordAutoInject();
    initOfferMatrix();
    initPwa();
    renderKeywordHeatmap(activeJobDetail, candidateProfile);
    renderWebFreemiumUI();
    await verifyProSessionOnBoot();
    executeSearch(true);
  });
})();
