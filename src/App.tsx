import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { MapScreen } from './screens/MapScreen';
import { SimulationScreen } from './screens/SimulationScreen';
import { ReportsScreen } from './screens/ReportsScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background pb-[84px] relative">
        <Routes>
          <Route path="/" element={<ReportsScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/sim" element={<SimulationScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
