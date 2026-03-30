import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Component to handle map centering when active area changes
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

export function MapScreen() {
  const { areas, activeAreaId, setActiveArea } = useAppStore();
  const navigate = useNavigate();
  const activeArea = areas.find(a => a.id === activeAreaId) || areas[0];

  // Sort areas so 'high' risk areas render last, appearing on top of 'low' risk areas.
  // This enhances the heatmap visual.
  const sortedAreas = [...areas].sort((a, b) => {
    const rA = a.risk === 'low' ? 1 : a.risk === 'medium' ? 2 : 3;
    const rB = b.risk === 'low' ? 1 : b.risk === 'medium' ? 2 : 3;
    return rA - rB;
  });

  return (
    <div className="h-screen w-full relative">
      {/* Search Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[400]">
        <div className="bg-[#0f172a]/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center px-5 py-4 border border-slate-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            type="text"
            placeholder="Search districts, risks, or assets..."
            className="bg-transparent border-none outline-none ml-4 w-full text-slate-200 placeholder-slate-500 font-bold text-sm"
          />
        </div>
      </div>

      <MapContainer
        center={activeArea.coords}
        zoom={13}
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <MapController center={activeArea.coords} />

        {sortedAreas.map(area => (
          <CircleMarker
            key={area.id}
            center={area.coords}
            // Heatmap styling: very large radius based on risk to show influence bleed
            // Higher risk = slightly wider aura
            radius={area.id === activeAreaId ? 45 : area.risk === 'high' ? 38 : area.risk === 'medium' ? 32 : 28}
            pathOptions={{
              color: area.risk === 'low' ? '#22c55e' : area.risk === 'medium' ? '#facc15' : '#ef4444',
              fillColor: area.risk === 'low' ? '#22c55e' : area.risk === 'medium' ? '#facc15' : '#ef4444',
              fillOpacity: area.id === activeAreaId ? 0.6 : 0.25,
              weight: area.id === activeAreaId ? 3 : 0, // No stroke to allow pure gradient bleeding
              stroke: area.id === activeAreaId
            }}
            eventHandlers={{
              click: () => setActiveArea(area.id)
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-2 min-w-[220px]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{area.name}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Area Selector</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[28px] font-extrabold text-[#ef4444] tabular-nums leading-none block tracking-tighter">{area.score.toFixed(1)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary Concern</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm truncate max-w-[120px]">
                      {(() => {
                        const m = area.metrics;
                        const max = Math.max(m.crimeImpact, m.lightingDeficiency, m.crowdExposure, m.surveillanceGap, m.escapeVulnerability);
                        if (max === m.crimeImpact) return 'Historical Risk';
                        if (max === m.surveillanceGap) return 'Low Surveillance';
                        if (max === m.escapeVulnerability) return 'High Egress';
                        if (max === m.lightingDeficiency) return 'Poor Lighting';
                        return 'Dense Crowd';
                      })()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded border border-slate-300 uppercase tracking-widest">Flagged</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">CCTV</p>
                    <p className="font-bold text-slate-800 text-sm">{area.factors.cctvDensity}/10 <span className="font-bold text-slate-400 text-xs text-center">Dens.</span></p>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Police</p>
                    <p className="font-bold text-slate-800 text-sm">{area.factors.police}/10 <span className="font-bold text-slate-400 text-xs">Patrol</span></p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/sim')}
                  className="w-full bg-[#22c55e] text-slate-900 font-extrabold text-[10px] uppercase tracking-[0.15em] py-3.5 rounded-xl hover:bg-green-500 transition-colors shadow-sm"
                >
                  Launch Simulation Analysis
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-[104px] right-4 z-[400] bg-[#0f172a]/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col gap-3">
          <LegendItem color="bg-[#ef4444]" label="High Risk" />
          <LegendItem color="bg-[#facc15]" label="Moderate" />
          <LegendItem color="bg-[#22c55e]" label="Low Risk" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{label}</span>
    </div>
  );
}
