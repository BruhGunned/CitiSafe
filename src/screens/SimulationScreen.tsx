import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/core/Card';
import { RiskBadge } from '../components/core/RiskBadge';
import { SliderInput } from '../components/core/SliderInput';
// Removed unused react hooks

export function SimulationScreen() {
  const { areas, activeAreaId, simulation, updateSimulation, resetSimulation, simScore, simRisk, isSimulating, runLLMSimulation } = useAppStore();
  const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];

  // Removed auto-debounce to protect free tier API limits

  const projectedScore = simScore;
  const projectedRisk = simRisk;
  
  const scoreDiff = projectedScore - activeArea.score;
  const isDiff = Math.abs(scoreDiff) > 0.05;

  return (
    <div className="min-h-screen flex flex-col pt-0 pb-20 bg-background">
      <div className="bg-[#0f172a] text-white p-6 pt-14 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-widest uppercase text-slate-300">AI Predictive Engine</h1>
          <button onClick={resetSimulation} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>

        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-1">AI Predicted Risk Index</p>
          <div className="flex items-end gap-4">
            <span className="text-[72px] font-extrabold leading-none tracking-tighter tabular-nums text-slate-100 flex items-center">
              {projectedScore.toFixed(1)}
              {isSimulating && (
                <svg className="animate-spin ml-4 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </span>
            <RiskBadge level={projectedRisk} className={`mb-3 border-transparent bg-slate-800/80 backdrop-blur-md transition-opacity duration-300 ${isSimulating ? 'opacity-50' : 'opacity-100'}`} />
          </div>
        </div>

        {isDiff ? (
          <p className="text-sm font-medium text-slate-300 mt-4 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            {scoreDiff < 0 
              ? `Your adjustments reduce the risk index by ${Math.abs(scoreDiff).toFixed(1)} points.` 
              : `Your adjustments increase the risk index by ${scoreDiff.toFixed(1)} points.`}
          </p>
        ) : (
          <p className="text-sm font-medium text-slate-500 mt-4 leading-relaxed p-3">
            Adjust the environmental variables, then press Analyze to generate a new AI impact report.
          </p>
        )}

        <button 
          onClick={runLLMSimulation} 
          disabled={isSimulating}
          className="mt-6 w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white cursor-wait" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing via Gemini...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8z"/></svg>
              Analyze Impact with Gemini API
            </>
          )}
        </button>
      </div>

      <div className="flex-1 p-4 mt-2 mb-8">
        <h3 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg>
          Environmental Variables
        </h3>
        
        <Card className="flex flex-col gap-6 p-6">
          <SliderInput 
            label="Lighting Density" 
            value={simulation.lighting} 
            onChange={(v) => updateSimulation('lighting', v)} 
          />
          <SliderInput 
            label="Crowd Volume" 
            value={simulation.crowd} 
            onChange={(v) => updateSimulation('crowd', v)} 
          />
          <SliderInput 
            label="Law Enforcement" 
            value={simulation.police} 
            onChange={(v) => updateSimulation('police', v)} 
          />
          <SliderInput 
            label="CCTV Density" 
            value={simulation.cctvDensity} 
            onChange={(v) => updateSimulation('cctvDensity', v)} 
          />
          <SliderInput 
            label="Escape Routes" 
            value={simulation.escapeRoutes} 
            onChange={(v) => updateSimulation('escapeRoutes', v)} 
          />
          <SliderInput 
            label="Recent Incidents" 
            value={simulation.recentIncidents} 
            onChange={(v) => updateSimulation('recentIncidents', v)} 
          />
        </Card>

        {isDiff && projectedScore < activeArea.score && (
          <div className="mt-6 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="m2 12 5.25 5 2.625-3 4.375-7.5L22 4"/></svg>
              <h4 className="text-[#16a34a] font-bold text-sm">Optimal Safety Window</h4>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Based on AI inferences, algorithmic safety stabilizes significantly in Sector {activeArea.id}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
