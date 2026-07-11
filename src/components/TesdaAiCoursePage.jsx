const courseModules = [
  {
    code: 'BSC-101',
    title: 'Digital Work Readiness and AI Foundations',
    hours: 16,
    outcomes: [
      'Explain AI, machine learning, generative AI, automation, and data annotation in plain workplace language.',
      'Identify practical AI use cases in Philippine offices, LGUs, BPOs, MSMEs, schools, and legal/admin teams.',
      'Set up safe accounts, files, cloud folders, browser tools, and basic cybersecurity practices for AI work.',
    ],
    evidence: 'Learner creates a personal AI learning portfolio, use-case map, and basic digital workspace checklist.',
  },
  {
    code: 'AIP-102',
    title: 'Prompt Engineering for Work Tasks',
    hours: 32,
    outcomes: [
      'Write clear prompts using role, task, context, source material, output format, constraints, and review criteria.',
      'Generate, compare, and revise drafts for emails, reports, minutes, forms, policies, scripts, and customer replies.',
      'Use Filipino, English, and simple bilingual prompt patterns for Philippine workplace communication.',
    ],
    evidence: 'Learner submits a prompt book with before-and-after outputs and reviewer notes.',
  },
  {
    code: 'AIA-103',
    title: 'AI for Office Automation and Productivity',
    hours: 32,
    outcomes: [
      'Use AI to summarize documents, extract action items, prepare checklists, and transform raw notes into structured outputs.',
      'Build no-code or low-code workflows for recurring office tasks such as intake, routing, follow-up, and reporting.',
      'Apply human review gates before sending, filing, or publishing AI-assisted work.',
    ],
    evidence: 'Learner demonstrates one automated workflow and explains its review and error-handling steps.',
  },
  {
    code: 'DAT-104',
    title: 'Data Collection, Cleaning, and Annotation',
    hours: 40,
    outcomes: [
      'Collect text, image, audio, and document samples using lawful, consent-aware, and privacy-conscious methods.',
      'Clean, label, classify, and validate datasets for common AI tasks.',
      'Prepare annotation guidelines, quality checks, and issue logs for team-based data work.',
    ],
    evidence: 'Learner produces a small labeled dataset, annotation guide, and quality review sheet.',
  },
  {
    code: 'VER-105',
    title: 'AI Output Verification and Fact Checking',
    hours: 24,
    outcomes: [
      'Detect hallucinations, missing context, false citations, biased phrasing, and unsupported conclusions.',
      'Verify outputs against primary sources, official government sites, company records, and approved references.',
      'Create reviewer comments and correction logs for AI-assisted drafts.',
    ],
    evidence: 'Learner completes a verification report comparing AI output against source documents.',
  },
  {
    code: 'ETH-106',
    title: 'Responsible AI, Privacy, and Philippine Compliance',
    hours: 24,
    outcomes: [
      'Apply responsible AI principles: transparency, fairness, accountability, human oversight, and safety.',
      'Recognize sensitive data, confidential files, privileged information, and personal information under Philippine privacy practice.',
      'Use AI disclosure, consent, access control, and retention rules in workplace procedures.',
    ],
    evidence: 'Learner drafts an AI use policy and risk checklist for a Philippine workplace.',
  },
  {
    code: 'JOB-107',
    title: 'AI Career Pathways and Freelance/Employment Readiness',
    hours: 24,
    outcomes: [
      'Prepare a portfolio for AI assistant, prompt specialist, data annotator, automation assistant, or junior AI operations roles.',
      'Estimate task effort, quality standards, pricing, and client handoff requirements.',
      'Practice interview, client discovery, and workplace reporting scenarios.',
    ],
    evidence: 'Learner presents a portfolio, resume summary, service menu, and mock client handoff.',
  },
  {
    code: 'CAP-108',
    title: 'Capstone: Philippine Workplace AI Project',
    hours: 32,
    outcomes: [
      'Select a real Philippine workplace problem and design an AI-assisted solution.',
      'Build the prompt pack, workflow, source checklist, verification method, and final output template.',
      'Present business value, risks, safeguards, and implementation steps to a reviewer panel.',
    ],
    evidence: 'Learner submits and defends a complete capstone project with documentation and demo.',
  },
];

