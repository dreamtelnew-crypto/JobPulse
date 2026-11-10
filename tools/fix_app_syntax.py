import os

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
path = os.path.join(root_dir, 'web', 'public', 'app.js')

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

idx_demo3 = code.find('id: "demo-03"')
idx_end_array = code.find('];\n\n  function getDemoFallbackResponse')
if idx_end_array == -1:
    idx_end_array = code.find('];\r\n\r\n  function getDemoFallbackResponse')

if idx_demo3 != -1 and idx_end_array != -1:
    bad_block = code[idx_demo3:idx_end_array]
    good_block = '''id: "demo-03",
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
    }'''
    code = code[:idx_demo3] + good_block + code[idx_end_array:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Fixed app.js demo jobs array cleanly!')
