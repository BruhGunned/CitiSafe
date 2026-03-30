import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/core/Card';
import { RiskBadge } from '../components/core/RiskBadge';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function ReportsScreen() {
  const { areas, activeAreaId, setActiveArea } = useAppStore();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAreaClick = (id: string) => {
    setActiveArea(id);
    navigate('/dashboard');
  };

  const processedAreas = [...areas]
    .filter(a => filterRisk === 'all' || a.risk === filterRisk)
    .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return a.id.localeCompare(b.id); // Mock recent
    });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-white p-6 pt-14 pb-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.6)] rounded-b-[40px] border-b border-slate-800">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 px-1">Dashboard</h1>
        <p className="text-xs text-slate-400 font-medium px-2 leading-relaxed w-5/6">Sector performance & vulnerability analysis</p>

        {/* <button 
          onClick={handleExport}
          className="mt-6 w-full bg-[#22c55e] border border-[#16a34a] text-slate-900 font-extrabold text-[11px] uppercase tracking-[0.15em] py-4 rounded-xl hover:bg-green-500 transition-colors flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(34,197,94,0.3)] active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export JSON Data
        </button> */}

        <div className="mt-6 flex items-center bg-slate-800/80 p-1.5 pl-4 rounded-full border border-slate-700 focus-within:border-slate-500 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            type="text"
            placeholder="Search sectors or metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none ml-3 w-full text-slate-200 placeholder-slate-500 font-bold text-sm"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 mt-2">
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide px-1">
          <button
            onClick={() => setSortBy(sortBy === 'score' ? 'recent' : 'score')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 transition-colors ${sortBy === 'score' ? 'bg-slate-200 text-slate-700' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></svg>
            Sort: {sortBy}
          </button>

          <button
            onClick={() => {
              const risks: ('all' | 'high' | 'medium' | 'low')[] = ['all', 'high', 'medium', 'low'];
              setFilterRisk(risks[(risks.indexOf(filterRisk) + 1) % risks.length]);
            }}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 transition-colors ${filterRisk !== 'all' ? 'bg-slate-200 text-slate-700' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
            Risk: {filterRisk}
          </button>
        </div>

        <div className="flex flex-col gap-3 mt-1">
          {processedAreas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 font-bold text-sm">No sectors found.</p>
            </div>
          ) : processedAreas.map(area => (
            <Card
              key={area.id}
              className={`p-5 flex justify-between items-center cursor-pointer transition-all ${area.id === activeAreaId ? 'ring-2 ring-primary border-transparent shadow-[0_8px_20px_rgba(15,23,42,0.12)]' : 'hover:border-slate-300 shadow-sm'} active:scale-[0.98]`}
              noPadding
              onClick={() => handleAreaClick(area.id)}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center ${area.risk === 'high' ? 'bg-red-50 text-red-500 border border-red-100' : area.risk === 'medium' ? 'bg-yellow-50 text-yellow-500 border border-yellow-100' : 'bg-green-50 text-green-500 border border-green-100'}`}>
                  {area.risk === 'high' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                  ) : area.risk === 'medium' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">{area.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Score:</span>
                    <span className="font-extrabold text-slate-800 tabular-nums">{area.score.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pr-2">
                <RiskBadge level={area.risk} className="bg-transparent border-slate-200" />
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