const tools = [
  'Computer or laptop with stable internet',
  'Modern browser and cloud document workspace',
  'AI chatbot access approved by the training provider',
  'Spreadsheet, document, slide, and PDF tools',
  'Sample Philippine workplace documents and datasets',
  'Privacy, cybersecurity, and responsible AI checklists',
];

const assessments = [
  'Written knowledge checks per module',
  'Hands-on performance tasks with rubrics',
  'Portfolio review of prompts, workflows, datasets, and verification logs',
  'Oral questioning to validate learner judgment',
  'Capstone demonstration with assessor feedback',
];

const totalHours = courseModules.reduce((sum, module) => sum + module.hours, 0);

export default function TesdaAiCoursePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-surface-dark">
      <div className="border-b border-surface-border px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
            TESDA-Style Competency-Based Curriculum
          </p>
          <h1 className="text-2xl font-bold text-white mt-1">
            Artificial Intelligence for Philippine Workplaces
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-4xl">
            Modular AI course plan for Filipino learners, employees, and trainees. This is a curriculum draft patterned after TESDA competency-based training language and should be validated by a TESDA-accredited trainer or curriculum developer before formal registration.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ['Course Level', 'Intro to Intermediate'],
            ['Nominal Hours', `${totalHours} hours`],
            ['Delivery', 'Blended / Online / Lab'],
            ['Final Output', 'AI Workplace Portfolio'],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface-card border border-surface-border rounded-lg p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
              <p className="text-lg font-semibold text-white mt-1">{value}</p>
            </div>
          ))}
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Course Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            This course develops practical AI competencies for Philippine workplaces. Learners will use AI tools responsibly to draft, summarize, classify, automate, verify, and present work outputs while applying human review, privacy safeguards, cybersecurity awareness, and source-based verification.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              'Target learners: SHS graduates, employees, freelancers, BPO/admin staff, MSME workers, LGU staff, and career shifters.',
              'Entry requirement: basic computer, internet, reading, writing, and spreadsheet/document skills.',
              'Trainer note: adapt examples to the learner sector such as legal, HR, sales, customer support, government, education, or operations.',
            ].map((item) => (
              <div key={item} className="rounded-lg bg-surface-input border border-surface-border p-3 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Modular Curriculum</h2>
          <div className="space-y-4">
            {courseModules.map((module) => (
              <article key={module.code} className="bg-surface-card border border-surface-border rounded-lg p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brand-orange font-semibold">{module.code}</p>
                    <h3 className="text-lg font-semibold text-white mt-1">{module.title}</h3>
                  </div>
                  <span className="rounded-full bg-brand-orange-light px-3 py-1 text-sm text-brand-orange">
                    {module.hours} hours
                  </span>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">Learning Outcomes</p>
                    <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                      {module.outcomes.map((outcome) => (
                        <li key={outcome} className="flex gap-2">
                          <span className="text-brand-orange">-</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-surface-input border border-surface-border p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">Evidence Requirement</p>
                    <p className="mt-2 text-sm text-zinc-300">{module.evidence}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="bg-surface-card border border-surface-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Training Resources</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {tools.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-orange">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white">Assessment Methods</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {assessments.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-orange">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Suggested Qualification Tracks</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['AI Prompting for Automation', 'For admin, operations, HR, sales, customer service, and legal support teams using AI to improve routine work.'],
              ['Data Collection and Annotation', 'For learners preparing for data labeling, content moderation, dataset QA, and AI operations roles.'],
              ['AI Workplace Specialist', 'For employees who combine prompting, verification, automation, policy compliance, and capstone implementation.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg bg-surface-input border border-surface-border p-4">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-card border border-surface-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Official Reference Points</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://www.tesda.gov.ph/Download/Training_Regulations?Searchcat=Training+Regulations" target="_blank" rel="noreferrer">TESDA Training Regulations</a>
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://www.tesda.gov.ph/Download/CBC" target="_blank" rel="noreferrer">TESDA Competency-Based Curriculum resources</a>
            <a className="text-brand-orange hover:text-brand-orange-hover" href="https://e-tesda.gov.ph/course/index.php?categoryid=21" target="_blank" rel="noreferrer">TESDA Online Program ICT courses</a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            This curriculum is a planning aid. Formal TESDA registration, assessment, and certification require the applicable TESDA Training Regulations, competency standards, program registration rules, qualified trainers, facilities, and assessment arrangements.
          </p>
        </section>
      </div>
    </div>
  );
}
