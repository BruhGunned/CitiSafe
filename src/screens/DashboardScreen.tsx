import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/core/Card';
import { RiskBadge } from '../components/core/RiskBadge';
import { ProgressBar } from '../components/core/ProgressBar';
import { useState, useRef, useEffect } from 'react';

export function DashboardScreen() {
  const { areas, activeAreaId, setActiveArea } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];
  const filteredAreas = areas.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-white p-4 pt-14 pb-14 shadow-md rounded-b-[40px] border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 px-2">District Reports</h1>
        <div className="flex flex-col items-start bg-slate-800/80 p-4 rounded-[24px] border border-slate-700/50 gap-2.5">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 ml-1">Active Sector</span>
          <div className="relative w-full" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search sector..."
              value={isDropdownOpen ? searchQuery : activeArea.name}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                setSearchQuery('');
              }}
              className="bg-slate-700/50 text-base font-bold text-white outline-none w-full p-4 pl-5 rounded-xl border border-slate-600/50 text-left focus:ring-2 focus:ring-slate-500 transition-all placeholder:text-slate-400"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="8" /></svg>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 py-2 custom-scrollbar">
                {filteredAreas.length > 0 ? filteredAreas.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveArea(a.id);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-bold hover:bg-slate-700 transition-colors ${a.id === activeAreaId ? 'text-green-400 bg-slate-700/50' : 'text-slate-200'}`}
                  >
                    {a.name}
                  </button>
                )) : (
                  <div className="px-5 py-3 text-sm text-slate-400 font-medium">No sectors found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6 mt-2 pb-12">
        {/* Opportunity Score Card */}
        <Card className={`relative flex flex-col p-6 shadow-card overflow-hidden transition-colors duration-500 ${activeArea.risk === 'low' ? 'bg-gradient-to-br from-green-50/50 to-white border-green-200' :
          activeArea.risk === 'medium' ? 'bg-gradient-to-br from-yellow-50/50 to-white border-yellow-200' :
            'bg-gradient-to-br from-red-50/50 to-white border-red-200'
          }`}>
          {/* Decorative background blob */}
          <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-[0.15] pointer-events-none transition-colors duration-500 ${activeArea.risk === 'low' ? 'bg-green-500' :
            activeArea.risk === 'medium' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />

          {/* Active Sector Name at the top */}
          <div className="flex justify-between items-start mb-6 border-b border-slate-900/5 pb-4 relative">
            <div>
              <p className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-slate-400/80 mb-1">Sector Analyzed</p>
              <h1 className={`uppercase text-4xl font-black tracking-tight transition-colors duration-500 ${activeArea.risk === 'low' ? 'text-green-700' :
                activeArea.risk === 'medium' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                {activeArea.name}
              </h1>
            </div>
            <RiskBadge level={activeArea.risk} className="shadow-sm" />
          </div>

          <div className="mb-8 relative mt-1">
            <h2 className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-slate-500 mb-2">Opportunity Score</h2>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-[88px] font-black leading-[0.8] tracking-tighter tabular-nums text-slate-900 drop-shadow-xl">{activeArea.score.toFixed(1)}</span>
              <span className="text-[11px] font-extrabold tracking-widest text-[#16a34a] mb-1 px-3 py-1.5 bg-[#22c55e]/10 rounded-full border border-[#22c55e]/30 flex items-center gap-1 shadow-sm uppercase">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                1.2
              </span>
            </div>
            <p className="text-[11px] text-slate-500 w-[95%] leading-relaxed font-bold">Composite metric measuring risk potential versus infrastructure stability.</p>
          </div>

          <div className="relative">
            <ProgressBar
              value={activeArea.score / 10}
              label="Sector Risk Saturation"
              colorClass={activeArea.risk === 'low' ? 'bg-green-500' : activeArea.risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}
            />
          </div>
        </Card>

        {/* Environmental Factors */}
        <div>
          <h3 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-widest mb-3 px-2">Environmental Factors</h3>
          <Card className="flex flex-col gap-6 p-6">
            <FactorRow label="Lighting Density" desc="Grid Efficiency" score={activeArea.factors.lighting} />
            <FactorRow label="Crowd Volume" desc="Foot Traffic Flow" score={activeArea.factors.crowd} />
            <FactorRow label="Law Enforcement" desc="Response Readiness" score={activeArea.factors.police} />
            <FactorRow label="CCTV Surveillance" desc="Density of Coverage" score={activeArea.factors.cctvDensity} />
            <FactorRow label="Escape Routes" desc="Quick Egress Paths" score={activeArea.factors.escapeRoutes} />
            <FactorRow label="Recent Incidents" desc="Historical Crime Levels" score={activeArea.factors.recentIncidents} />
          </Card>
        </div>

        {/* Contribution Breakdown */}
        <div>
          <h3 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-widest mb-3 px-2">Contribution Breakdown</h3>
          <Card className="flex flex-col gap-5 p-6">
            <ProgressBar value={activeArea.metrics.crimeImpact / 100} label="Crime Impact" colorClass="bg-red-400" />
            <ProgressBar value={activeArea.metrics.lightingDeficiency / 100} label="Lighting Deficiency" colorClass="bg-yellow-400" />
            <ProgressBar value={activeArea.metrics.crowdExposure / 100} label="Crowd Exposure" colorClass="bg-blue-400" />
            <ProgressBar value={activeArea.metrics.policePresence / 100} label="Police Presence" colorClass="bg-green-400" />
            <ProgressBar value={activeArea.metrics.surveillanceGap / 100} label="Surveillance Gap" colorClass="bg-purple-400" />
            <ProgressBar value={activeArea.metrics.escapeVulnerability / 100} label="Escape Vulnerability" colorClass="bg-orange-400" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function FactorRow({ label, desc, score }: { label: string, desc: string, score: number }) {
  const color = score > 7 ? 'bg-green-500' : score > 4 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-bold text-slate-800 text-[15px]">{label}</h4>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= Math.ceil(score / 3.3) ? color : 'bg-slate-100'}`}
          />
        ))}
      </div>
    </div>
  );
}
