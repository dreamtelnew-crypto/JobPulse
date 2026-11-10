import os

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
path = os.path.join(root_dir, 'web', 'public', 'app.js')
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

target = 'id: "demo-04",'
demo5 = '''    {
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
    },
'''

if 'demo-05' not in code:
    code = code.replace(target, demo5 + '    ' + target)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Added demo-05 Hacker News job to app.js')
