import { BookMarked, Video, FileText, ExternalLink, Search, Sparkles, GraduationCap, Trophy, Globe, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Lightbulb, Copy, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', name: 'All Resources' },
  { id: 'writing', name: 'Academic Writing' },
  { id: 'submission', name: 'Journal Submission' },
  { id: 'templates', name: 'LaTeX & Tools' },
];

// ─── STEP 1 CONTENT ──────────────────────────────────────────────────────────
const AbstractFormulaContent = () => {
  const [copied, setCopied] = useState(false);
  const example = `Diabetic retinopathy (DR) is a leading cause of preventable blindness, yet most patients show no symptoms until irreversible damage occurs [Background]. Existing automated screening systems fail to exceed 98% accuracy on standard benchmarks [Gap]. We propose a ConvNeXt-based deep learning model augmented with Squeeze-and-Excitation attention and a KAN-inspired classifier, trained on the APTOS 2019 dataset of 3,662 retinal images [Method]. Our model achieves 98.56% accuracy and 98.55% F1-score, surpassing all prior single-model and ensemble approaches [Result]. This system provides a practical, deployable tool for rural DR screening programs where specialist access is limited [Impact].`;

  const handleCopy = () => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 font-medium">An abstract is the first thing an editor reads. If it's weak, your paper gets rejected without anyone reading it. Most students write summaries — not abstracts. Here's the difference.</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest">The 5-Part Formula — Every Abstract Needs All 5</h4>
        {[
          { num: 1, label: 'Background', color: 'bg-blue-500', tip: 'What problem exists in the world? 1–2 sentences. Use a real number or statistic if possible.', example: '"DR is responsible for millions of cases of preventable blindness globally."' },
          { num: 2, label: 'Gap', color: 'bg-orange-500', tip: 'What has NOT been solved yet? This is what makes your paper necessary. 1 sentence.', example: '"Existing systems fail to exceed 98% accuracy and cannot scale to rural settings."' },
          { num: 3, label: 'Method', color: 'bg-purple-500', tip: 'What did YOU do? Name your technique, dataset, and approach. 2–3 sentences.', example: '"We propose a ConvNeXt model with SE attention trained on APTOS 2019."' },
          { num: 4, label: 'Result', color: 'bg-green-500', tip: 'What numbers did you get? Be specific — accuracy %, F1, error rate. 1–2 sentences.', example: '"Our model achieves 98.56% accuracy, surpassing all prior methods."' },
          { num: 5, label: 'Impact', color: 'bg-red-500', tip: 'Why does this matter to the world? 1 sentence. Think of a real person who benefits.', example: '"This enables practical deployment in rural clinics with no specialist access."' },
        ].map(item => (
          <div key={item.num} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className={`w-7 h-7 rounded-lg ${item.color} text-white flex items-center justify-center font-black text-xs shrink-0`}>{item.num}</div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-sm mb-1">{item.label}</div>
              <div className="text-xs text-slate-500 mb-2 leading-relaxed">{item.tip}</div>
              <div className="text-xs text-slate-400 italic bg-white border border-slate-100 rounded-lg px-3 py-2">{item.example}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest">Real Example — Copy & Adapt</h4>
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-primary font-bold px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 text-xs leading-relaxed font-mono">
          {example}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { check: true, text: 'Write 150–250 words (check journal limit)' },
          { check: true, text: 'Include at least one specific number/metric' },
          { check: true, text: 'No citations inside the abstract' },
          { check: false, text: 'Don\'t start with "This paper..." or "In this study..."' },
          { check: false, text: 'No undefined abbreviations (spell out DR, CNN, IoT etc.)' },
          { check: false, text: 'Don\'t copy-paste from your introduction' },
        ].map((item, i) => (
          <div key={i} className={`flex gap-2 items-start p-3 rounded-lg text-xs font-medium ${item.check ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {item.check ? <CheckCircle className="w-4 h-4 shrink-0 text-green-500 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />}
            {item.text}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400 font-medium mb-2">📚 Official Reference (for deeper reading)</p>
        <a href="https://www.nature.com/nature-index/news/how-to-write-good-abstract-scientific-research-paper" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
          Nature Index: Writing Abstracts That Stand Out <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

const ManuscriptStructureContent = () => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800 font-medium">Most students write their paper like an essay. Journals expect a very specific structure called IMRaD. Editors desk-reject papers that don't follow it — before even checking the science.</p>
    </div>

    <div className="space-y-3">
      {[
        { section: 'Title', what: 'What you did + what you found — in 12 words or less', tip: 'Include your method and result. Bad: "A Study on Deep Learning." Good: "ConvNeXt-Based Diabetic Retinopathy Detection Achieving 98.56% Accuracy on APTOS 2019"', lines: '1 sentence' },
        { section: 'Abstract', what: 'Mini version of the whole paper — 5 parts (see Abstract guide)', tip: 'Write this LAST, after everything else is done', lines: '150–250 words' },
        { section: 'Introduction', what: 'Why does this problem matter? What has been tried? What is missing? What do you propose?', tip: 'End with a clear "Contributions" bullet list — reviewers look for this', lines: '500–800 words' },
        { section: 'Related Work / Literature Review', what: 'What have other researchers done? Where did they fail?', tip: 'Don\'t just list papers. Compare them: "Method A achieved X but failed at Y. Method B solved Y but introduced Z."', lines: '400–600 words' },
        { section: 'Methodology', what: 'Exactly HOW did you build your system? Be so specific that someone else can reproduce it', tip: 'Include: dataset details, model architecture, training setup (GPU, optimizer, learning rate, epochs, batch size)', lines: '600–1000 words' },
        { section: 'Results & Discussion', what: 'Your numbers + what they mean', tip: 'Always include a comparison table against prior work. State clearly: "Our method outperforms X by Y%"', lines: '500–800 words' },
        { section: 'Conclusion', what: 'Summary + future work', tip: 'Don\'t repeat your abstract word for word. State what you proved and what you\'d do next.', lines: '200–300 words' },
        { section: 'References', what: 'Every paper you cited', tip: 'Use IEEE format for CS/ECE papers. Use APA for medical. Use the journal\'s template — wrong format = desk rejection', lines: '20–40 citations' },
      ].map((item, i) => (
        <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-black flex items-center justify-center">{i + 1}</div>
              <span className="font-bold text-slate-800 text-sm">{item.section}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{item.lines}</span>
          </div>
          <div className="px-4 py-3 space-y-1.5">
            <p className="text-xs text-slate-600 font-medium">{item.what}</p>
            <p className="text-xs text-primary/70 italic flex gap-1.5"><Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />{item.tip}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-400 font-medium mb-2">📚 Official Reference</p>
      <a href="https://www.nature.com/nature-portfolio/for-authors/write" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
        Nature Portfolio: How to Write Your Paper <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </div>
);

// ─── STEP 2 CONTENT ──────────────────────────────────────────────────────────
const JournalSelectionContent = () => (
  <div className="space-y-6">
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
      <p className="text-sm text-purple-800 font-medium">Submitting to the wrong journal is the #1 reason good papers get rejected instantly (called a "desk rejection" — the editor rejects without sending to reviewers). Here's how to pick right.</p>
    </div>

    <div className="space-y-3">
      <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest">Step-by-step — How to Pick Your Journal</h4>
      {[
        { step: '1', title: 'Match your topic to the journal scope', desc: 'Read the journal\'s "Aims and Scope" page. If your paper is about diabetic retinopathy + deep learning, submit to journals like "Computers in Biology and Medicine" — not "Nature" or a civil engineering journal. Scope mismatch = instant desk rejection.' },
        { step: '2', title: 'Check if it\'s Scopus indexed', desc: 'Go to scopus.com/sources → type the journal name → if it appears, it\'s valid. Scopus-indexed = UGC CARE Group II = acceptable for your PhD, promotion, or college requirement. Don\'t submit to journals not on this list.' },
        { step: '3', title: 'Understand Q1/Q2/Q3/Q4', desc: 'Q1 = top 25% of journals in that field (hardest to get in, most prestigious). Q2 = next 25% (still very good, higher acceptance rate). For a final year student paper, Q2 is a realistic and respectable target. Q1 needs very strong results and extensive comparison.' },
        { step: '4', title: 'Check the cost', desc: 'Many journals are FREE to publish (subscription model — readers pay, authors don\'t). Some are Open Access with APC (you pay ₹15,000–₹1,50,000 to make it freely readable). Always check "Author Fees" or "Open Access options" on the journal homepage before submitting.' },
        { step: '5', title: 'Check the speed', desc: 'Look at the journal\'s average review time. Some Elsevier journals decide in 4–6 weeks. Some Springer journals take 6 months. Use our journal finder to filter by speed.' },
        { step: '6', title: 'Look at papers they\'ve already published', desc: 'Go to the journal\'s recent issues. If papers similar to yours (same method, same domain, similar results quality) have been published — that\'s strong evidence your paper fits.' },
      ].map((item, i) => (
        <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center font-black text-xs shrink-0">{item.step}</div>
          <div>
            <div className="font-bold text-slate-800 text-sm mb-1">{item.title}</div>
            <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-slate-900 rounded-xl p-4">
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">Quick Decision Table</p>
      <table className="w-full text-xs text-slate-300">
        <thead><tr className="text-slate-400 border-b border-slate-700"><th className="text-left pb-2">If you have...</th><th className="text-left pb-2">Target this</th></tr></thead>
        <tbody className="space-y-1">
          {[
            ['State-of-the-art results (98%+)', 'Q1 Scopus journal'],
            ['Good results, novel method', 'Q2 Scopus journal'],
            ['First publication, need fast', 'Fast Q2 (e.g. Informatics in Medicine Unlocked)'],
            ['No budget for APC', 'Free Elsevier subscription journals'],
            ['Need UGC CARE recognition', 'Any Scopus-indexed journal (= UGC CARE Group II)'],
          ].map(([cond, rec], i) => (
            <tr key={i} className="border-b border-slate-800">
              <td className="py-2 pr-4">{cond}</td>
              <td className="py-2 text-primary font-semibold">{rec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="border-t border-slate-100 pt-4 space-y-2">
      <p className="text-xs text-slate-400 font-medium">📚 Official References</p>
      <a href="https://journalfinder.elsevier.com/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
        Elsevier Journal Finder Tool (paste your abstract) <ExternalLink className="w-3 h-3" />
      </a>
      <a href="https://www.elsevier.com/products/scopus/metrics/citescore" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
        Scopus CiteScore & Quartile Metrics Explained <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </div>
);

const ScopusUGCContent = () => (
  <div className="space-y-6">
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
      <p className="text-sm text-indigo-800 font-medium">Every student asks: "Is Scopus the same as UGC CARE?" The answer is almost yes — and this confusion costs students months of time. Here's the full picture in plain English.</p>
    </div>

    {[
      { title: 'What is Scopus?', color: 'border-blue-200 bg-blue-50', body: 'Scopus is a huge database maintained by Elsevier that tracks over 27,000 academic journals worldwide. When people say a journal is "Scopus indexed" it means Elsevier has reviewed it and decided it meets quality standards. Think of it as a quality seal — like ISI certification for journals.' },
      { title: 'What is Web of Science (WoS)?', color: 'border-green-200 bg-green-50', body: 'Web of Science is a similar database by Clarivate. It\'s slightly more selective than Scopus. Being in both WoS and Scopus is a strong signal of journal quality. WoS has two lists: SCIE (Science Citation Index — top tier) and ESCI (emerging journals).' },
      { title: 'What is UGC CARE?', color: 'border-orange-200 bg-orange-50', body: 'UGC CARE is the Indian government\'s list of approved academic journals for promotions, PhD submissions, and institutional recognition. It has two groups: Group I (directly approved by UGC) and Group II (all Scopus + WoS journals). So any Scopus journal is automatically UGC CARE Group II.' },
      { title: '⚠️ Important: UGC changed their policy in Feb 2025', color: 'border-red-200 bg-red-50', body: 'As of February 2025, UGC officially stopped maintaining their own separate list. They now accept Scopus and WoS indexing as the primary quality standard. So for all PhD submissions and promotion applications in 2025 onwards — Scopus indexed = UGC approved. You no longer need to check a separate UGC list.' },
    ].map((item, i) => (
      <div key={i} className={`border ${item.color} rounded-xl p-4`}>
        <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
      </div>
    ))}

    <div>
      <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">How to verify any journal in 30 seconds</h4>
      {[
        'Go to scopus.com/sources',
        'Type the journal name in the search box',
        'If it appears → Scopus indexed → UGC CARE Group II → Submit safely',
        'If it doesn\'t appear → Do NOT submit → Likely predatory or unrecognised',
      ].map((step, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
          <div className="w-5 h-5 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</div>
          <span className="text-xs text-slate-600 font-medium">{step}</span>
        </div>
      ))}
      <a href="https://www.scopus.com/sources" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-black mt-3 hover:underline">
        Open Scopus Source List <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </div>
);

// ─── STEP 3 CONTENT ──────────────────────────────────────────────────────────
const LaTeXContent = () => (
  <div className="space-y-6">
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
      <Lightbulb className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
      <p className="text-sm text-green-800 font-medium">Most journals want papers in LaTeX format — especially IEEE and Springer. It sounds scary but you only need to know 10% of LaTeX to submit a paper. Here's that 10%.</p>
    </div>

    <div>
      <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">What is LaTeX and why do journals want it?</h4>
      <p className="text-xs text-slate-600 leading-relaxed">LaTeX is a document formatting system used by scientists worldwide. Unlike Word, it handles equations, figures, and references perfectly. Journals love it because it produces consistent, professional output. You write plain text with commands like <code className="bg-slate-100 px-1 rounded text-primary">\textbf{"{bold text}"}</code> and LaTeX handles the formatting automatically.</p>
    </div>

    <div>
      <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">The 5 commands you actually need</h4>
      {[
        { cmd: '\\section{Introduction}', what: 'Creates a numbered section heading' },
        { cmd: '\\cite{author2024}', what: 'Adds a citation number like [1]' },
        { cmd: '\\includegraphics{fig1.png}', what: 'Inserts a figure/image' },
        { cmd: '\\begin{table}...\\end{table}', what: 'Creates a formatted table' },
        { cmd: '\\textbf{bold} \\textit{italic}', what: 'Bold and italic text' },
      ].map((item, i) => (
        <div key={i} className="flex gap-3 items-center py-2.5 border-b border-slate-100 last:border-0">
          <code className="text-xs bg-slate-900 text-green-400 px-3 py-1.5 rounded-lg font-mono shrink-0">{item.cmd}</code>
          <span className="text-xs text-slate-500">{item.what}</span>
        </div>
      ))}
    </div>

    <div>
      <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest mb-3">Where to get journal templates (free)</h4>
      {[
        { name: 'IEEE Template', desc: 'For all IEEE journals and conferences', url: 'https://www.ieee.org/conferences/publishing/templates.html', tag: 'IEEE' },
        { name: 'Elsevier LaTeX Template', desc: 'For all Elsevier journals (single column for submission)', url: 'https://www.elsevier.com/authors/policies-and-guidelines/latex-instructions', tag: 'Elsevier' },
        { name: 'Springer Template', desc: 'For Springer journals and Lecture Notes', url: 'https://www.springer.com/gp/livingreviews/latex-instructions', tag: 'Springer' },
        { name: 'Overleaf Template Gallery', desc: '1000+ ready-to-use journal templates — just open and fill in', url: 'https://www.overleaf.com/gallery/tagged/academic-journal', tag: 'All' },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
          <div>
            <div className="text-xs font-bold text-slate-800">{item.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
          </div>
          <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary font-black bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors shrink-0 ml-3">
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ))}
    </div>

    <div className="border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-400 font-medium mb-2">📚 Official Tutorial — 30 minute beginner guide</p>
      <a href="https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
        Overleaf: Learn LaTeX in 30 Minutes (no installation needed) <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </div>
);

const ReviewerResponseContent = () => {
  const [copied, setCopied] = useState(false);
  const template = `Dear Editor,

We thank the reviewers for their thorough and constructive feedback. We have carefully addressed all comments. Below we provide a point-by-point response. All changes are highlighted in yellow in the revised manuscript.

---
REVIEWER 1

Comment 1: [Paste reviewer's exact comment here]

Response: Thank you for this observation. We agree with the reviewer's point. We have [describe exactly what you changed]. This is now reflected in Section X, Lines Y–Z of the revised manuscript.

[If you disagree:]
Response: We respectfully note that [your counter-argument with evidence/citation]. However, we have added a clarification in Section X to make this point clearer for readers.

---
We hope the revised manuscript now meets the journal's standards.

Sincerely,
[Your Name]`;

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-800 font-medium">Getting reviewer comments feels like rejection but it's actually GOOD — it means your paper passed the first filter. Most students don't know how to respond and their papers get rejected in round 2. Here's exactly what to do.</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest">The 3 types of reviewer decisions</h4>
        {[
          { type: 'Major Revision', color: 'bg-orange-100 text-orange-800 border-orange-200', meaning: 'Your paper has potential but needs significant changes. Most common outcome for first-time submitters. You have 1–3 months to revise and resubmit.', action: 'Revise every single point. Don\'t skip anything. Be respectful even if you disagree.' },
          { type: 'Minor Revision', color: 'bg-green-100 text-green-800 border-green-200', meaning: 'Almost accepted. Small fixes needed — typos, clarifications, one extra experiment. Usually 2–4 weeks to respond.', action: 'Fix everything quickly. This is nearly an acceptance. Don\'t delay.' },
          { type: 'Reject', color: 'bg-red-100 text-red-800 border-red-200', meaning: 'The paper doesn\'t fit this journal OR has fundamental flaws. Not the end — most published papers were rejected at least once.', action: 'Read feedback carefully. Fix the issues. Submit to a different journal. Do not resubmit to same journal unless invited.' },
        ].map((item, i) => (
          <div key={i} className={`border ${item.color} rounded-xl p-4`}>
            <div className="font-bold text-sm mb-1">{item.type}</div>
            <p className="text-xs mb-2 leading-relaxed opacity-80">{item.meaning}</p>
            <p className="text-xs font-semibold flex gap-1.5"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{item.action}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-heading font-bold text-slate-700 text-sm uppercase tracking-widest">Copy-paste response template</h4>
          <button onClick={() => { navigator.clipboard.writeText(template); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1.5 text-xs text-primary font-bold px-3 py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">{template}</pre>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { do: true, text: 'Respond to every single reviewer comment — never skip one' },
          { do: true, text: 'Quote the reviewer\'s exact comment before your response' },
          { do: true, text: 'Mention the exact line/section number where you made changes' },
          { do: false, text: 'Don\'t be defensive or argue without evidence' },
          { do: false, text: 'Don\'t just say "we have made changes" — show what specifically changed' },
          { do: false, text: 'Don\'t take more than the deadline — late revisions often get rejected' },
        ].map((item, i) => (
          <div key={i} className={`flex gap-2 items-start p-3 rounded-lg text-xs font-medium ${item.do ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {item.do ? <CheckCircle className="w-4 h-4 shrink-0 text-green-500 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />}
            {item.text}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400 font-medium mb-2">📚 Official Reference</p>
        <a href="https://www.springer.com/gp/authors-editors/journal-author/revising-your-paper-and-responding-to-reviewer-comments/1422" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
          Springer: Revising & Responding to Reviewers (official guide) <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

// ─── ROADMAP DATA ─────────────────────────────────────────────────────────────
const roadmapSteps = [
  {
    id: 1,
    title: 'Writing & Polishing',
    status: 'Step 1',
    description: 'Learn how to write a publication-ready abstract and structure your manuscript correctly.',
    resources: [
      {
        title: 'How to Write a Perfect Abstract',
        desc: 'The 5-part formula used by every published researcher. Includes a real example you can copy and adapt.',
        tag: 'Interactive Guide',
        icon: <FileText className="w-5 h-5" />,
        color: 'bg-blue-500',
        content: <AbstractFormulaContent />
      },
      {
        title: 'Manuscript Structure (IMRaD)',
        desc: 'Exactly what goes in each section — with word counts, tips, and the common mistakes that cause desk rejections.',
        tag: 'Checklist',
        icon: <Trophy className="w-5 h-5" />,
        color: 'bg-orange-500',
        content: <ManuscriptStructureContent />
      }
    ]
  },
  {
    id: 2,
    title: 'Journal Selection',
    status: 'Step 2',
    description: 'Find the right journal and understand what Scopus, UGC CARE, Q1/Q2 actually mean.',
    resources: [
      {
        title: 'How to Pick the Right Journal',
        desc: 'A 6-step plain-English guide to choosing your journal — including a quick decision table based on your paper\'s quality.',
        tag: 'Step-by-Step',
        icon: <Search className="w-5 h-5" />,
        color: 'bg-purple-500',
        content: <JournalSelectionContent />
      },
      {
        title: 'Scopus vs UGC CARE — Explained Simply',
        desc: 'What these terms actually mean, why they matter for your career in India, and how to verify any journal in 30 seconds.',
        tag: 'Explainer',
        icon: <Globe className="w-5 h-5" />,
        color: 'bg-indigo-500',
        content: <ScopusUGCContent />
      }
    ]
  },
  {
    id: 3,
    title: 'Final Submission',
    status: 'Step 3',
    description: 'Get your LaTeX template ready and learn how to respond to reviewer comments professionally.',
    resources: [
      {
        title: 'LaTeX for Students — No Experience Needed',
        desc: 'The only LaTeX commands you actually need to submit a paper, plus direct links to free templates for IEEE, Elsevier, and Springer.',
        tag: 'Tutorial',
        icon: <BookMarked className="w-5 h-5" />,
        color: 'bg-[#0fad6e]',
        content: <LaTeXContent />
      },
      {
        title: 'How to Respond to Reviewer Comments',
        desc: 'What Major Revision, Minor Revision and Reject actually mean — with a copy-paste response template used by real researchers.',
        tag: 'Template',
        icon: <Video className="w-5 h-5" />,
        color: 'bg-red-500',
        content: <ReviewerResponseContent />
      }
    ]
  }
];

// ─── EXPANDABLE CARD ─────────────────────────────────────────────────────────
function ResourceCard({ res, index, onOpen }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="luxury-card group transition-all hover:border-primary/30"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl ${res.color} text-white shadow-xl shadow-black/5`}>
            {res.icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">{res.tag}</span>
        </div>
        <h3 className="font-heading font-black text-xl mb-3 text-slate-900 group-hover:text-primary transition-colors">{res.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium line-clamp-2">{res.desc}</p>
        <button
          onClick={() => onOpen(res)}
          className="inline-flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:gap-4 transition-all"
        >
          <span>Open Full Guide</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function ResourceModal({ res, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && res && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: 20 }}
             className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl z-10 p-8 md:p-12 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl ${res.color} text-white flex items-center justify-center shadow-xl`}>
                {res.icon}
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all">
                ✕
              </button>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-4 leading-tight">{res.title}</h2>
            <p className="text-sm md:text-base text-slate-500 mb-8 font-medium leading-relaxed">{res.desc}</p>
            <div className="border-t border-slate-100 pt-8">
              {res.content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Resources() {
  const [activeRes, setActiveRes] = useState(null);

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <ResourceModal
        res={activeRes}
        isOpen={!!activeRes}
        onClose={() => setActiveRes(null)}
      />

      {/* Hero */}
      <div className="relative mb-24">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-14 md:p-20 bg-white/50 backdrop-blur-xl relative overflow-hidden border-white shadow-2xl">
          <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-14">
            <div className="w-28 h-28 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-[0_20px_40px_rgba(108,71,255,0.1)]">
              <GraduationCap className="w-14 h-14 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Peer-Reviewed Guidance</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight leading-[1.1] text-slate-900">Publication <br /><span className="text-slate-400">Roadmap</span></h2>
              <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">Plain-English blueprints for navigating the complex web of academic publishing. Master every phase from drafting to peer response.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Steps */}
      <div className="space-y-32 mb-32">
        {roadmapSteps.map((step, idx) => (
          <div key={step.id} className="relative">
            {idx !== roadmapSteps.length - 1 && (
              <div className="absolute left-10 top-24 bottom-[-80px] w-px bg-gradient-to-b from-slate-200 via-slate-100 to-transparent hidden md:block" />
            )}
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <div className="md:w-80 shrink-0">
                <div className="sticky top-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black shadow-lg shadow-black/5 border border-slate-100">{step.id}</div>
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] text-primary">{step.status}</span>
                  </div>
                  <h2 className="text-3xl font-heading font-black text-slate-900 mb-4">{step.title}</h2>
                  <p className="text-sm text-slate-500 font-medium leading-[1.8] mb-8">{step.description}</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pro Tip</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">Explore the interactive modules to the right for templates, formulas, and checklists used by successful researchers.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
                {step.resources.map((res, i) => (
                  <ResourceCard key={res.title} res={res} index={i} onOpen={setActiveRes} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="luxury-card p-16 bg-white/50 backdrop-blur-xl border-white text-center relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-20 h-20 text-primary opacity-5 absolute -right-4 -top-4 group-hover:rotate-12 group-hover:scale-125 transition-transform" />
        <h3 className="text-3xl font-heading font-black text-slate-900 mb-4">Commence Your Search</h3>
        <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto leading-relaxed">The knowledge library is only the beginning. Deploy the Journal Explorer to find the perfect technical match for your work.</p>
        <Link to="/journals" className="btn-primary !px-12 !py-6 text-[10px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-4 shadow-2xl">
          Launch Discovery Core <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

    </div>
  );
};