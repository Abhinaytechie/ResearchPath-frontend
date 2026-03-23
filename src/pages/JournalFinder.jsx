import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Search, Heart, Globe, Database } from 'lucide-react';
import { JournalPopover } from '../components/floating/JournalPopover';
import { SaveTooltip } from '../components/floating/SaveTooltip';
import { motion } from 'framer-motion';

function JournalCard({ journal, index, showSave, savedIds, toggleSave }) {
  const topics = (journal.topics || []).slice(0, 3);
  const weeksLabel = journal.source === 'exa' ? '—' : `${journal.avg_weeks}w`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="luxury-card p-8 relative group cursor-pointer border-slate-100/50 hover:border-primary/30"
    >
      {showSave && (
        <div className="absolute top-8 right-8 z-10">
          <SaveTooltip isSaved={savedIds.has(journal.id)} onClick={(e) => toggleSave(journal.id, e)}>
            <div className={`p-3 rounded-xl transition-all ${savedIds.has(journal.id) ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 text-slate-500 hover:bg-white hover:text-red-500 border border-slate-200'}`}>
              <Heart className={`w-4 h-4 ${savedIds.has(journal.id) ? 'fill-current' : ''}`} />
            </div>
          </SaveTooltip>
        </div>
      )}

      <JournalPopover journal={journal}>
        <div className="w-full">
          <div className="mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-2 block">{journal.domain}</span>
            <h3 className="text-xl font-heading font-black text-slate-900 leading-[1.2] pr-12 group-hover:text-primary transition-colors">{journal.name}</h3>
          </div>

          {journal.source !== 'exa' && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Quartile</p>
                <p className="text-xs font-black text-slate-900">{journal.quartile}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Speed</p>
                <p className="text-xs font-black text-slate-900">{weeksLabel}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Impact</p>
                <p className="text-xs font-black text-emerald-600">{journal.impact_factor}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <span key={t} className="text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-lg">
                {t}
              </span>
            ))}
          </div>
        </div>
      </JournalPopover>
    </motion.div>
  );
}

export default function JournalFinder({ addToast }) {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [journals, setJournals] = useState([]);
  const [searchBundle, setSearchBundle] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialSearch) {
      handleSearchDirect(initialSearch);
    } else {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jRes, sRes] = await Promise.all([
        api.get('/journals/'),
        api.get('/journals/saved')
      ]);
      setJournals(jRes.data);
      setSearchBundle(null);
      setSavedIds(new Set(sRes.data.map(s => s.journal_id)));
    } catch (error) {
      console.error(error);
      addToast('Failed to load journals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDirect = async (q) => {
    if (!q) {
      await fetchData();
      return;
    }
    setLoading(true);
    try {
      // Need saved journals state up to date if we are jumping straight to search
      const sRes = await api.get('/journals/saved');
      setSavedIds(new Set(sRes.data.map(s => s.journal_id)));

      const res = await api.get('/journals/search', { params: { search: q } });
      setSearchBundle({
        rag: res.data.rag || [],
        exa: res.data.exa || [],
        exa_key_configured: Boolean(res.data.exa_key_configured),
      });
    } catch (error) {
      console.error(error);
      addToast('Search failed — try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await handleSearchDirect(search.trim());
  };

  const toggleSave = async (id, e) => {
    e.stopPropagation();
    try {
      if (savedIds.has(id)) {
        await api.delete(`/journals/${id}/save`);
        savedIds.delete(id);
        addToast('Removed from saved list', 'info');
      } else {
        await api.post(`/journals/${id}/save`);
        savedIds.add(id);
        addToast('Saved journal successfully');
      }
      setSavedIds(new Set(savedIds));
    } catch (err) {
      addToast('Failed to update saved journals', 'error');
    }
  };

  const searchMode = searchBundle !== null;
  const ragList = searchBundle?.rag || [];
  const exaList = searchBundle?.exa || [];
  const exaKeyConfigured = searchBundle?.exa_key_configured === true;

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg border border-slate-100">
                 <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Scopus-indexed discovery</span>
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-tight">Scholar's <br /><span className="text-slate-600">Explorer</span></h1>
           <p className="mt-4 text-sm font-medium text-slate-600 max-w-md">Curated venues are Scopus-listed in our index. Directory hits are restricted to official <span className="font-semibold text-slate-800">scopus.com</span> pages.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl min-w-0 relative group">
           <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
           <div className="relative flex items-stretch rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 transition-all">
              <label htmlFor="journal-search" className="sr-only">Search journals</label>
              <span className="flex shrink-0 items-center justify-center pl-4 pr-2 text-slate-400 group-focus-within:text-primary transition-colors" aria-hidden>
                <Search className="w-5 h-5" strokeWidth={2.25} />
              </span>
              <input 
                id="journal-search"
                type="search" 
                autoComplete="off"
                placeholder="Search Scopus-indexed journals & official listings…" 
                className="min-w-0 flex-1 border-0 bg-transparent py-4 pr-3 text-base font-bold text-slate-900 placeholder:text-slate-500 outline-none ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
               <button type="submit" className="m-1.5 shrink-0 self-center rounded-xl bg-primary px-5 py-2.5 font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-accent">
                 Search
               </button>
           </div>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
           <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
             {search.trim() ? 'Ranking corpus & Exa (Scopus)' : 'Loading Scopus-indexed journals'}
           </p>
        </div>
      ) : searchMode ? (
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">Top 3 — Scopus corpus</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Semantic match · Scopus-indexed titles only</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ragList.map((j, i) => (
                <JournalCard key={j.id} journal={j} index={i} showSave savedIds={savedIds} toggleSave={toggleSave} />
              ))}
            </div>
            {ragList.length === 0 && (
              <p className="text-sm text-slate-600 font-medium text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">No Scopus-indexed matches in the corpus for this query.</p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">Top 3 — Scopus.com directory</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Exa search · scopus.com/sources pages only</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exaList.map((j, i) => (
                <JournalCard key={j.id} journal={j} index={i} showSave={false} savedIds={savedIds} toggleSave={toggleSave} />
              ))}
            </div>
            {exaList.length === 0 && (
              <p className="text-sm text-slate-600 font-medium text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 leading-relaxed">
                {!exaKeyConfigured ? (
                  <>Add <code className="text-xs bg-white px-1.5 py-0.5 rounded border text-slate-800">EXA_API_KEY</code> to <code className="text-xs bg-white px-1.5 py-0.5 rounded border text-slate-800">backend/.env</code> and restart the API.</>
                ) : (
                  <>No Scopus.com results from Exa for this query. Try shorter keywords (e.g. journal field name) or check your Exa quota.</>
                )}
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.map((journal, i) => (
            <JournalCard key={journal.id} journal={{ ...journal, source: 'rag' }} index={i} showSave savedIds={savedIds} toggleSave={toggleSave} />
          ))}
          {journals.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-40 luxury-card bg-slate-50/50 border-dashed border-2">
               <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8">
                 <Search className="w-10 h-10 text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">No Scopus-indexed journals in the corpus</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
