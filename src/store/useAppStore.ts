import { create } from 'zustand';
import { PredictiveModel } from '../core/ai/PredictiveModel';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Area {
  id: string;
  name: string;
  score: number;
  risk: RiskLevel;
  coords: [number, number];
  factors: {
    lighting: number;        // 0 (dark) to 10 (bright)
    crowd: number;           // 0 (empty) to 10 (dense)
    police: number;          // 0 (none) to 10 (heavy)
    cctvDensity: number;     // 0 (none) to 10 (high density)
    escapeRoutes: number;    // 0 (none) to 10 (many quick exits)
    recentIncidents: number; // 0 (none) to 10 (many recent crimes)
  };
  metrics: {
    crimeImpact: number;
    lightingDeficiency: number;
    crowdExposure: number;
    policePresence: number;
    surveillanceGap: number;
    escapeVulnerability: number;
  };
}

// Handled by PredictiveModel

const createArea = (
  id: string, name: string, lat: number, lng: number, 
  lighting: number, crowd: number, police: number, 
  cctvDensity: number, escapeRoutes: number, recentIncidents: number
): Area => {
  // Ensure factors stay bounded between 0 and 10
  const clamp = (val: number) => Math.max(0, Math.min(10, Math.round(val)));
  
  const factors = { 
    lighting: clamp(lighting), 
    crowd: clamp(crowd), 
    police: clamp(police), 
    cctvDensity: clamp(cctvDensity), 
    escapeRoutes: clamp(escapeRoutes), 
    recentIncidents: clamp(recentIncidents) 
  };
  
  const { score, risk, metrics } = PredictiveModel.predictRiskLocal(factors);
  return { id, name, coords: [lat, lng], factors, score, risk, metrics };
};

const baseHubs = [
  { id: '1', name: 'Connaught Place', lat: 28.6304, lng: 77.2177, f: [8, 8, 7, 7, 3, 5] },
  { id: '2', name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, f: [4, 10, 4, 3, 9, 7] },
  { id: '3', name: 'Hauz Khas Village', lat: 28.5535, lng: 77.1935, f: [6, 8, 5, 5, 7, 6] },
  { id: '4', name: 'Vasant Vihar', lat: 28.5584, lng: 77.1615, f: [9, 2, 8, 9, 2, 1] },
  { id: '5', name: 'Okhla Ind. Area', lat: 28.5355, lng: 77.2803, f: [3, 3, 3, 2, 8, 7] },
  { id: '6', name: 'Chanakyapuri', lat: 28.5959, lng: 77.1895, f: [10, 1, 10, 10, 1, 0] },
  { id: '7', name: 'Seelampur', lat: 28.6640, lng: 77.2679, f: [3, 9, 3, 2, 9, 8] },
  { id: '8', name: 'Rajouri Garden', lat: 28.6415, lng: 77.1209, f: [7, 8, 6, 6, 5, 5] },
  { id: '9', name: 'Rohini', lat: 28.7366, lng: 77.1132, f: [6, 6, 5, 5, 6, 4] },
  { id: '10', name: 'Dwarka', lat: 28.5604, lng: 77.0601, f: [8, 3, 6, 7, 4, 3] },
  { id: '11', name: 'Lajpat Nagar', lat: 28.5677, lng: 77.2433, f: [7, 9, 6, 6, 7, 6] },
  { id: '12', name: 'Karol Bagh', lat: 28.6513, lng: 77.1906, f: [6, 9, 5, 5, 8, 7] },
  { id: '13', name: 'Saket', lat: 28.5245, lng: 77.2066, f: [8, 6, 6, 7, 4, 3] },
  { id: '14', name: 'Janakpuri', lat: 28.6219, lng: 77.0878, f: [7, 5, 6, 6, 5, 4] },
  { id: '15', name: 'Mayur Vihar', lat: 28.6053, lng: 77.2952, f: [6, 6, 5, 5, 6, 4] }
];

const generateDenseDelhiMap = (): Area[] => {
  const generated: Area[] = [];
  let counter = 1;

  baseHubs.forEach(hub => {
    // Add the central hub
    generated.push(createArea(
      counter.toString(), 
      `${hub.name} Central`, 
      hub.lat, hub.lng, 
      hub.f[0], hub.f[1], hub.f[2], hub.f[3], hub.f[4], hub.f[5]
    ));
    counter++;

    // Generate 5-7 sub-sectors around the hub
    const numSpokes = 5 + Math.floor(Math.random() * 3); // 5 to 7 spokes
    for (let i = 0; i < numSpokes; i++) {
      // Random offset between -0.025 and +0.025 for dense clustering
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      
      // Random factor jitter between -2 and +2
      const jitter = () => Math.floor((Math.random() - 0.5) * 4);

      generated.push(createArea(
        counter.toString(),
        `${hub.name} Sector-${i + 1}`,
        hub.lat + latOffset,
        hub.lng + lngOffset,
        hub.f[0] + jitter(),
        hub.f[1] + jitter(),
        hub.f[2] + jitter(),
        hub.f[3] + jitter(),
        hub.f[4] + jitter(),
        hub.f[5] + jitter()
      ));
      counter++;
    }
  });

  return generated;
};

const mockAreas: Area[] = generateDenseDelhiMap();

interface AppState {
  areas: Area[];
  activeAreaId: string | null;
  simulation: Area['factors'];
  simScore: number;
  simRisk: RiskLevel;
  isSimulating: boolean;
  setActiveArea: (id: string) => void;
  updateSimulation: (factor: keyof Area['factors'], value: number) => void;
  resetSimulation: () => void;
  runLLMSimulation: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  areas: mockAreas,
  activeAreaId: '1',
  simulation: { ...mockAreas[0].factors },
  simScore: mockAreas[0].score,
  simRisk: mockAreas[0].risk,
  isSimulating: false,
  
  setActiveArea: (id) => {
    const area = get().areas.find(a => a.id === id);
    if (area) {
      set({ 
        activeAreaId: id,
        simulation: { ...area.factors },
        simScore: area.score,
        simRisk: area.risk
      });
    }
  },
  
  updateSimulation: (factor, value) => {
    set((state) => ({
      simulation: {
        ...state.simulation,
        [factor]: value
      }
    }));
  },
  
  resetSimulation: () => {
    const activeArea = get().areas.find(a => a.id === get().activeAreaId);
    if (activeArea) {
      set({ 
        simulation: { ...activeArea.factors },
        simScore: activeArea.score,
        simRisk: activeArea.risk
      });
    }
  },
  
  runLLMSimulation: async () => {
    set({ isSimulating: true });
    const { simulation } = get();
    // Fetch from LLM Backend
    const result = await PredictiveModel.predictRiskLLM(simulation);
    set({ simScore: result.score, simRisk: result.risk, isSimulating: false });
  }
}));
